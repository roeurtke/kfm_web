from django.shortcuts import render
from .utils import should_show_collapse


def error_404(request):
    return render(request, '404.html')

def index(request):
    return render(request, 'dashboard.html')

def login_view(request):
    context = {
        'show_collapse_cash_flow': should_show_collapse(request),
    }
    return render(request, 'login.html', context)

def register(request):
    context = {
        'show_collapse_cash_flow': should_show_collapse(request),
    }
    return render(request, 'register.html', context)

def income(request):
    context = {
        'show_collapse_cash_flow': should_show_collapse(request),
    }
    return render(request, 'incomes/list_income.html', context)

def expense(request):
    context = {
        'show_collapse_cash_flow': should_show_collapse(request),
    }
    return render(request, 'expenses/list_expense.html', context)

def income_cetegory(request):
    context = {
        'show_collapse_cash_flow': should_show_collapse(request),
    }
    return render(request, 'income_cetegories/list_income_category.html', context)

def expense_category(request):
    context = {
        'show_collapse_cash_flow': should_show_collapse(request),
    }
    return render(request, 'expense_categories/list_expense_category.html', context)

def user(request):
    context = {
        'show_collapse_setting': should_show_collapse(request),
    }
    return render(request, 'users/list_user.html', context)

def create_user(request):
    context = {
        'show_collapse_setting': should_show_collapse(request),
    }
    return render(request, 'users/form_create_user.html', context)

def view_user(request, user_id):
    return render(request, 'users/form_view_user.html', {'user_id': user_id})

def edit_user(request, user_id):
    return render(request, 'users/form_edit_user.html', {'user_id': user_id})

def role(request):
    context = {
        'show_collapse_setting': should_show_collapse(request),
    }
    return render(request, 'roles/list_role.html', context)

def permission(request):
    context = {
        'show_collapse_setting': should_show_collapse(request),
    }
    return render(request, 'permissions/list_permission.html', context)
