from django.shortcuts import render

def index(request):
    return render(request, 'dashboard.html')

def login_view(request):
    return render(request, 'login.html')

def register(request):
    return render(request, 'register.html')

def income(request):
    return render(request, 'incomes/list_income.html')

def expense(request):
    return render(request, 'expanses/list_expense.html')

def income_cetegory(request):
    return render(request, 'income_cetegories/list_income_category.html')

def expense_category(request):
    return render(request, 'expense_categories/list_expense_category.html')