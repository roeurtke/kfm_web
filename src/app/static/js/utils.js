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
window.populateSelect = function(data, selectElement, defaultText, selectedValue) {
    selectElement.innerHTML = `<option value="" disabled selected>${defaultText}</option>`;
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        if (item.id == selectedValue) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
};

// Error Handling Utilities
window.handleApiError = function(result, defaultMessage = 'Operation failed') {
    let errorMessage = defaultMessage;
    
    if (result.status === 400 && result.details?.errors) {
        errorMessage = Object.entries(result.details.errors)
            .map(([field, errors]) => `<strong>${field}:</strong> ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('<br>');
    } else if (result.details?.message) {
        errorMessage = result.details.message;
    } else if (result.error) {
        errorMessage = result.error;
    }
    
    window.showAlert(errorMessage, 'danger');
    return errorMessage; // Optional: return for further processing
};

window.handleUnexpectedError = function(error, context = '', defaultMessage = 'An unexpected error occurred') {
    console.error(`${context} error:`, error);
    
    let message = defaultMessage;
    if (error instanceof TypeError) {
        message = 'Network error - please check your connection';
    } else if (error.message?.includes('Failed to fetch')) {
        message = 'Could not connect to the server';
    } else if (error.message) {
        message = error.message;
    }
    
    window.showAlert(message, 'danger');
    return message; // Optional: return for logging
};