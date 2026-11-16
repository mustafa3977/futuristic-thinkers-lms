import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { BookOpen, Calendar, User, ArrowRight, Tag } from 'lucide-react';

export default function LearningHub() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles');
        setArticles(res.data?.data?.articles || []);
      } catch (err) {
        console.error('Failed to load articles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-brand-teal text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Free Learning Hub</span>
        </div>
        <h1 className="text-4xl font-black text-white font-display">
          Insights for Raising Tomorrow&apos;s Innovators
        </h1>
        <p className="text-sm text-slate-300">
          Practical guides, technology explainers, and parenting tips for navigating the AI era with
          confidence.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading articles...</div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-sm">No articles available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article._id}
              className="bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl hover:border-slate-600 transition-all flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {article.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-brand-teal border border-teal-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl font-black text-white group-hover:text-brand-teal transition-colors">
                  <Link to={`/hub/${article.slug}`}>{article.title}</Link>
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-700/60 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{article.author?.name || 'Faculty'}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/hub/${article.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

