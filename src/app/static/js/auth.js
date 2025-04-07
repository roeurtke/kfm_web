const apiBaseUrl = window.API_BASE_URL || 'http://127.0.0.1:8000';  // Set from Django template
const maxTokenRefreshAttempts = 1;

// =================== Refresh the access token ===================
window.RefreshToken = async function() {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            console.warn('No refresh token - redirecting to login');
            clearAuthTokens();
            redirectToLogin('no_refresh_token');
            return null;
        }

        const response = await fetch(`${apiBaseUrl}/api/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Refresh failed with status ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        
        // Store new refresh token if provided (rotation)
        if (data.refresh) {
            localStorage.setItem('refreshToken', data.refresh);
        }
        
        return data.access;

    } catch (error) {
        console.error('Token refresh failed:', error);
        clearAuthTokens();
        redirectToLogin('token_refresh_failed');
        return null;
    }
};

function clearAuthTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

function redirectToLogin(reason) {
    const params = new URLSearchParams();
    params.set('auth_error', reason);
    window.location.href = `/login/?${params.toString()}`;
}

// =================== Fetch data from the API ===================
window.fetchData = async function(endpoint, retryCount = 0) {
    let accessToken = localStorage.getItem('accessToken');
    
    try {
        const response = await fetch(`${apiBaseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.status === 401 && retryCount < maxTokenRefreshAttempts) {
            const newToken = await window.RefreshToken();
            if (newToken) {
                localStorage.setItem('accessToken', newToken);
                return window.fetchData(endpoint, retryCount + 1);
            }
            return null;
        }

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
};

// =================== Load data into a select element ===================
window.loadData = async function(endpoint, config = {}) {
    const {
        targetElement = null,       // DOM select element to populate
        populateCallback = null,     // Function to handle data rendering
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
        }
        if (alertOnError) {
            showAlert(`Failed to load ${endpoint.split('/')[1]}. Using default options.`, 'warning');
        }
        throw error;
    }
};

// =================== Update data in the API ==================
window.createData = async function(endpoint, data, retryCount = 0) {
    try {
        const response = await fetch(`${apiBaseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(data)
        });

        // Token refresh handling
        if (response.status === 401 && retryCount < maxTokenRefreshAttempts) {
            const newToken = await window.RefreshToken();
            if (newToken) {
                localStorage.setItem('accessToken', newToken);
                return window.createData(endpoint, data, retryCount + 1);
            }
            throw new Error('Token refresh failed');
        }

        // Special handling for validation errors
        if (response.status === 400) {
            const errorData = await response.json();
            return { 
                success: false, 
                error: 'Validation failed', 
                details: errorData, 
                status: 400 
            };
        }

        // General error handling
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return { 
            success: true, 
            data: await response.json() 
        };

    } catch (error) {
        console.error(`createData error (${endpoint}):`, error);
        return {
            success: false,
            error: error.message,
            details: null
        };
    }
};

// =================== Update data in the API ==================
window.updateData = async function(endpoint, data, retryCount = 0) {
    try {
        const response = await fetch(`${apiBaseUrl}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(data)
        });

        if (response.status === 401 && retryCount < maxTokenRefreshAttempts) {
            const newToken = await window.RefreshToken();
            if (newToken) {
                localStorage.setItem('accessToken', newToken);
                return window.updateData(endpoint, data, retryCount + 1);
            }
            throw new Error('Token refresh failed');
        }

        if (response.status === 400) {
            const errorData = await response.json();
            return { 
                success: false, 
                error: 'Validation failed', 
                details: errorData, 
                status: 400 
            };
        }

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return { 
            success: true, 
            data: await response.json() 
        };

    } catch (error) {
        console.error(`updateData error (${endpoint}):`, error);
        return {
            success: false,
            error: error.message,
            details: null
        };
    }
};

// ================== Backend Health Check ==================
window.checkBackend = async function() {
    const backendUrl = "https://jsonplaceholder.typicode.com/posts/1";
    const timeoutDuration = 3000;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

        const response = await fetch(backendUrl, {
            signal: controller.signal,
            headers: {'Content-Type': 'application/json'},
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend error: ${response.status} ${response.statusText}`);
        }

        console.log("Backend is healthy");
    } catch (error) {
        console.error("Backend is down:", error.message);
        if (window.location.pathname !== "/login/") {
            redirectToLogin('backend_down');
        }
    }
};

// ================== Logout Function ==================
window.logoutUser = async function() {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token || !refreshToken) {
        clearAuthTokens();
        redirectToLogin('no_tokens');
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/logout/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Logout failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        clearAuthTokens();
        redirectToLogin('user_logged_out');
    }
};