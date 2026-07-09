import axios from 'axios'

const API = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api'
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
});

export const authAPI = {
    register: (data) => API.post('/auth/register', data),
    login: (data) => API.post('/auth/login', data),
    getMe: () => API.get('/auth/me')
};

export const transactionAPI = {
    sendMoney: (data) => API.post('/transactions/send', data),
    getTransactions: (params) => API.get('/transactions', { params }),
    getTransaction: (params) => API.get('/transactions', { params }),
    getAnalytics: () => API.get('/transactions/analytics')
};

export const billAPI = {
    payBill: (data) => API.post('/bills/pay', data),
    getSavedBills: () => API.get('/bills/saved')
};

export const userAPI = {
    updateProfile: (data) => API.put('/user/profile', data),
    updatePassword: (data) => API.put('/user/password', data),
    createBudget: (data) => API.post('/user/budget', data),
    getBudgets: () => API.get('/user/budget')
};

export const adminAPI = {
    getAllUsers: () => API.get('/admin/users'),
    getAllTransactions: () => API.get('/admin/transactions'),
    getAllTransaction: () => API.get('/admin/transactions'),
    verifyKYC: (userId) => API.put('/admin/kyc/' + userId),
    createOffer: (data) => API.post('/admin/offers', data),
    getOffers: () => API.get('/admin/offers'),
    getDashboardStats: () => API.get('/admin/stats')
};

export default API;
