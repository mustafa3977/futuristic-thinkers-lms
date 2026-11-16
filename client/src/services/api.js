import axios from 'axios';
import * as mocks from './mockData.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback resolver for offline / standalone frontend demo mode
function resolveOfflineMock(config) {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  // Public & Courses
  if (url.includes('/courses/ai-explorers-academy')) {
    return { status: 200, data: { status: 'success', data: { course: mocks.mockCourses[0], lessons: mocks.mockLessons } } };
  }
  if (url.includes('/courses')) {
    return { status: 200, data: { status: 'success', data: { courses: mocks.mockCourses, total: mocks.mockCourses.length } } };
  }
  if (url.includes('/categories')) {
    return { status: 200, data: { status: 'success', data: { categories: mocks.mockCategories } } };
  }
  if (url.includes('/articles')) {
    return { status: 200, data: { status: 'success', data: { articles: mocks.mockArticles } } };
  }
  if (url.includes('/faqs')) {
    return { status: 200, data: { status: 'success', data: { faqs: mocks.mockFaqs } } };
  }
  if (url.includes('/pages/')) {
    const slug = url.split('/pages/')[1]?.split('?')[0];
    const page = mocks.mockPages.find((p) => p.pageSlug === slug) || { pageSlug: slug, title: slug, content: 'Demonstration Policy Content.' };
    return { status: 200, data: { status: 'success', data: { page } } };
  }

  // Admin Endpoints
  if (url.includes('/admin/stats')) {
    return { status: 200, data: { status: 'success', data: mocks.mockAdminStats } };
  }
  if (url.includes('/admin/courses') && url.includes('/lessons')) {
    return { status: 200, data: { status: 'success', data: { lessons: mocks.mockLessons } } };
  }
  if (url.includes('/admin/courses')) {
    return { status: 200, data: { status: 'success', data: { courses: mocks.mockCourses, total: mocks.mockCourses.length } } };
  }
  if (url.includes('/admin/categories')) {
    return { status: 200, data: { status: 'success', data: { categories: mocks.mockCategories } } };
  }
  if (url.includes('/admin/users')) {
    return { status: 200, data: { status: 'success', data: { users: mocks.mockUsers, total: mocks.mockUsers.length } } };
  }
  if (url.includes('/admin/enrollments')) {
    return { status: 200, data: { status: 'success', data: { enrollments: mocks.mockEnrollments, total: mocks.mockEnrollments.length } } };
  }
  if (url.includes('/admin/orders')) {
    return { status: 200, data: { status: 'success', data: { orders: mocks.mockOrders, total: mocks.mockOrders.length, pagination: { total: mocks.mockOrders.length } } } };
  }
  if (url.includes('/admin/coupons')) {
    return { status: 200, data: { status: 'success', data: { coupons: mocks.mockCoupons } } };
  }
  if (url.includes('/admin/articles')) {
    return { status: 200, data: { status: 'success', data: { articles: mocks.mockArticles } } };
  }
  if (url.includes('/admin/faqs')) {
    return { status: 200, data: { status: 'success', data: { faqs: mocks.mockFaqs } } };
  }
  if (url.includes('/admin/pages/')) {
    const slug = url.split('/admin/pages/')[1]?.split('?')[0];
    const page = mocks.mockPages.find((p) => p.pageSlug === slug) || { pageSlug: slug, title: slug, content: 'Demonstration Policy Content.' };
    return { status: 200, data: { status: 'success', data: { page } } };
  }
  if (url.includes('/admin/pages')) {
    return { status: 200, data: { status: 'success', data: { pages: mocks.mockPages } } };
  }
  if (url.includes('/admin/contact-messages')) {
    return { status: 200, data: { status: 'success', data: { messages: mocks.mockContactMessages } } };
  }
  if (url.includes('/admin/settings')) {
    return { status: 200, data: { status: 'success', data: { settingsMap: mocks.mockSettings } } };
  }
  if (url.includes('/admin/activity-logs')) {
    return { status: 200, data: { status: 'success', data: { logs: mocks.mockActivityLogs, pagination: { total: 2, page: 1, pages: 1 } } } };
  }

  // Auth Fallbacks
  if (url.includes('/auth/me')) {
    const saved = localStorage.getItem('currentUser');
    const user = saved ? JSON.parse(saved) : { _id: 'admin_demo', name: 'Futuristic Administrator', email: 'admin@example.com', role: 'admin' };
    return { status: 200, data: { status: 'success', data: { user } } };
  }

  // Fallback for mutations (create/update/delete)
  if (method !== 'get') {
    return { status: 200, data: { status: 'success', message: 'Operation simulated successfully (offline demo mode)' } };
  }

  return { status: 200, data: { status: 'success', data: {} } };
}

// Response interceptor: handle automatic token refresh and offline mock fallback
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If network error (backend offline/skipped), seamlessly serve mock data!
    if (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      const mockResult = resolveOfflineMock(originalRequest);
      if (mockResult) {
        return Promise.resolve(mockResult);
      }
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || '/api/v1'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (res.data?.data?.accessToken) {
          const newToken = res.data.data.accessToken;
          localStorage.setItem('accessToken', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export { api };
export default api;
