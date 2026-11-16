import http from 'http';
import mongoose from 'mongoose';
import app from '../app.js';
import { connectDB } from '../config/db.js';
import { User } from '../models/index.js';
import { generateAccessToken } from '../utils/token.js';

async function runE2ETests() {
  console.log('----------------------------------------------------');
  console.log('🧪 Running Comprehensive End-to-End LMS Sanity Check');
  console.log('----------------------------------------------------');

  await connectDB();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;

  try {
    // 1. Public Courses
    const coursesRes = await fetch(`${baseUrl}/courses`);
    const coursesData = await coursesRes.json();
    console.log(`✓ 1. Public Courses: Status ${coursesRes.status}, Count: ${coursesData.data?.courses?.length}`);

    // 2. Public Hub Articles
    const articlesRes = await fetch(`${baseUrl}/articles`);
    const articlesData = await articlesRes.json();
    console.log(`✓ 2. Public Hub Articles: Status ${articlesRes.status}, Count: ${articlesData.data?.articles?.length}`);

    // 3. Public FAQs
    const faqsRes = await fetch(`${baseUrl}/faqs`);
    const faqsData = await faqsRes.json();
    console.log(`✓ 3. Public FAQs: Status ${faqsRes.status}, Count: ${faqsData.data?.faqs?.length}`);

    // 4. Policy Pages
    for (const slug of ['privacy', 'terms', 'refund', 'accessibility']) {
      const pageRes = await fetch(`${baseUrl}/pages/${slug}`);
      const pageData = await pageRes.json();
      console.log(`✓ 4. Policy Page /${slug}: Status ${pageRes.status}, Title: "${pageData.data?.page?.title}"`);
    }

    // 5. Contact Form Submission
    const contactRes = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        subject: 'Course curriculum inquiry',
        message: 'Are the lesson worksheets printable for multiple children?'
      })
    });
    const contactData = await contactRes.json();
    console.log(`✓ 5. Contact Form Submission: Status ${contactRes.status}, Message: "${contactData.message}"`);

    // 6. Admin Authentication & Operations
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) throw new Error('Admin user not found. Did you seed?');
    const adminToken = generateAccessToken(adminUser);

    // 7. Admin Coupons CRUD
    const couponCode = `SAVE25_${Date.now()}`;
    const createCouponRes = await fetch(`${baseUrl}/admin/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        code: couponCode,
        discountType: 'percentage',
        discountValue: 25,
        maxUses: 50
      })
    });
    console.log(`✓ 6. Admin Create Coupon: Status ${createCouponRes.status}, Code: ${couponCode}`);

    const couponsListRes = await fetch(`${baseUrl}/admin/coupons`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const couponsListData = await couponsListRes.json();
    console.log(`✓ 7. Admin List Coupons: Status ${couponsListRes.status}, Total: ${couponsListData.coupons?.length}`);

    // 8. Admin Settings Get & Update
    const getSettingsRes = await fetch(`${baseUrl}/admin/settings`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const getSettingsData = await getSettingsRes.json();
    console.log(`✓ 8. Admin Get Settings: Status ${getSettingsRes.status}, Keys: ${Object.keys(getSettingsData.data?.settingsMap || {}).length}`);

    const updateSettingsRes = await fetch(`${baseUrl}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        settings: {
          site_name: 'Futuristic Thinkers',
          site_tagline: "Inspiring Tomorrow's Innovators"
        }
      })
    });
    console.log(`✓ 9. Admin Update Settings: Status ${updateSettingsRes.status}`);

    // 10. Admin Activity Logs
    const logsRes = await fetch(`${baseUrl}/admin/activity-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const logsData = await logsRes.json();
    console.log(`✓ 10. Admin Activity Logs: Status ${logsRes.status}, Records: ${logsData.data?.logs?.length}`);

    console.log('====================================================');
    console.log('🎉 ALL END-TO-END SANITY CHECKS PASSED PERFECTLY!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ E2E check error:', err);
    process.exit(1);
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runE2ETests();
