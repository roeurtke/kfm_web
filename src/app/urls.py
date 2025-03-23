from django.urls import path
from . import views

urlpatterns = [
    # Login, register and dashboard views
    path('', views.login_view, name='login'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register, name='register'),
    path('dashboard/', views.index, name='dashboard'),
    
    # Cash flow management
    path('incomes/', views.income, name='incomes'),
    path('expanses/', views.expense, name='expanses'),
    path('income_categories/', views.income_cetegory, name='income_categories'),
    path('expense_categories/', views.expense_category, name='expense_categories'),
    
    # Settings management
    path('users/', views.user, name='users'),
    path('roles/', views.role, name='roles'),
    path('permissions/', views.permission, name='permissions'),
]
