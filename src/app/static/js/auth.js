const apiBaseUrl = window.API_BASE_URL || 'http://127.0.0.1:8000';
const maxTokenRefreshAttempts = 1;

// Improved token refresh with cookie support
window.RefreshToken = async function() {
    try {
        const response = await fetch(`${apiBaseUrl}/api/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include' // Important for cookie-based auth
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Refresh failed with status ${response.status}`);
        }

        const data = await response.json();
        if (!data.access) {
            throw new Error('No access token in response');
        }

        localStorage.setItem('accessToken', data.access);
        return data.access;

    } catch (error) {
        console.error('Token refresh failed:', error);
        clearAuthTokens();
        redirectToLogin('token_refresh_failed');
        return null;
    }
};

// Consolidated helper functions
const clearAuthTokens = () => {
    localStorage.removeItem('accessToken');
    // Don't remove refresh token if it's HttpOnly cookie
};

const redirectToLogin = (reason) => {
    window.location.href = `/login/?auth_error=${encodeURIComponent(reason)}`;
};

// Base request function to reduce code duplication
async function makeRequest(method, endpoint, data = null, retryCount = 0) {
    try {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            credentials: 'include'
        };

        if (data) config.body = JSON.stringify(data);

        const response = await fetch(`${apiBaseUrl}${endpoint}`, config);

        // Handle token refresh
        if (response.status === 401 && retryCount < maxTokenRefreshAttempts) {
            const newToken = await window.RefreshToken();
            if (newToken) {
                return makeRequest(method, endpoint, data, retryCount + 1);
            }
            throw new Error('Token refresh failed');
        }

        // Handle different response statuses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Request failed with status ${response.status}`);
        }

        return response.status === 204 ? null : await response.json();

    } catch (error) {
        console.error(`${method} request error (${endpoint}):`, error);
        throw error;
    }
}

// CRUD operations using the base makeRequest function
window.fetchData = (endpoint) => makeRequest('GET', endpoint);
window.createData = (endpoint, data) => makeRequest('POST', endpoint, data);
window.updateData = (endpoint, data) => makeRequest('PUT', endpoint, data);
window.deleteData = (endpoint) => makeRequest('DELETE', endpoint);

// Improved loadData function
window.loadData = async function(endpoint, config = {}) {
    const {
        targetElement = null,
        populateCallback = null,
        defaultOptions = '<option value="" disabled selected>-- Select --</option>',
        alertOnError = true,
        required = true
    } = config;

    try {
        const data = await window.fetchData(endpoint);
        
        if (populateCallback && targetElement) {
            populateCallback(data, targetElement);
            if (required) targetElement.required = true;
        }
        return data;

    } catch (error) {
        console.error(`Error loading ${endpoint}:`, error);
        if (targetElement) {
            targetElement.innerHTML = defaultOptions;
            targetElement.required = false;
        }
        if (alertOnError && window.showAlert) {
            window.showAlert(`Failed to load data. Please try again.`, 'error');
        }
        return null;
    }
};