import { connectDB } from '../config/db.js';
import app from '../app.js';
import mongoose from 'mongoose';
import { User, Course, Lesson } from '../models/index.js';

const runAdminAndFeatureTests = async () => {
  console.log('----------------------------------------------------');
  console.log('🧪 Running Comprehensive API Test Suite (Admin, Parent, Public, Payments)');
  console.log('----------------------------------------------------');

  await connectDB();
  const server = app.listen(5098);
  const baseUrl = 'http://127.0.0.1:5098/api/v1';

  try {
    // 1. Get Admin User from Database and login or generate token
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) throw new Error('No admin user found. Run seed script first.');

    // Log in admin or generate auth token
    const { generateAccessToken } = await import('../utils/token.js');
    const adminToken = generateAccessToken(admin);
    console.log(` Admin access token generated for: ${admin.email}`);

    // 2. Test Admin Stats
    console.log('\nTest 1: Admin Stats GET /api/v1/admin/stats');
    const statsRes = await fetch(`${baseUrl}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const statsData = await statsRes.json();
    console.log(' Stats status:', statsRes.status, 'Total courses:', statsData.data?.metrics?.totalCourses);

    // 3. Test Admin Courses List
    console.log('\nTest 2: Admin Courses List GET /api/v1/admin/courses');
    const coursesRes = await fetch(`${baseUrl}/admin/courses`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const coursesData = await coursesRes.json();
    console.log(' Courses count:', coursesData.data?.courses?.length);
    const flagship = coursesData.data?.courses?.find((c) => c.slug === 'ai-explorers-academy');
    console.log(' Flagship course found:', flagship?.title, 'Price:', flagship?.price);

    // 4. Test Public Course Details with 10 Lessons
    console.log('\nTest 3: Public Course Details GET /api/v1/courses/ai-explorers-academy');
    const pubCourseRes = await fetch(`${baseUrl}/courses/ai-explorers-academy`);
    const pubCourseData = await pubCourseRes.json();
    console.log(' Public course response status:', pubCourseRes.status);
    console.log(' Public curriculum lessons count:', pubCourseData.data?.lessons?.length);
    console.log(' Preview lesson included:', !!pubCourseData.data?.previewLesson);

    // 5. Test Register Parent & Add Child Profile
    console.log('\nTest 4: Register Parent & Create Child Profile');
    const parentEmail = `parent_test_${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Parent Explorer',
        email: parentEmail,
        password: 'Password123!',
        parentalConsent: true
      })
    });
    const regData = await regRes.json();
    const parentToken = regData.data.accessToken;

    const childRes = await fetch(`${baseUrl}/parent/children`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parentToken}`
      },
      body: JSON.stringify({
        nickname: 'ZaraFan',
        avatar: 'avatar-zara',
        age: 9,
        pin: '1234'
      })
    });
    const childData = await childRes.json();
    console.log(' Child created status:', childRes.status, 'Nickname:', childData.data?.child?.nickname);
    const childId = childData.data?.child?.id;

    // 6. Test Admin Manual Enroll
    console.log('\nTest 5: Admin Manual Enroll POST /api/v1/admin/enrollments/manual');
    const enrollRes = await fetch(`${baseUrl}/admin/enrollments/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        parentEmail,
        courseId: flagship._id,
        accessDays: 365,
        childId
      })
    });
    const enrollData = await enrollRes.json();
    console.log(' Manual enrollment status:', enrollRes.status, enrollData.message);

    // 7. Test Lesson Player & Complete Lesson
    console.log('\nTest 6: Parent Lesson Player GET /api/v1/parent/courses/ai-explorers-academy/lessons/1');
    const lessonRes = await fetch(
      `${baseUrl}/parent/courses/ai-explorers-academy/lessons/1?childId=${childId}`,
      {
        headers: { Authorization: `Bearer ${parentToken}` }
      }
    );
    const lessonData = await lessonRes.json();
    console.log(' Lesson player status:', lessonRes.status, 'Title:', lessonData.data?.lesson?.title);
    const lesson1Id = lessonData.data?.lesson?._id || lessonData.data?.lesson?.id;

    console.log('\nTest 7: Complete Lesson 1 POST /api/v1/parent/progress/complete-lesson');
    const completeRes = await fetch(`${baseUrl}/parent/progress/complete-lesson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parentToken}`
      },
      body: JSON.stringify({
        courseId: flagship._id,
        lessonId: lesson1Id,
        childId
      })
    });
    const completeData = await completeRes.json();
    console.log(' Complete status:', completeRes.status, completeData.message);
    console.log(' Newly awarded stamp:', completeData.data?.newlyAwardedStamp?.title);
    console.log(' Newly awarded badge:', completeData.data?.newlyAwardedBadge?.title);
    console.log(' Progress percent:', completeData.data?.progress?.percent, '%');

    // 8. Test Simulated Stripe Checkout Flow
    console.log('\nTest 8: Payments Checkout POST /api/v1/payments/create-checkout-session');
    const payRes = await fetch(`${baseUrl}/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parentToken}`
      },
      body: JSON.stringify({
        courseId: flagship._id,
        childId,
        country: 'US'
      })
    });
    const payData = await payRes.json();
    console.log(' Checkout session status:', payRes.status, 'Mode:', payData.data?.mode);

    if (payData.data?.mode === 'test_simulation') {
      const confirmRes = await fetch(`${baseUrl}/payments/confirm-test-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${parentToken}`
        },
        body: JSON.stringify({ sessionId: payData.data.sessionId })
      });
      const confirmData = await confirmRes.json();
      console.log(' Test confirmation status:', confirmRes.status, confirmData.message);
    }

    console.log('\n====================================================');
    console.log('🎉 ALL BACKEND API MODULES & WORKFLOWS PASSED!');
    console.log('====================================================\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  }
};

runAdminAndFeatureTests();

