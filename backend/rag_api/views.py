import os
import tempfile
import json
from django.http import JsonResponse, StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.utils.decorators import method_decorator
from django.views import View
from utils.document_processor import DocumentProcessor
from utils.rag_service import RAGService
from dotenv import load_dotenv

load_dotenv()
document_processor = DocumentProcessor()
rag_service = RAGService()

@csrf_exempt
@require_POST
def run_rag(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        documents_url = data.get('documents')
        questions = data.get('questions', [])
        if not documents_url or not questions:
            return JsonResponse({"error": "Both 'documents' and 'questions' are required"}, status=400)
        vector_db = document_processor.process_document_from_url(documents_url)
        answers = [rag_service.get_answer(vector_db, q) for q in questions]
        return JsonResponse({"answers": answers})
    except Exception as e:
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)

@csrf_exempt
@require_POST
def run_rag_file(request):
    try:
        uploaded = request.FILES.get('file')
        if not uploaded or uploaded.name == '':
            return JsonResponse({"error": "Missing or empty 'file' in form data"}, status=400)
        questions_raw = request.POST.get('questions')
        if not questions_raw:
            return JsonResponse({"error": "Missing 'questions' in form data"}, status=400)
        try:
            parsed = json.loads(questions_raw)
            questions = [str(q) for q in parsed] if isinstance(parsed, list) else []
        except Exception:
            questions = [line.strip() for line in questions_raw.splitlines() if line.strip()]
        if not questions:
            return JsonResponse({"error": "No valid questions provided"}, status=400)
        suffix = os.path.splitext(uploaded.name)[1] or ''
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            for chunk in uploaded.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name
        try:
            vector_db = document_processor.process_document_from_file(tmp_path)
        finally:
            try:
                os.unlink(tmp_path)
            except Exception:
                pass
        answers = [rag_service.get_answer(vector_db, q) for q in questions]
        return JsonResponse({"answers": answers})
    except Exception as e:
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)

@require_GET
def health_check(request):
    return JsonResponse({"status": "healthy", "message": "RAG service is running"})

@csrf_exempt
@require_POST
def stream_rag_file(request):
    uploaded = request.FILES.get('file')
    questions_raw = request.POST.get('questions')
    if not uploaded or uploaded.name == '':
        return JsonResponse({"error": "Missing or empty 'file' in form data"}, status=400)
    if not questions_raw:
        return JsonResponse({"error": "Missing 'questions' in form data"}, status=400)
    try:
        parsed = json.loads(questions_raw)
        questions = [str(q) for q in parsed] if isinstance(parsed, list) else []
    except Exception:
        questions = [line.strip() for line in questions_raw.splitlines() if line.strip()]
    if not questions:
        return JsonResponse({"error": "No valid questions provided"}, status=400)
    def event_stream():
        suffix = os.path.splitext(uploaded.name)[1] or ''
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            for chunk in uploaded.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name
        try:
            yield f"data: {{\"type\": \"start\", \"filename\": \"{uploaded.name}\", \"questions\": {len(questions)}}}\n\n"
            vector_db = document_processor.process_document_from_file(tmp_path)
            for idx, question in enumerate(questions):
                yield f"data: {{\"type\": \"question\", \"index\": {idx}, \"question\": \"{question}\"}}\n\n"
                try:
                    answer = rag_service.get_answer(vector_db, question)
                except Exception as e:
                    yield f"data: {{\"type\": \"error\", \"index\": {idx}, \"message\": \"{str(e)}\"}}\n\n"
                    continue
                chunk_size = 80
                for i in range(0, len(answer), chunk_size):
                    delta = answer[i:i+chunk_size].replace('\\', '\\\\').replace('"', '\\"')
                    yield f"data: {{\"type\": \"answer\", \"index\": {idx}, \"delta\": \"{delta}\"}}\n\n"
                yield f"data: {{\"type\": \"answer_done\", \"index\": {idx}}}\n\n"
            yield f"data: {{\"type\": \"done\"}}\n\n"
        finally:
            try:
                os.unlink(tmp_path)
            except Exception:
                pass
    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'
    return response
