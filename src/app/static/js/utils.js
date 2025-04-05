// Alert utilities
window.showAlert = (message, type, duration = 5000) => {
    document.querySelector('.alert')?.remove();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `${message}<button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span></button>`;
    
    document.querySelector('.card-body')?.prepend(alertDiv);
    setTimeout(() => alertDiv.remove(), duration);
};

// Form utilities
window.validateForm = (formData, requiredFields) => {
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length) {
        showAlert('Please fill in all required fields', 'danger');
        return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return false;
    }
    
    return true;
};

// Select population utility
window.populateSelect = (data, selectElement, placeholder = '-- Select --', valueField = 'id', textField = 'name') => {
    selectElement.innerHTML = '';
    selectElement.add(new Option(placeholder, '', true, false));
    selectElement.options[0].disabled = true;
    data.forEach(item => selectElement.add(new Option(item[textField], item[valueField])));
};