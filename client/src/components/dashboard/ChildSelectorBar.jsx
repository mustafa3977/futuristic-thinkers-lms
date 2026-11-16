import React from 'react';
import { User, Plus, Edit2, ShieldCheck, Check } from 'lucide-react';

export default function ChildSelectorBar({
  childrenList = [],
  activeChild,
  onSelectChild,
  onOpenAddModal,
  onOpenEditModal
}) {
  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Learning As:
        </span>

        {childrenList.length === 0 ? (
          <span className="text-xs text-amber-300 italic">No child profile added yet</span>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {childrenList.map((child) => {
              const isSelected = activeChild?._id === child._id;
              return (
                <button
                  key={child._id}
                  onClick={() => onSelectChild(child)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-teal-500/20 text-brand-teal border-teal-500/50 ring-2 ring-brand-teal/40'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{child.nickname}</span>
                  <span className="text-[10px] text-slate-400">({child.age}y)</span>
                  {isSelected && <Check className="w-3 h-3 text-brand-teal" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        {activeChild && (
          <button
            onClick={() => onOpenEditModal(activeChild)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition-colors"
            title="Edit profile"
            aria-label="Edit active child profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-700 hover:text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-brand-teal" />
          <span>Add Child</span>
        </button>
      </div>
    </div>
  );
}

