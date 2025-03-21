from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.index, name='dashboard'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register, name='register'),
]
