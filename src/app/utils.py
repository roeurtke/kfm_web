# Helper function to check if the current path contains any of the specified keys
def should_show_collapse(request):
    paths_to_check = [
        'incomes',
        'expenses',
        'income_categories',
        'expense_categories',
        'users',
        'roles',
        'permissions',
    ]
    return any(key in request.path for key in paths_to_check)