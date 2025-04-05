const apiBaseUrl = window.API_BASE_URL || 'http://127.0.0.1:8000';  // Set from Django template
const maxTokenRefreshAttempts = 1;

window.RefreshToken = async function() {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await fetch(`${apiBaseUrl}/api/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (!response.ok) throw new Error('Token refresh failed');
        
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);  // Store new access token
        return data.access;

    } catch (error) {
        console.error('Token refresh error:', error);
        window.location.href = '/login/';  // Redirect to Django login page
        return null;
    }
};

// Add the new global fetchData function
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