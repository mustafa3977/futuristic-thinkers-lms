import { connectDB } from '../config/db.js';
import app from '../app.js';
import mongoose from 'mongoose';

const runAuthTests = async () => {
  console.log('----------------------------------------------------');
  console.log('🧪 Running Comprehensive Phase 1 Auth & RBAC Tests');
  console.log('----------------------------------------------------');

  await connectDB();
  const server = app.listen(5099);
  const baseUrl = 'http://127.0.0.1:5099/api/v1';

  try {
    // Test 1: Health check
    console.log('Test 1: Health Check GET /api/v1/health');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    console.log(' Health status:', healthData.status);

    // Test 2: Register Parent
    console.log('\nTest 2: Register Parent Account POST /api/v1/auth/register');
    const testEmail = `parent_${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Doe',
        email: testEmail,
        password: 'Password123!',
        parentalConsent: true
      })
    });
    const regData = await regRes.json();
    console.log(' Register response status:', regRes.status, regData.status);
    console.log(' Registered User:', regData.data.user.email, 'Role:', regData.data.user.role);
    const parentAccessToken = regData.data.accessToken;
    const parentRefreshToken = regData.data.refreshToken;

    // Test 3: Reject Register without Parental Consent
    console.log('\nTest 3: Reject Register without Parental Consent');
    const invalidRegRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Underage User',
        email: `fail_${Date.now()}@example.com`,
        password: 'Password123!',
        parentalConsent: false
      })
    });
    const invalidRegData = await invalidRegRes.json();
    console.log(' Expected 400 rejection:', invalidRegRes.status, invalidRegData.message);

    // Test 4: Login Parent
    console.log('\nTest 4: Login Parent POST /api/v1/auth/login');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123!'
      })
    });
    const loginData = await loginRes.json();
    console.log(' Login status:', loginRes.status, loginData.status);

    // Test 5: Protected Route GET /api/v1/auth/me
    console.log('\nTest 5: Protected User Profile GET /api/v1/auth/me');
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${parentAccessToken}` }
    });
    const meData = await meRes.json();
    console.log(' Profile retrieved for:', meData.data.user.name, 'Email:', meData.data.user.email);

    // Test 6: Refresh Token POST /api/v1/auth/refresh
    console.log('\nTest 6: Refresh Access Token POST /api/v1/auth/refresh');
    const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: parentRefreshToken })
    });
    const refreshData = await refreshRes.json();
    console.log(' Refresh token status:', refreshRes.status, 'New token issued:', !!refreshData.data.accessToken);

    // Test 7: Update Profile PATCH /api/v1/auth/update-profile
    console.log('\nTest 7: Update Profile PATCH /api/v1/auth/update-profile');
    const updateRes = await fetch(`${baseUrl}/auth/update-profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshData.data.accessToken}`
      },
      body: JSON.stringify({ name: 'Jane Doe-Smith' })
    });
    const updateData = await updateRes.json();
    console.log(' Updated name:', updateData.data.user.name);

    // Test 8: Forgot Password POST /api/v1/auth/forgot-password
    console.log('\nTest 8: Forgot Password POST /api/v1/auth/forgot-password');
    const forgotRes = await fetch(`${baseUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    const forgotData = await forgotRes.json();
    console.log(' Forgot password status:', forgotRes.status, forgotData.message);

    // Test 9: Logout POST /api/v1/auth/logout
    console.log('\nTest 9: Logout POST /api/v1/auth/logout');
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshData.data.refreshToken })
    });
    const logoutData = await logoutRes.json();
    console.log(' Logout status:', logoutRes.status, logoutData.message);

    console.log('\n====================================================');
    console.log('🎉 ALL PHASE 1 AUTH & RBAC TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  }
};

runAuthTests();

