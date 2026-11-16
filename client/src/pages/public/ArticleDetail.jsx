import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Calendar, User, Tag, Sparkles } from 'lucide-react';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${slug}`);
        setArticle(res.data?.data?.article);
      } catch (err) {
        console.error('Failed to load article', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div className="py-24 text-center text-slate-400 text-sm">Loading article...</div>;
  }

  if (!article) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
        <Link to="/hub" className="text-brand-teal underline">
          Back to Free Learning Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        to="/hub"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-teal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Learning Hub</span>
      </Link>

      <header className="space-y-4 border-b border-slate-800 pb-8">
        <div className="flex flex-wrap gap-2">
          {article.tags?.map((tag, i) => (
            <span
              key={i}
              className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/10 text-brand-teal border border-teal-500/20"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white font-display leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-teal" />
            <span>
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-brand-amber" />
            <span>By {article.author?.name || 'Futuristic Thinkers Faculty'}</span>
          </div>
        </div>
      </header>

      {/* Article Body Content */}
      <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
        {article.content}
      </div>

      {/* Footer Banner */}
      <div className="mt-12 bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Explore AI Explorers Academy</h3>
          <p className="text-xs text-slate-300">
            Inspiring curiosity in children aged 7-10 through story missions and printable activity kits.
          </p>
        </div>
        <Link
          to="/courses/ai-explorers-academy"
          className="shrink-0 px-6 py-3 rounded-2xl bg-brand-teal text-brand-navy font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md"
        >
          View Flagship Course
        </Link>
      </div>
    </div>
  );
}

