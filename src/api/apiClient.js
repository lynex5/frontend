export const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-g3hl.onrender.com/api';

const handleResponse = async (res) => {
    if (res.status === 401 || res.status === 403) {
        if (window.location.pathname !== '/login') {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }
    if (!res.ok) {
        let err;
        try { err = await res.json(); } catch (e) { err = { message: 'Request failed' }; }
        throw new Error(err.message || 'Request failed');
    }
    // Return json if there is a body, else null
    return res.text().then(text => text ? JSON.parse(text) : null);
};

export const get = (endpoint) => fetch(`${BASE_URL}${endpoint}`).then(handleResponse);

export const authGet = (endpoint) => fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
}).then(handleResponse);

export const authPost = (endpoint, body) => fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(body)
}).then(handleResponse);

export const authPut = (endpoint, body) => fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(body)
}).then(handleResponse);

export const authDelete = (endpoint) => fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
}).then(handleResponse);

export const authUpload = (endpoint, formData) => fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: formData
}).then(handleResponse);
