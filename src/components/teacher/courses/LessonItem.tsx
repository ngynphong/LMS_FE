interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz';
  duration?: string;
  pageCount?: number;
  status: 'completed' | 'editing' | 'draft';
}

interface LessonItemProps {
  lesson: Lesson;
  isActive?: boolean;
  onClick?: () => void;
}

const LessonItem = ({ lesson, isActive, onClick }: LessonItemProps) => {
  const typeConfig = {
    video: { icon: 'play_circle', label: 'Video' },
    document: { icon: 'description', label: 'Tài liệu' },
    quiz: { icon: 'task', label: 'Trắc nghiệm' }
  };

  const statusConfig = {
    completed: {
      label: 'Hoàn tất',
      className: 'bg-green-100 text-green-700'
    },
    editing: {
      label: 'Đang chỉnh sửa',
      className: 'bg-blue-100 text-blue-700'
    },
    draft: {
      label: 'Bản nháp',
      className: 'bg-slate-100 text-slate-600'
    }
  };

  const type = typeConfig[lesson.type];
  const status = statusConfig[lesson.status];

  const getSubtitle = () => {
    if (lesson.type === 'video' && lesson.duration) {
      return `${type.label} • ${lesson.duration}`;
    }
    if (lesson.type === 'document' && lesson.pageCount) {
      return `${type.label} • ${lesson.pageCount} trang`;
    }
    if (lesson.type === 'quiz') {
      return `${type.label} • ${lesson.status === 'editing' ? 'Đang chỉnh sửa' : 'Chưa cấu hình'}`;
    }
    return type.label;
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-6 min-h-[72px] py-3 transition-colors cursor-pointer ${
        isActive
          ? 'bg-[#0074bd]/5'
          : 'bg-white hover:bg-slate-50'
      }`}
    >
      <div className={`flex items-center justify-center rounded-lg shrink-0 size-10 ${
        isActive
          ? 'bg-[#0074bd] text-white'
          : 'bg-[#0074bd]/10 text-[#0074bd]'
      }`}>
        <span
          className="material-symbols-outlined text-[20px]"
          style={lesson.type === 'quiz' && isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          {type.icon}
        </span>
      </div>

      <div className="flex flex-col flex-1">
        <p className={`text-base font-medium leading-normal ${
          isActive ? 'text-[#0074bd] font-bold' : 'text-[#101518]'
        }`}>
          {lesson.title}
        </p>
        <p className="text-[#5e7b8d] text-xs font-normal">{getSubtitle()}</p>
      </div>

      <div className="flex items-center gap-4">
        {lesson.status !== 'draft' && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${status.className}`}>
            {status.label}
          </span>
        )}
        {isActive ? (
          <span className="material-symbols-outlined text-[#0074bd]">arrow_forward_ios</span>
        ) : (
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonItem;
export type { Lesson };
