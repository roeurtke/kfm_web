from django.shortcuts import render

# Helper function to check if the current path contains any of the specified keys
def should_show_collapse(request):
    paths_to_check = ['incomes', 'expanses', 'income_categories', 'expense_categories']
    return any(key in request.path for key in paths_to_check)

# Views
def index(request):
    context = {
        'show_collapse': should_show_collapse(request),
    }
    return render(request, 'dashboard.html', context)

def login_view(request):
    context = {
        'show_collapse': should_show_collapse(request),
    }
    return render(request, 'login.html', context)

def register(request):
    context = {
        'show_collapse': should_show_collapse(request),
    }
    return render(request, 'register.html', context)

def income(request):
    context = {
        'show_collapse': should_show_collapse(request),
    }
    return render(request, 'incomes/list_income.html', context)

def expense(request):
    context = {
        'show_collapse': should_show_collapse(request),
    }
    return render(request, 'expanses/list_expense.html', context)

def income_cetegory(request):
    context = {
        'show_collapse': should_show_collapse(request),
    }
    return render(request, 'income_cetegories/list_income_category.html', context)

def expense_category(request):
    context = {
        'show_collapse': should_show_collapse(request),
    }
    return render(request, 'expense_categories/list_expense_category.html', context)