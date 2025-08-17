from django.urls import path
from . import views

urlpatterns = [
    path('hackrx/run', views.run_rag, name='run_rag'),
    path('hackrx/run-file', views.run_rag_file, name='run_rag_file'),
    path('hackrx/stream-file', views.stream_rag_file, name='stream_rag_file'),
    path('health', views.health_check, name='health_check'),
]
