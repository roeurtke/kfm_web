from django.shortcuts import render
from .utils import should_show_collapse

# Helper function to generate context
def get_context(request, collapse_key):
    return {collapse_key: should_show_collapse(request)}

# Error handling
def error_404(request, exception):
    return render(request, '404.html', status=404)

# Dashboard and authentication views
def index(request):
    return render(request, 'dashboard.html')

def login_view(request):
    context = get_context(request, 'show_collapse_cash_flow')
    return render(request, 'login.html', context)

def register(request):
    context = get_context(request, 'show_collapse_cash_flow')
    return render(request, 'register.html', context)

# Cash flow management views
def income(request):
    context = get_context(request, 'show_collapse_cash_flow')
    return render(request, 'incomes/list_income.html', context)

def expense(request):
    context = get_context(request, 'show_collapse_cash_flow')
    return render(request, 'expenses/list_expense.html', context)

def income_cetegory(request):
    context = get_context(request, 'show_collapse_cash_flow')
    return render(request, 'income_cetegories/list_income_category.html', context)

def expense_category(request):
    context = get_context(request, 'show_collapse_cash_flow')
    return render(request, 'expense_categories/list_expense_category.html', context)

# User management views
def user(request):
    context = get_context(request, 'show_collapse_setting')
    return render(request, 'users/list_user.html', context)

def create_user(request):
    context = get_context(request, 'show_collapse_setting')
    return render(request, 'users/form_create_user.html', context)

def view_user(request, user_id):
    return render(request, 'users/form_view_user.html', {'user_id': user_id})

def edit_user(request, user_id):
    return render(request, 'users/form_edit_user.html', {'user_id': user_id})

# Role and permission management views
def role(request):
    context = get_context(request, 'show_collapse_setting')
    return render(request, 'roles/list_role.html', context)

def permission(request):
    context = get_context(request, 'show_collapse_setting')
    return render(request, 'permissions/list_permission.html', context)
