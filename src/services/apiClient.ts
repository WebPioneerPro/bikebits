export const apiClient = {
    async fetch(url: string, options: RequestInit = {}) {
        const token = localStorage.getItem('accessToken');
        const headers = new Headers(options.headers || {});

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        if (options.body && !headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            // Handle unauthorized (optional: logout user)
            localStorage.removeItem('accessToken');
            // window.location.href = '/signin';
        }

        return response;
    }
};
