import mongoose from 'mongoose';
import crypto from 'crypto';
import { config } from '../config/env.js';
import { hashPassword } from '../utils/password.js';
import {
  User,
  Category,
  Course,
  Lesson,
  FAQ,
  Article,
  PageContent,
  Setting
} from '../models/index.js';

const seedDatabase = async () => {
  try {
    console.log('----------------------------------------------------');
    console.log('🌱 Starting Futuristic Thinkers LMS Database Seeder');
    console.log('----------------------------------------------------');

    await mongoose.connect(config.mongoUri);
    const maskedUri = (config.mongoUri || '').replace(/mongodb(\+srv)?:\/\/[^@\s]+@[^\s/]+/gi, 'mongodb+srv://USER:****@cluster...');
    console.log(` Connected to MongoDB at: ${maskedUri}`);

    // Clear existing seed data (clean slate for deterministic seed)
    await Promise.all([
      User.deleteMany({ role: 'admin' }),
      Category.deleteMany({}),
      Course.deleteMany({}),
      Lesson.deleteMany({}),
      FAQ.deleteMany({}),
      Article.deleteMany({}),
      PageContent.deleteMany({}),
      Setting.deleteMany({})
    ]);
    console.log(' Cleared previous seed records.');

    // 1. Seed Admin User
    const adminEmail = config.admin.initialEmail || 'admin@example.com';
    const tempAdminPassword =
      config.admin.initialPassword || `AdminPass!${crypto.randomBytes(4).toString('hex')}`;
    const passwordHash = await hashPassword(tempAdminPassword);

    const adminUser = await User.create({
      name: 'Futuristic Administrator',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      isActive: true,
      parentalConsent: {
        accepted: true,
        acceptedAt: new Date(),
        statement: 'Admin account initialized during platform setup.'
      }
    });
    console.log(` Admin created: ${adminUser.email}`);

    // 2. Seed Categories
    const categoriesData = [
      {
        name: 'Artificial Intelligence',
        slug: 'ai',
        description: 'Explore the foundations of smart machines, pattern recognition, and digital thinking.',
        icon: 'Bot',
        order: 1
      },
      {
        name: 'Coding & Logic',
        slug: 'coding',
        description: 'Learn computational thinking, algorithms, and logical problem solving.',
        icon: 'Code',
        order: 2
      },
      {
        name: 'Robotics',
        slug: 'robotics',
        description: 'Discover how hardware and sensors interact with intelligent software.',
        icon: 'Cpu',
        order: 3
      },
      {
        name: 'Science & Discovery',
        slug: 'science',
        description: 'Hands-on scientific inquiry and understanding the natural and digital world.',
        icon: 'Atom',
        order: 4
      },
      {
        name: 'Creativity & Design',
        slug: 'creativity',
        description: 'Unleash imagination through digital art, storytelling, and ethical design.',
        icon: 'Sparkles',
        order: 5
      }
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(` Created ${createdCategories.length} Categories.`);
    const aiCategory = createdCategories.find((c) => c.slug === 'ai');

    // 3. Seed Flagship Course: "AI Explorers Academy"
    const courseData = {
      title: 'AI Explorers Academy',
      slug: 'ai-explorers-academy',
      tagline: "Inspiring Tomorrow's Innovators",
      category: aiCategory._id,
      ageRange: '7-10 years',
      shortDescription:
        'A magical 10-lesson story-driven adventure where children aged 7-10 team up with Zara, Zahran, and Luna to decode the secrets of Artificial Intelligence through videos, detective missions, and family quests.',
      fullDescription: `Welcome to AI Explorers Academy! In this flagship course designed specially for school-age innovators (ages 7-10), children do not just consume technology—they understand how it works, how it learns, and how to use it safely and creatively.

Guided by our three relatable explorers—Zara (age 9, the curious detective), Zahran (age 8, the hands-on tinkerer), and Luna (age 9, the creative strategist)—learners embark on 10 vibrant, bite-sized episodic adventures.

Each lesson pairs an engaging animated narrative with six tactile offline learning resources that parents can easily print and explore together at home.`,
      learningOutcomes: [
        'Understand what Artificial Intelligence is and distinguish between human brains and computer algorithms',
        'Learn how computers recognize patterns, images, sounds, and text through training data',
        'Discover real-world AI applications in space exploration, medicine, wildlife preservation, and everyday devices',
        'Explore algorithmic fairness, data safety, and critical thinking with AI Myth Busters',
        'Build digital confidence and spark wholesome family conversations using Family AI Talk Cards',
        'Earn an official AI Explorer Passport with collectible milestone stamps and digital certificates'
      ],
      whoIsItFor:
        'Curious children aged 7 to 10 in the USA, Canada, UK, and Australia who wonder how smart assistants, recommendation engines, and robots work. Ideal for homeschooling, after-school enrichment, or holiday learning.',
      howItWorks:
        '100% self-paced and on-demand. Watch the episodic video, download the printable detective kit, test what you learned in the world around you, and mark the lesson complete to stamp your AI Passport.',
      whatChildSeesDoes:
        'Children watch animated video adventures, fill out their AI Notebook Page, crack the AI Detective Mission, complete the AI Around You Challenge in their home or neighborhood, bust common myths with Luna, celebrate historic tech role models in the AI Hero Spotlight, and lead engaging evening discussions with Family AI Talk Cards.',
      materialsIncluded: [
        '10 Story-driven Lesson Videos (Full HD, closed captions, child-friendly pace)',
        '10 Printable AI Notebook Activity Pages',
        '10 AI Detective Missions (interactive puzzle solving)',
        '10 AI Around You Challenges (real-world observation prompts)',
        '10 AI Myth Buster Fact Sheets',
        '10 AI Hero Spotlights (diverse innovators & historical figures)',
        '10 Printable Family AI Talk Card decks (dinner-table discussion prompts)',
        'Digital AI Passport with 10 unlockable collectible stamps',
        '4 Milestone Achievement Badges',
        'Official Personalized Completion Certificate (printable PDF)'
      ],
      thumbnail: '/images/courses/ai-explorers-thumbnail.jpg',
      price: 49, // Numeric representation of [PRICE]
      currency: 'USD',
      duration: '10 lessons (~30-45 minutes per lesson including offline activities)',
      deviceRequirements:
        'Any desktop, laptop, or tablet (iPad/Android) with an updated web browser (Chrome, Safari, Edge, Firefox). An optional home printer for printable activities.',
      accessPeriod: '[ACCESS PERIOD]',
      refundText: '[REFUND DAYS] 100% money-back guarantee. No questions asked.',
      support: 'Priority parent email support via [SUPPORT EMAIL].',
      seoTitle: 'AI Explorers Academy (Ages 7-10) | Futuristic Thinkers',
      seoDescription:
        'Inspiring tomorrow\'s innovators. The premier story-driven AI learning adventure for children aged 7-10, featuring Zara, Zahran, and Luna.',
      status: 'published',
      isFeatured: true,
      order: 1
    };

    const flagshipCourse = await Course.create(courseData);
    console.log(` Flagship Course Created: ${flagshipCourse.title} (${flagshipCourse.slug})`);

    // 4. Seed 10 Story-Driven Lessons for AI Explorers Academy
    const lessonsData = [
      {
        order: 1,
        title: '[LESSON 1 TITLE] Meet the Explorers & The Mystery of the Thinking Machine',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder embed URL
        videoDuration: '11:45',
        isPreview: true, // Free sample preview lesson
        unlockRule: 'immediate',
        characterFocus: ['Zara (9)', 'Zahran (8)', 'Luna (9)'],
        content: `In the premiere episode, Zara (9), Zahran (8), and Luna (9) meet in their treehouse headquarters to investigate a strange question: What makes a machine "smart"? 

Zara discovers that while a toaster only does what it is clicked to do, some machines can learn from experience. Zahran tests whether his calculator is alive, while Luna introduces the difference between human intuition and computer instructions.

Children learn the golden rule of AI: Computers only know what people teach them with data!`,
        passportStamp: {
          stampCode: 'STAMP_01',
          title: 'Explorer Compass Stamp',
          icon: 'Compass'
        },
        milestoneBadge: {
          badgeId: 'BADGE_FIRST_STEP',
          title: 'First Step Innovator',
          description: 'Completed your very first AI adventure!',
          icon: 'Compass'
        }
      },
      {
        order: 2,
        title: '[LESSON 2 TITLE] Patterns, Patterns Everywhere: How Computers See',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoDuration: '12:20',
        isPreview: false,
        unlockRule: 'sequential',
        characterFocus: ['Zara (9)', 'Luna (9)'],
        content: `Zara and Luna become visual detectives! When Luna tries to teach a computer to tell the difference between a blueberry muffin and a sleeping Chihuahua dog, hilarious mix-ups occur. 

Children explore computer vision: how digital cameras break pictures into tiny pixels and mathematical patterns to recognize shapes, colors, and textures.`,
        passportStamp: {
          stampCode: 'STAMP_02',
          title: 'Pixel Detective Stamp',
          icon: 'Eye'
        }
      },
      {
        order: 3,
        title: '[LESSON 3 TITLE] The Sound of Data: How Smart Speakers Hear',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoDuration: '10:50',
        isPreview: false,
        unlockRule: 'sequential',
        characterFocus: ['Zahran (8)'],
        content: `Zahran tests the family smart speaker with funny tongue-twisters and accents. Why does the speaker understand "play music" when mom says it, but gets confused when baby brother babbles?

Explorers learn about speech recognition, sound waves converted into numbers, and how microphones capture vibrations to turn spoken words into computer commands.`,
        passportStamp: {
          stampCode: 'STAMP_03',
          title: 'Acoustic Decoder Stamp',
          icon: 'Mic'
        },
        milestoneBadge: {
          badgeId: 'BADGE_TRIO_MASTER',
          title: 'Pattern Prodigy',
          description: 'Mastered vision, sound, and logic patterns across 3 lessons!',
          icon: 'Sparkles'
        }
      },
      {
        order: 4,
        title: '[LESSON 4 TITLE] Training the Brain: The Power of Good Data',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoDuration: '13:10',
        isPreview: false,
        unlockRule: 'sequential',
        characterFocus: ['Zara (9)', 'Zahran (8)'],
        content: `Imagine teaching a friend about fruits by only ever showing them green apples! Would they recognize a red strawberry? 

Zara and Zahran discover the golden rule of machine learning: "Garbage In, Garbage Out". Children learn why diverse, truthful, and broad examples are required to train fair and helpful AI models.`,
        passportStamp: {
          stampCode: 'STAMP_04',
          title: 'Data Curator Stamp',
          icon: 'Database'
        }
      },
      {
        order: 5,
        title: '[LESSON 5 TITLE] Robots with Wheels: Self-Driving Cars and Sensors',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoDuration: '14:00',
        isPreview: false,
        unlockRule: 'sequential',
        characterFocus: ['Luna (9)', 'Zahran (8)'],
        content: `Luna builds a cardboard obstacle course for her toy rover while Zahran explores how real self-driving vehicles use sensors, radar, and cameras to navigate safely without bumping into obstacles.

Children learn how AI combines multiple sensors to make split-second decisions and keep people safe on the road.`,
        passportStamp: {
          stampCode: 'STAMP_05',
          title: 'Sensor Navigator Stamp',
          icon: 'Cpu'
        },
        milestoneBadge: {
          badgeId: 'BADGE_HALFWAY_HERO',
          title: 'Halfway Hero',
          description: 'Conquered 5 full AI missions in the Academy!',
          icon: 'Award'
        }
      },
      {
        order: 6,
        title: '[LESSON 6 TITLE] Recommendation Engines: How Did It Know I Liked That?',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoDuration: '11:15',
        isPreview: false,
        unlockRule: 'sequential',
        characterFocus: ['Zara (9)', 'Luna (9)'],
        content: `Have you ever wondered why video streaming apps or music playlists suggest your favorite song next? Zara and Luna map out recommendation algorithms like a treasure hunt of shared interests and tastes.

Children learn how similarity scores connect people with books, songs, and science articles they will love.`,
        passportStamp: {
          stampCode: 'STAMP_06',
          title: 'Algorithm Alchemist Stamp',
          icon: 'ListFilter'
        }
      },
      {
        order: 7,
        title: '[LESSON 7 TITLE] Creative AI: Can Computers Paint and Write Stories?',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoDuration: '13:40',
        isPreview: false,
        unlockRule: 'sequential',
        characterFocus: ['The Explorer Team'],
        content: `Can a robot feel happy or write a poem that makes someone cry? The three explorers experiment with generative AI tools to co-author a funny comic book.

They discover that while AI can remix patterns and rhyme words, human feelings, heart, empathy, and original creativity are uniquely human!`,
        passportStamp: {
          stampCode: 'STAMP_07',
          title: 'Creative Collaborator Stamp',
          icon: 'Palette'
        },
        milestoneBadge: {
          badgeId: 'BADGE_CREATIVE_GENIUS',
          title: 'Creative Genius',
          description: 'Bridged technology with artistic human expression!',
          icon: 'Feather'
        }
      },
      {
        order: 8,
        title: '[LESSON 8 TITLE] AI for Earth: Saving Endangered Animals and Oceans',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoDuration: '12:55',
        isPreview: false,
        unlockRule: 'sequential',
        characterFocus: ['Zara (9)'],
        content: `Zara takes children on a virtual expedition to the Great Barrier Reef and the African savannah. Discover how marine biologists use underwater microphones and satellite AI to track whale songs and protect endangered rhinos from poachers!

Children see how technology serves environmental protection and climate solutions.`,
        passportStamp: {
          stampCode: 'STAMP_08',
          title: 'Planet Guardian Stamp',
          icon: 'Globe'
        }
      },
      {
        order: 9,
        title: '[LESSON 9 TITLE] Digital Citizenship & Safety: Staying Smart and Kind Online',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoDuration: '14:20',
        isPreview: false,
        unlockRule: 'sequential',
        characterFocus: ['The Explorer Team'],
        content: `The explorers hold an important summit in their headquarters. They tackle fake news, manipulated photos (deepfakes), protecting private passwords, and treating others with kindness online.

Children earn their Digital Shield by mastering critical thinking and safety guidelines for the modern internet.`,
        passportStamp: {
          stampCode: 'STAMP_09',
          title: 'Digital Shield Stamp',
          icon: 'ShieldCheck'
        }
      },
      {
        order: 10,
        title: '[LESSON 10 TITLE] Graduation Day: The AI Innovator\'s Pledge',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoDuration: '15:00',
        isPreview: false,
        unlockRule: 'sequential',
        characterFocus: ['The Explorer Team'],
        content: `Zara, Zahran, and Luna celebrate your graduation! Together with your family, review your completed AI Passport, recap all 10 missions, and take the official "AI Innovator\'s Pledge": to build technology that is helpful, honest, and kind.

Unlocks your official printable Completion Certificate with child\'s nickname!`,
        passportStamp: {
          stampCode: 'STAMP_10',
          title: 'Innovator Laureate Stamp',
          icon: 'GraduationCap'
        },
        milestoneBadge: {
          badgeId: 'BADGE_ACADEMY_GRADUATE',
          title: 'AI Explorer Laureate',
          description: 'Successfully completed all 10 lessons in AI Explorers Academy!',
          icon: 'Trophy'
        }
      }
    ];

    // Standard printable materials attached to every lesson
    const createMaterialsForLesson = (lessonOrder, lessonTitle) => [
      {
        title: `AI Notebook Page - Lesson ${lessonOrder}`,
        type: 'notebook',
        fileUrl: `/uploads/materials/lesson-${lessonOrder}-notebook.pdf`,
        downloadName: `Lesson-${lessonOrder}-AI-Notebook-Page.pdf`,
        description: `Printable guided notes and colorful diagramming sheet for Lesson ${lessonOrder}.`
      },
      {
        title: `AI Detective Mission #${lessonOrder}`,
        type: 'mission',
        fileUrl: `/uploads/materials/lesson-${lessonOrder}-detective-mission.pdf`,
        downloadName: `Lesson-${lessonOrder}-AI-Detective-Mission.pdf`,
        description: `Solve the mystery puzzle with Zara, Zahran, and Luna using algorithmic logic.`
      },
      {
        title: `AI Around You Challenge #${lessonOrder}`,
        type: 'challenge',
        fileUrl: `/uploads/materials/lesson-${lessonOrder}-challenge.pdf`,
        downloadName: `Lesson-${lessonOrder}-Around-You-Challenge.pdf`,
        description: `A hands-on observation activity to spot technology in your home or school.`
      },
      {
        title: `AI Myth Buster Sheet #${lessonOrder}`,
        type: 'myth_buster',
        fileUrl: `/uploads/materials/lesson-${lessonOrder}-myth-buster.pdf`,
        downloadName: `Lesson-${lessonOrder}-Myth-Buster.pdf`,
        description: `Separating science fiction from real science in simple, fun language.`
      },
      {
        title: `AI Hero Spotlight #${lessonOrder}`,
        type: 'hero_spotlight',
        fileUrl: `/uploads/materials/lesson-${lessonOrder}-hero-spotlight.pdf`,
        downloadName: `Lesson-${lessonOrder}-Hero-Spotlight.pdf`,
        description: `Inspiring true story of a diverse technologist who helped shape modern computing.`
      },
      {
        title: `Family AI Talk Cards - Deck #${lessonOrder}`,
        type: 'talk_cards',
        fileUrl: `/uploads/materials/lesson-${lessonOrder}-talk-cards.pdf`,
        downloadName: `Lesson-${lessonOrder}-Family-Talk-Cards.pdf`,
        description: `Printable question cards to spark dinner-table discussions between kids and parents.`
      }
    ];

    const lessonsToInsert = lessonsData.map((lesson) => ({
      ...lesson,
      courseId: flagshipCourse._id,
      materials: createMaterialsForLesson(lesson.order, lesson.title)
    }));

    const createdLessons = await Lesson.insertMany(lessonsToInsert);
    console.log(` Created ${createdLessons.length} Lessons for ${flagshipCourse.title}.`);

    // 5. Seed 3 FAQs
    const faqsData = [
      {
        question: 'Does my child need prior coding or computer experience?',
        answer:
          'Not at all! AI Explorers Academy is designed from the ground up for curious 7-10 year-olds with zero technical background. Our story-driven format focuses on conceptual understanding, logical thinking, and everyday applications rather than writing syntax or code.',
        category: 'Curriculum & Learning',
        order: 1,
        isPublished: true
      },
      {
        question: 'How is my child’s privacy and online safety protected?',
        answer:
          'Child privacy is our highest priority. We strictly comply with COPPA, GDPR, UK GDPR, and the Australian Privacy Act. We NEVER collect child email addresses, phone numbers, or personal identifying information. Child learning profiles only require a nickname and avatar chosen by the parent. Parents maintain 100% control over the account.',
        category: 'Privacy & Safety',
        order: 2,
        isPublished: true
      },
      {
        question: 'What devices and materials do we need at home?',
        answer:
          'All you need is any device with a standard web browser (tablet, iPad, Chromebook, laptop, or desktop computer) and an internet connection. To make the most of the offline missions, we recommend having a printer, paper, and colored pencils or markers for the printable activity sheets.',
        category: 'Technical & Equipment',
        order: 3,
        isPublished: true
      }
    ];

    const createdFaqs = await FAQ.insertMany(faqsData);
    console.log(` Created ${createdFaqs.length} FAQ items.`);

    // 6. Seed Sample Articles (Free Learning Hub)
    const articlesData = [
      {
        title: 'Why Every 8-Year-Old Should Understand AI in 2026',
        slug: 'why-every-8-year-old-should-understand-ai-2026',
        excerpt:
          'Artificial Intelligence is no longer future science—it is in voice assistants, streaming apps, and school tools today. Here is how age-appropriate learning builds critical thinkers.',
        content: `When children ask "How does Siri know my voice?" or "Why does YouTube recommend this video?", they are showing natural scientific curiosity.

In 2026, tech literacy is not just about knowing how to swipe a tablet screen—it is about understanding what happens behind the screen. When kids learn that computers need training data, they realize that machines are not magic, but human-created tools with strengths and limitations.

Teaching AI conceptually between ages 7 and 10 builds foundational critical thinking that empowers children to be creators, rather than passive consumers, of future technology.`,
        tags: ['Parenting', 'AI Literacy', 'STEM Education'],
        coverImage: '/images/blog/why-ai-literacy.jpg',
        author: adminUser._id,
        status: 'published',
        publishedAt: new Date(),
        seoTitle: 'Why Every 8-Year-Old Should Understand AI in 2026 | Futuristic Thinkers',
        seoDescription:
          'Discover why early AI literacy empowers children to be critical thinkers and safe digital citizens.'
      },
      {
        title: 'Screen Time vs. Creation Time: A Parent’s Guide to Healthy Tech Habits',
        slug: 'screen-time-vs-creation-time-parents-guide',
        excerpt:
          'Not all screen time is created equal. Discover the crucial difference between passive scrolling and active inquiry that sparks real-world discovery.',
        content: `Parents in the US, UK, Canada, and Australia frequently ask us: "How much screen time is too much?"

The key distinction is not merely the number of minutes, but the cognitive mode:
1. Passive Consumption: Mindlessly watching auto-playing short videos.
2. Active Inquiry & Creation: Watching an episodic 10-minute lesson that prompts offline drawing, physical investigation, and family debate.

By pairing short digital stories with tactile paper worksheets and family talk cards, we turn the screen into a launching pad for offline imagination.`,
        tags: ['Screen Time', 'Family Discussion', 'Child Development'],
        coverImage: '/images/blog/screen-time-guide.jpg',
        author: adminUser._id,
        status: 'published',
        publishedAt: new Date(),
        seoTitle: 'Screen Time vs Creation Time: A Parent\'s Practical Guide',
        seoDescription:
          'Practical strategies for parents to transform screen time into active, offline STEM exploration.'
      }
    ];

    const createdArticles = await Article.insertMany(articlesData);
    console.log(` Created ${createdArticles.length} Free Learning Hub articles.`);

    // 7. Seed Policy & Core Pages
    const pagesData = [
      {
        pageSlug: 'privacy',
        title: 'Privacy Policy',
        content: `# Privacy Policy
**Last Updated: November 2026**

*Notice: This policy is provided for operational and demonstration purposes and should undergo qualified legal review before commercial operation in target jurisdictions.*

### 1. Our Child Privacy Commitment (COPPA, GDPR & PIPEDA)
Futuristic Thinkers ("we", "us", or "our") is strictly committed to safeguarding children's online privacy:
- We **never** collect email addresses, phone numbers, physical addresses, or personal biometric data from children.
- Accounts are created, purchased, and managed exclusively by adults (parents or legal guardians over 18 years of age).
- Child profiles inside the application only store an arbitrary nickname, age (7-10), and selected cartoon avatar.
- No third-party behavioral advertising or retargeting scripts are loaded inside student lesson experiences.

### 2. Information We Collect from Parents
When an adult registers, we collect:
- Parent's full name and email address.
- Salted and hashed password credentials.
- Record of parental consent timestamp and IP address.
- Transaction records processed through our PCI-DSS compliant payment provider (Stripe). We never store credit or debit card numbers on our servers.

### 3. Contact & Data Deletion Requests
Parents maintain the right to inspect, export, or permanently delete their account and associated child learning progress at any time by contacting:
**[SUPPORT EMAIL]**`,
        metaDescription: 'Futuristic Thinkers Child Safety & Parental Privacy Policy.'
      },
      {
        pageSlug: 'terms',
        title: 'Terms of Service',
        content: `# Terms of Service
**Last Updated: November 2026**

*Notice: These terms govern the use of Futuristic Thinkers services by parents and authorized guardians.*

### 1. Account Eligibility
By creating an account, you affirm that you are at least 18 years old and possess the legal authority to enter into these terms on behalf of yourself and the minors you enroll.

### 2. Scope of Educational Service
Futuristic Thinkers provides self-paced, story-driven digital enrichment materials for educational exploration. 
- We do **not** provide live synchronous teaching, personal coaching, or child supervision.
- We do **not** grant accredited school degrees or guarantee specific academic or career outcomes.

### 3. Access Period & Licenses
Purchase of "AI Explorers Academy" provides single-family access for a period of **[ACCESS PERIOD]** from the date of enrollment. Content may not be redistributed, resold, or used for commercial classroom licensing without express written permission.

### 4. Governing Law
These terms are governed in accordance with international digital commerce practices for consumers in the United States, Canada, the United Kingdom, and Australia.`,
        metaDescription: 'Terms of Service for Futuristic Thinkers.'
      },
      {
        pageSlug: 'refund',
        title: 'Refund Policy',
        content: `# Refund & Guarantee Policy
**Last Updated: November 2026**

### Our 100% Satisfaction Guarantee
We want you and your child to love AI Explorers Academy without hesitation.

- **Guarantee Window:** If you or your child are not completely delighted with the course within **[REFUND DAYS]** of initial purchase, simply email **[SUPPORT EMAIL]**.
- **No Questions Asked:** We will promptly process a full 100% refund to your original payment method via Stripe.
- **Processing Time:** Standard refunds typically appear on your bank statement within 5 to 10 business days depending on your financial institution.`,
        metaDescription: '14-Day 100% Money-Back Guarantee details.'
      },
      {
        pageSlug: 'accessibility',
        title: 'Accessibility Statement',
        content: `# Accessibility Statement
**Last Updated: November 2026**

Futuristic Thinkers is dedicated to ensuring digital accessibility for all young learners and their families.

### Standards & Conformance
- We strive to conform to the **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA**.
- Color combinations across all lessons and parent interfaces are verified for high contrast.
- Visual focus indicators are clearly styled for keyboard-only navigation.
- Videos feature clear audio and closed caption options.
- The platform respects the \`prefers-reduced-motion\` system setting.

### Feedback
If you encounter any accessibility barrier, please reach out directly to **[SUPPORT EMAIL]**.`,
        metaDescription: 'Accessibility statement and WCAG conformance commitments.'
      },
      {
        pageSlug: 'for-parents',
        title: 'For Parents & Guardians',
        content: `# Empowering You to Guide Your Child's Tech Future

### Why We Built Futuristic Thinkers
As parents, we witnessed children captivated by smart speakers, algorithms, and automated toys—yet bewildered by how they work. We built Futuristic Thinkers to replace passive screen trance with active, story-led inquiry.

### What Makes AI Explorers Academy Unique:
1. **Designed for School Age (7-10):** Not childish cartoon baby games, and not dry university math. Perfectly calibrated for curious primary/elementary school minds.
2. **Relatable Trio of Explorers:** Zara (9), Zahran (8), and Luna (9) model collaboration, trial-and-error, and ethical questioning.
3. **Screen to Real-World Bridge:** Every lesson comes with Family AI Talk Cards and offline Detective Missions designed to spark laughter and learning at the dinner table.`,
        metaDescription: 'Parent guide to AI Explorers Academy and our educational philosophy.'
      },
      {
        pageSlug: 'about',
        title: 'About Futuristic Thinkers',
        content: `# About Futuristic Thinkers
**Tagline:** Inspiring Tomorrow's Innovators

Futuristic Thinkers is an educational media and learning laboratory on a mission to demystify emerging technologies for the next generation.

We believe that every child growing up in the 21st century deserves to understand the algorithms shaping their world. By instilling ethical curiosity, computational thinking, and creative problem-solving early, we empower children to grow into confident innovators rather than passive users.`,
        metaDescription: 'About Futuristic Thinkers: Inspiring Tomorrow\'s Innovators.'
      }
    ];

    const createdPages = await PageContent.insertMany(pagesData);
    console.log(` Created ${createdPages.length} Policy & Content pages.`);

    // 8. Seed Site Settings
    const settingsData = [
      {
        key: 'site_name',
        value: 'Futuristic Thinkers',
        description: 'Primary platform name',
        group: 'general'
      },
      {
        key: 'tagline',
        value: "Inspiring Tomorrow's Innovators",
        description: 'Official platform tagline',
        group: 'general'
      },
      {
        key: 'support_email',
        value: '[SUPPORT EMAIL]',
        description: 'Customer and parent support contact email',
        group: 'general'
      },
      {
        key: 'default_price',
        value: 49,
        description: 'Default price placeholder [PRICE]',
        group: 'payments'
      },
      {
        key: 'default_currency',
        value: 'USD',
        description: 'Primary currency (USD / CAD / AUD / GBP)',
        group: 'payments'
      },
      {
        key: 'refund_window_days',
        value: 14,
        description: 'Refund period placeholder [REFUND DAYS]',
        group: 'policies'
      },
      {
        key: 'access_period_text',
        value: '1 Year Full Access',
        description: 'Access period placeholder [ACCESS PERIOD]',
        group: 'policies'
      },
      {
        key: 'maintenance_mode',
        value: false,
        description: 'Put website in maintenance mode',
        group: 'general'
      }
    ];

    const createdSettings = await Setting.insertMany(settingsData);
    console.log(` Created ${createdSettings.length} Site Settings.`);

    // 9. Summary & Placeholders List
    console.log('\n====================================================');
    console.log('✅ DATABASE SEED COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
    console.log(`👤 Admin Email:        ${adminEmail}`);
    console.log(`🔑 Admin Password:     [CONFIGURED IN .ENV]`);
    console.log(`🎓 Flagship Course:    ${flagshipCourse.title}`);
    console.log(`📚 Lessons Created:    ${createdLessons.length} story-driven lessons`);
    console.log(`🏷️  Categories:         ${createdCategories.length}`);
    console.log(`❓ FAQ Items:          ${createdFaqs.length}`);
    console.log(`📰 Blog Articles:      ${createdArticles.length}`);
    console.log(`📄 Policy Pages:       ${createdPages.length}`);
    console.log('----------------------------------------------------');
    console.log('📋 PLACEHOLDERS USED IN SEED SCRIPT:');
    console.log('  1. [PRICE]          -> Course price: default $49 USD');
    console.log('  2. [ACCESS PERIOD]  -> Access duration: "1 Year Full Access"');
    console.log('  3. [REFUND DAYS]    -> Refund policy window: "14-Day"');
    console.log('  4. [SUPPORT EMAIL]  -> Support inbox: support@futuristicthinkers.com');
    console.log('  5. [LESSON 1 TITLE] through [LESSON 10 TITLE]');
    console.log('====================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seed Error] Failed to seed database: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

seedDatabase();

