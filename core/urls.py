from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/contact/', views.contact_api, name='contact_api'),
    path('api/track/', views.track_api, name='track_api'),
    path('api/health/', views.health, name='health'),
    path('admin-messages/', views.admin_messages, name='admin_messages'),
]