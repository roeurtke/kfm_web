from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('login/', views.login_view, name='login'),
    # path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.index, name='dashboard'),
    path('register/', views.register, name='register'),
    path('incomes/', views.income, name='incomes'),
    path('expanses/', views.expense, name='expanses'),
    path('income_categories/', views.income_cetegory, name='income_categories'),
    path('expense_categories/', views.expense_category, name='expense_categories'),
]
