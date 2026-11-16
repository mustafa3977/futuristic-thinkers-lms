export const mockAdminStats = {
  metrics: {
    totalUsers: 142,
    totalParents: 128,
    totalChildren: 156,
    totalCourses: 1,
    totalEnrollments: 94,
    totalRevenue: 4606
  },
  recentOrders: [
    {
      _id: 'ord_demo_101',
      parentId: { name: 'Jessica Taylor', email: 'jessica.t@example.com' },
      courseId: { title: 'AI Explorers Academy', price: 49 },
      amount: 49,
      status: 'completed',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'ord_demo_102',
      parentId: { name: 'David Miller', email: 'd.miller@example.com' },
      courseId: { title: 'AI Explorers Academy', price: 49 },
      amount: 49,
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      _id: 'ord_demo_103',
      parentId: { name: 'Sarah Jenkins', email: 'sarah.j@example.com' },
      courseId: { title: 'AI Explorers Academy', price: 49 },
      amount: 49,
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ],
  popularCourses: [
    {
      courseId: 'c_flagship_1',
      title: 'AI Explorers Academy',
      slug: 'ai-explorers-academy',
      enrollmentCount: 94
    }
  ],
  recentActivity: [
    {
      _id: 'act_101',
      action: 'COURSE_PUBLISHED',
      targetType: 'Course',
      adminId: { name: 'Futuristic Administrator', email: 'admin@example.com' },
      createdAt: new Date().toISOString()
    },
    {
      _id: 'act_102',
      action: 'MANUAL_ENROLLMENT',
      targetType: 'Enrollment',
      adminId: { name: 'Futuristic Administrator', email: 'admin@example.com' },
      details: { parentEmail: 'jessica.t@example.com', course: 'AI Explorers Academy' },
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ]
};

export const mockCourses = [
  {
    _id: 'c_flagship_1',
    title: 'AI Explorers Academy',
    slug: 'ai-explorers-academy',
    shortDescription: '10 story-driven adventures with Zara (9), Zahran (8), and Luna (9) exploring the fundamentals of Artificial Intelligence.',
    fullDescription: 'Welcome to AI Explorers Academy! Join our three curious young explorers on 10 hands-on, non-screen heavy, ethical missions designed for young minds aged 7 to 10.',
    category: { _id: 'cat_ai', name: 'Artificial Intelligence', slug: 'ai' },
    ageRange: 'Ages 7-10',
    price: 49,
    currency: 'USD',
    isPublished: true,
    totalLessons: 10,
    durationHours: 6,
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    learningOutcomes: [
      'Understand how AI perceives patterns in images, sounds, and text',
      'Distinguish between human natural intelligence and machine programming',
      'Learn fair and kind AI decision-making (AI Ethics)',
      'Create offline unplugged models and family discussion talk-cards'
    ],
    createdAt: new Date().toISOString()
  }
];

export const mockLessons = [
  {
    _id: 'les_1',
    order: 1,
    title: 'Meet the Explorers & The Mystery of the Thinking Machine',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '12:00',
    content: 'Zara, Zahran, and Luna find an unusual gadget in the attic that can sort colors and sounds. Is it magic, or is it learning patterns?',
    isPreview: true,
    characterFocus: ['Zara', 'Zahran', 'Luna'],
    materials: [
      { title: 'AI Detective Mission 1', type: 'mission', fileUrl: '#', downloadName: 'Mission1.pdf' },
      { title: 'Family Talk Cards 1', type: 'talk_cards', fileUrl: '#', downloadName: 'TalkCards1.pdf' }
    ]
  },
  {
    _id: 'les_2',
    order: 2,
    title: 'How Machines See the World: Pixels, Shapes & Colors',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '14:30',
    content: 'Zahran builds a camera lens filter that breaks photos into tiny numeric grids to discover computer vision.',
    isPreview: false,
    characterFocus: ['Zahran'],
    materials: [
      { title: 'Pixel Grid Challenge', type: 'challenge', fileUrl: '#', downloadName: 'PixelChallenge.pdf' }
    ]
  },
  {
    _id: 'les_3',
    order: 3,
    title: 'Sound Waves & Voice Helpers: How AI Hears Us',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '11:15',
    content: 'Luna investigates how smart speakers understand commands even when there is background music.',
    isPreview: false,
    characterFocus: ['Luna'],
    materials: [
      { title: 'Acoustic Detective Sheet', type: 'worksheet', fileUrl: '#', downloadName: 'AcousticSheet.pdf' }
    ]
  },
  {
    _id: 'les_4',
    order: 4,
    title: 'Pattern Power: How AI Spots Clues',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '13:40',
    content: 'Zara uses pattern recognition cards to find clues faster than the clubhouse computer.',
    isPreview: false,
    characterFocus: ['Zara'],
    materials: [
      { title: 'Pattern Recognition Cards', type: 'notebook', fileUrl: '#', downloadName: 'Patterns.pdf' }
    ]
  },
  {
    _id: 'les_5',
    order: 5,
    title: 'Teaching the Machine: Good Data vs. Bad Data',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '15:00',
    content: 'What happens when you only teach a computer about cats and then show it a puppy? The team explores bias.',
    isPreview: false,
    characterFocus: ['Zara', 'Luna'],
    materials: [
      { title: 'Data Balance Worksheet', type: 'worksheet', fileUrl: '#', downloadName: 'DataBalance.pdf' }
    ]
  },
  {
    _id: 'les_6',
    order: 6,
    title: 'Decision Trees: The Choose-Your-Own-Adventure Code',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '12:50',
    content: 'Zahran maps out a flow chart that predicts whether Luna will choose strawberries or apples.',
    isPreview: false,
    characterFocus: ['Zahran'],
    materials: [
      { title: 'Decision Tree Board', type: 'challenge', fileUrl: '#', downloadName: 'DecisionTree.pdf' }
    ]
  },
  {
    _id: 'les_7',
    order: 7,
    title: 'Robotics & Automation: Machines in Motion',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '16:10',
    content: 'How smart warehouse bots and rover vehicles navigate without bumping into walls.',
    isPreview: false,
    characterFocus: ['Zahran', 'Zara'],
    materials: [
      { title: 'Obstacle Course Navigator', type: 'mission', fileUrl: '#', downloadName: 'ObstacleMap.pdf' }
    ]
  },
  {
    _id: 'les_8',
    order: 8,
    title: 'Generative AI: Creating Stories and Digital Art',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '14:20',
    content: 'Luna and Zara experiment with writing prompts that generate whimsical space adventures.',
    isPreview: false,
    characterFocus: ['Luna'],
    materials: [
      { title: 'Prompt Crafting Sheet', type: 'notebook', fileUrl: '#', downloadName: 'PromptSheet.pdf' }
    ]
  },
  {
    _id: 'les_9',
    order: 9,
    title: 'AI Ethics & Safety: Being Fair, Kind and Truthful',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '13:00',
    content: 'The explorers create the Clubhouse Golden Rules for using AI safely and respecting privacy.',
    isPreview: false,
    characterFocus: ['Zara', 'Zahran', 'Luna'],
    materials: [
      { title: 'The AI Safety Pledge', type: 'talk_cards', fileUrl: '#', downloadName: 'SafetyPledge.pdf' }
    ]
  },
  {
    _id: 'les_10',
    order: 10,
    title: 'Grand Explorer Showcase & AI Passport Graduation',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '18:00',
    content: 'The team presents their completed AI inventions and receives the prestigious Junior AI Innovator Certificate!',
    isPreview: false,
    characterFocus: ['Zara', 'Zahran', 'Luna'],
    materials: [
      { title: 'Junior AI Innovator Certificate Template', type: 'other', fileUrl: '#', downloadName: 'Certificate.pdf' }
    ]
  }
];

export const mockCategories = [
  { _id: 'cat_ai', name: 'Artificial Intelligence', slug: 'ai', order: 1, isActive: true },
  { _id: 'cat_coding', name: 'Coding & Logic', slug: 'coding', order: 2, isActive: true },
  { _id: 'cat_robotics', name: 'Robotics & Hardware', slug: 'robotics', order: 3, isActive: true },
  { _id: 'cat_science', name: 'Science & Discovery', slug: 'science', order: 4, isActive: true },
  { _id: 'cat_creativity', name: 'Creative Innovation', slug: 'creativity', order: 5, isActive: true }
];

export const mockUsers = [
  { _id: 'u_1', name: 'Futuristic Administrator', email: 'admin@example.com', role: 'admin', isActive: true, createdAt: '2026-01-01' },
  { _id: 'u_2', name: 'Jessica Taylor', email: 'jessica.t@example.com', role: 'parent', isActive: true, createdAt: '2026-02-14' },
  { _id: 'u_3', name: 'David Miller', email: 'd.miller@example.com', role: 'parent', isActive: true, createdAt: '2026-02-28' },
  { _id: 'u_4', name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'parent', isActive: true, createdAt: '2026-03-05' }
];

export const mockEnrollments = [
  {
    _id: 'enr_1',
    parentId: { _id: 'u_2', name: 'Jessica Taylor', email: 'jessica.t@example.com' },
    childId: { nickname: 'Leo', avatar: '🦁', age: 9 },
    courseId: { _id: 'c_flagship_1', title: 'AI Explorers Academy', slug: 'ai-explorers-academy' },
    status: 'active',
    source: 'stripe',
    createdAt: '2026-02-14'
  },
  {
    _id: 'enr_2',
    parentId: { _id: 'u_3', name: 'David Miller', email: 'd.miller@example.com' },
    childId: { nickname: 'Maya', avatar: '🚀', age: 8 },
    courseId: { _id: 'c_flagship_1', title: 'AI Explorers Academy', slug: 'ai-explorers-academy' },
    status: 'active',
    source: 'stripe',
    createdAt: '2026-02-28'
  }
];

export const mockOrders = [
  {
    _id: 'ord_101',
    parentId: { name: 'Jessica Taylor', email: 'jessica.t@example.com' },
    courseId: { title: 'AI Explorers Academy' },
    amount: 49,
    currency: 'usd',
    status: 'paid',
    createdAt: '2026-02-14'
  },
  {
    _id: 'ord_102',
    parentId: { name: 'David Miller', email: 'd.miller@example.com' },
    courseId: { title: 'AI Explorers Academy' },
    amount: 49,
    currency: 'usd',
    status: 'paid',
    createdAt: '2026-02-28'
  }
];

export const mockCoupons = [
  { _id: 'cp_1', code: 'EXPLORE20', discountType: 'percentage', discountValue: 20, maxUses: 100, usedCount: 14, isActive: true },
  { _id: 'cp_2', code: 'WELCOME10', discountType: 'fixed', discountValue: 10, maxUses: 500, usedCount: 68, isActive: true }
];

export const mockArticles = [
  {
    _id: 'art_1',
    title: 'How to Talk to Your 8-Year-Old About Artificial Intelligence',
    slug: 'how-to-talk-to-kids-about-ai',
    excerpt: 'Practical metaphors, everyday examples, and bedtime discussion questions to demystify smart technology without causing anxiety.',
    tags: ['Parent Guide', 'AI Literacy', 'Family Tips'],
    status: 'published',
    createdAt: '2026-02-10'
  },
  {
    _id: 'art_2',
    title: 'Screen Time vs. Mind Time: Making Digital Learning Meaningful',
    slug: 'screen-time-vs-mind-time',
    excerpt: 'Why active, question-driven exploration beats passive consumption every single time.',
    tags: ['Learning Science', 'Child Development'],
    status: 'published',
    createdAt: '2026-02-18'
  }
];

export const mockFaqs = [
  { _id: 'faq_1', order: 1, question: 'What age group is AI Explorers Academy designed for?', answer: 'It is designed specifically for children aged 7 to 10 (Grades 2 to 5).', category: 'General', isPublished: true },
  { _id: 'faq_2', order: 2, question: 'Does my child need any prior coding or math experience?', answer: 'None at all! The course focuses on concepts, pattern-finding, and ethical thinking through story adventures with Zara, Zahran, and Luna.', category: 'Course & Content', isPublished: true },
  { _id: 'faq_3', order: 3, question: 'How do child profiles protect privacy?', answer: 'We collect zero child email addresses, phone numbers, or real names. Profiles use only a fun nickname and avatar managed exclusively by the parent.', category: 'Accounts & Privacy', isPublished: true }
];

export const mockPages = [
  { pageSlug: 'privacy', title: 'Privacy Policy & Child Safety', content: 'Futuristic Thinkers adheres strictly to COPPA, GDPR, UK GDPR, PIPEDA, and the Australian Privacy Act...' },
  { pageSlug: 'terms', title: 'Terms of Service', content: 'These Terms govern the purchase and use of self-paced courses on Futuristic Thinkers...' },
  { pageSlug: 'refund', title: '14-Day Refund Guarantee', content: 'We offer a complete 14-day no-questions-asked refund policy on all individual course purchases...' },
  { pageSlug: 'accessibility', title: 'Accessibility Statement', content: 'We are committed to making our digital learning experiences accessible to all learners...' },
  { pageSlug: 'for-parents', title: 'For Parents & Guardians', content: 'Everything you need to know about our approach to inspiring tomorrow innovators...' },
  { pageSlug: 'about', title: 'About Futuristic Thinkers', content: 'Our mission is to empower curious young minds with ethical, empowering AI literacy.' }
];

export const mockContactMessages = [
  { _id: 'msg_1', name: 'Laura Vance', email: 'laura@example.com', subject: 'Curriculum question for home-schooling', message: 'Can the printable worksheets be printed multiple times for my 7 and 9 year olds?', isRead: false, isReplied: false, createdAt: '2026-03-01' }
];

export const mockSettings = {
  site_name: 'Futuristic Thinkers',
  site_tagline: "Inspiring Tomorrow's Innovators",
  support_email: 'support@futuristicthinkers.com',
  default_price: '49',
  default_currency: 'USD',
  refund_window_days: '14',
  access_period_text: '12 Months Unlimited Access',
  maintenance_mode: 'false'
};

export const mockActivityLogs = [
  { _id: 'log_1', action: 'COURSE_UPDATED', targetType: 'Course', adminId: { name: 'Futuristic Administrator', email: 'admin@example.com' }, createdAt: new Date().toISOString() },
  { _id: 'log_2', action: 'SETTINGS_UPDATED', targetType: 'Setting', adminId: { name: 'Futuristic Administrator', email: 'admin@example.com' }, createdAt: new Date(Date.now() - 3600000).toISOString() }
];

