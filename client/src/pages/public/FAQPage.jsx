import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/faqs');
        setFaqs(res.data?.data?.faqs || []);
      } catch (err) {
        console.error('Failed to load FAQs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-brand-teal text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="text-4xl font-black text-white font-display">
          Everything You Need to Know
        </h1>
        <p className="text-sm text-slate-300">
          Answers regarding curriculum, devices, COPPA safety, access, and our 14-day refund policy.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mx-auto">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search question or keyword..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
        />
      </div>

      {/* Accordion list */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading FAQ items...</div>
      ) : filteredFaqs.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-sm">No matching questions found.</div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={faq._id || index}
              className="bg-slate-800/70 border border-slate-700/80 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/40 transition-colors"
              >
                <span className="text-sm sm:text-base font-bold text-white pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-brand-teal shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-700/50 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Support Box */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 text-center space-y-2">
        <p className="text-xs text-slate-300">Still have a question not covered here?</p>
        <Link to="/contact" className="text-xs font-bold text-brand-teal hover:underline">
          Contact our Parent Support Team &rarr;
        </Link>
      </div>
    </div>
  );
}

