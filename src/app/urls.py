from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('login/', views.login_view, name='login'),
    # path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.index, name='dashboard'),
    path('register/', views.register, name='register'),
    path('expanses/', views.expense, name='expanses'),
]
