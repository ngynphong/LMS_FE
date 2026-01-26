import { useState } from 'react';
import LessonItem from './LessonItem';
import type { Lesson } from './LessonItem';

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface ChapterItemProps {
  chapter: Chapter;
  isActive?: boolean;
  activeLessonId?: string;
  onLessonClick?: (lessonId: string) => void;
}

const ChapterItem = ({ chapter, isActive, activeLessonId, onLessonClick }: ChapterItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
      isActive
        ? 'border-2 border-[#0074bd] ring-4 ring-[#0074bd]/5'
        : 'border-slate-200'
    }`}>
      {/* Chapter Header */}
      <div className={`flex items-center justify-between px-6 py-5 border-b ${
        isActive
          ? 'bg-[#0074bd]/5 border-[#0074bd]/10'
          : 'bg-slate-50/50 border-slate-100'
      }`}>
        <div className="flex items-center gap-3">
          <span className={`material-symbols-outlined cursor-grab ${
            isActive ? 'text-[#0074bd]' : 'text-slate-400'
          }`}>
            drag_indicator
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <span className={`material-symbols-outlined text-slate-400 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}>
              chevron_right
            </span>
            <h3 className="text-[#101518] text-lg font-bold">{chapter.title}</h3>
          </button>
          <span className="text-xs text-[#5e7b8d] ml-2">
            {chapter.lessons.length} bài học
          </span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-[#0074bd] transition-colors">
            <span className="material-symbols-outlined">edit</span>
          </button>
          <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>

      {/* Lessons */}
      {isExpanded && (
        <>
          <div className="divide-y divide-slate-100">
            {chapter.lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                isActive={activeLessonId === lesson.id}
                onClick={() => onLessonClick?.(lesson.id)}
              />
            ))}
          </div>

          {/* Add Lesson Button */}
          <div className="p-4 border-t border-slate-100">
            <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-dashed border-slate-200 text-slate-500 hover:border-[#0074bd] hover:text-[#0074bd] transition-all font-medium text-sm">
              <span className="material-symbols-outlined text-sm">add</span>
              Thêm bài học mới
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChapterItem;
export type { Chapter };
