import axios from 'axios';
import { ResumeData } from '@/types/resume';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const auth = {
    register: (userData: any) => api.post('/auth/register', userData),
    login: (userData: any) => api.post('/auth/login', userData),
};

export const resume = {
    get: () => api.get('/resume'),
    save: (resumeData: ResumeData) => api.post('/resume', resumeData),
    download: (format: 'pdf', data: ResumeData) => api.post(`/resume/download/${format}`, data, { responseType: 'blob' }),
};

export const ai = {
    enhance: (text: string) => api.post('/ai/enhance', { text }),
};

export default api;
