import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Search,
  Filter,
  Bot,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function ExploreCourses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseRes, catRes] = await Promise.all([
          api.get('/courses'),
          api.get('/categories')
        ]);
        setCourses(courseRes.data?.data?.courses || []);
        setCategories(catRes.data?.data?.categories || []);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesCategory =
      selectedCategory === 'all' || c.category?.slug === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-brand-teal text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Course Catalogue</span>
        </div>
        <h1 className="text-4xl font-black text-white font-display">
          STEM &amp; AI Courses for Curious Young Minds
        </h1>
        <p className="text-sm text-slate-300">
          Tailored especially for school-age children (Ages 7–10) with complete story episodes and
          printable offline mission kits.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-brand-teal text-brand-navy'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            All Courses
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-brand-teal text-brand-navy'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading course catalogue...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          No courses match your search criteria. Try selecting &ldquo;All Courses&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl hover:border-slate-600 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Course Header Banner */}
                <div className="h-44 bg-gradient-to-tr from-brand-indigo via-slate-900 to-teal-950 p-6 flex flex-col justify-between relative overflow-hidden border-b border-slate-700/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                      {course.category?.name || 'STEM'}
                    </span>
                    <span className="text-xs font-black text-brand-amber bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700">
                      Ages {course.ageRange}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 text-brand-teal flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-300">
                      {course.lessonsCount || 10} Story Lessons
                    </span>
                  </div>
                </div>

                {/* Course Body */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-black text-white group-hover:text-brand-teal transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {course.shortDescription}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Self-Paced (~30-45 mins / lesson)</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 border-t border-slate-700/40 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Price
                  </span>
                  <span className="text-2xl font-black text-white font-display">
                    {course.price === 0 ? 'Free' : `$${course.price} ${course.currency}`}
                  </span>
                </div>

                <Link
                  to={`/courses/${course.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-teal text-brand-navy font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

