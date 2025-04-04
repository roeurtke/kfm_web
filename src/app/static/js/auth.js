const apiBaseUrl = window.API_BASE_URL || 'http://127.0.0.1:8000';  // Set from Django template

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