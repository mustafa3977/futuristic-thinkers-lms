import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guards
import PublicLayout from './components/public/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import ExploreCourses from './pages/public/ExploreCourses';
import CourseDetail from './pages/public/CourseDetail';
import LearningHub from './pages/public/LearningHub';
import ArticleDetail from './pages/public/ArticleDetail';
import ForParents from './pages/public/ForParents';
import About from './pages/public/About';
import FAQPage from './pages/public/FAQPage';
import Contact from './pages/public/Contact';
import PolicyPage from './pages/public/PolicyPage';
import PaymentSuccess from './pages/public/PaymentSuccess';
import NotFound from './pages/public/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Parent Dashboard Pages
import ParentDashboard from './pages/dashboard/ParentDashboard';
import ParentOrders from './pages/dashboard/ParentOrders';
import ParentSettings from './pages/dashboard/ParentSettings';

// Learner Lesson Player
import LessonPlayer from './pages/player/LessonPlayer';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminCurriculum from './pages/admin/AdminCurriculum';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEnrollments from './pages/admin/AdminEnrollments';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminBlog from './pages/admin/AdminBlog';
import AdminFaqs from './pages/admin/AdminFaqs';
import AdminPages from './pages/admin/AdminPages';
import AdminContact from './pages/admin/AdminContact';
import AdminSettings from './pages/admin/AdminSettings';
import AdminActivity from './pages/admin/AdminActivity';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public & Customer Layout */}
        <Route element={<PublicLayout />}>
          {/* Public Views */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<ExploreCourses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/hub" element={<LearningHub />} />
          <Route path="/hub/:slug" element={<ArticleDetail />} />
          <Route path="/for-parents" element={<ForParents />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<Contact />} />

          {/* Legal & Policy Pages */}
          <Route path="/privacy" element={<PolicyPage />} />
          <Route path="/terms" element={<PolicyPage />} />
          <Route path="/refund" element={<PolicyPage />} />
          <Route path="/accessibility" element={<PolicyPage />} />

          {/* Auth Views */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Payment Success Confirmation */}
          <Route path="/payment/success" element={<PaymentSuccess />} />

          {/* Protected Parent Portal */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/orders"
            element={
              <ProtectedRoute>
                <ParentOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <ParentSettings />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Dedicated Lesson Player (Child Profile experience - minimal distractions) */}
        <Route
          path="/learn/:courseSlug/lesson/:order"
          element={
            <ProtectedRoute>
              <LessonPlayer />
            </ProtectedRoute>
          }
        />

        {/* Admin Control Panel (Role=Admin Only) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="curriculum/:courseId" element={<AdminCurriculum />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="faqs" element={<AdminFaqs />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="contact" element={<AdminContact />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="activity" element={<AdminActivity />} />
        </Route>

        {/* 404 Catch-All */}
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
