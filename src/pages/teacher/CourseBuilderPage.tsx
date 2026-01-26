import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CourseBuilderLayout from '../../layouts/CourseBuilderLayout';
import ChapterItem from '../../components/teacher/courses/ChapterItem';
import CourseBuilderSidebar from '../../components/teacher/courses/CourseBuilderSidebar';
import type { Chapter } from '../../components/teacher/courses/ChapterItem';
import type { Lesson } from '../../components/teacher/courses/LessonItem';

// Mock data
const mockChapters: Chapter[] = [
  {
    id: '1',
    title: 'Chương 1: Giới thiệu về Web Development',
    lessons: [
      {
        id: '1-1',
        title: '1.1 Lộ trình trở thành Fullstack Developer',
        type: 'video',
        duration: '12:45',
        status: 'completed'
      },
      {
        id: '1-2',
        title: '1.2 Cài đặt môi trường phát triển (VS Code, Node.js)',
        type: 'document',
        pageCount: 5,
        status: 'completed'
      }
    ]
  },
  {
    id: '2',
    title: 'Chương 2: Cơ bản về HTML & CSS',
    lessons: [
      {
        id: '2-1',
        title: 'Kiểm tra kiến thức: HTML Elements',
        type: 'quiz',
        status: 'editing'
      }
    ]
  }
];

const CourseBuilderPage = () => {
  const { id } = useParams();
  const isNew = !id;

  const [activeLessonId, setActiveLessonId] = useState<string | null>('2-1');
  const [chapters] = useState<Chapter[]>(mockChapters);

  // Find active lesson to determine sidebar type
  const getActiveLessonType = (): Lesson['type'] | null => {
    if (!activeLessonId) return null;
    for (const chapter of chapters) {
      const lesson = chapter.lessons.find(l => l.id === activeLessonId);
      if (lesson) return lesson.type;
    }
    return null;
  };

  const getActiveChapterId = (): string | null => {
    if (!activeLessonId) return null;
    for (const chapter of chapters) {
      if (chapter.lessons.some(l => l.id === activeLessonId)) {
        return chapter.id;
      }
    }
    return null;
  };

  const activeLessonType = getActiveLessonType();
  const activeChapterId = getActiveChapterId();

  return (
    <CourseBuilderLayout sidebar={<CourseBuilderSidebar lessonType={activeLessonType} />}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-4 text-[#5e7b8d]">
        <Link to="/teacher/courses" className="text-sm font-medium hover:text-[#0074bd] transition-colors">
          Khóa học
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-sm font-medium text-slate-900">
          {isNew ? 'Tạo mới' : 'Trình xây dựng'}
        </span>
      </div>

      {/* Page Heading */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <h2 className="text-[#101518] text-3xl font-black leading-tight tracking-tight max-w-xl">
          {isNew ? 'Tạo khóa học mới' : 'Tạo lộ trình học: Lập trình Web Fullstack'}
        </h2>
        <div className="flex gap-2 shrink-0">
          <button className="flex items-center justify-center rounded-lg h-10 px-5 bg-white border border-slate-200 text-slate-700 text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
            Xem trước
          </button>
          <button className="flex items-center justify-center rounded-lg h-10 px-5 bg-[#0074bd] text-white text-sm font-bold shadow-sm hover:bg-[#0074bd]/90 transition-all">
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Course Info (for new courses) */}
      {isNew && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-[#101518] mb-4">Thông tin khóa học</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tên khóa học</label>
              <input
                type="text"
                placeholder="Nhập tên khóa học..."
                className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả ngắn</label>
              <textarea
                rows={3}
                placeholder="Mô tả ngắn gọn về khóa học..."
                className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd] resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Giá khóa học</label>
                <input
                  type="text"
                  placeholder="VD: 500.000đ"
                  className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Danh mục</label>
                <select className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]">
                  <option>Lập trình</option>
                  <option>Thiết kế</option>
                  <option>Marketing</option>
                  <option>Kinh doanh</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Builder Area */}
      <div className="flex flex-col gap-6">
        {chapters.map((chapter) => (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            isActive={activeChapterId === chapter.id}
            activeLessonId={activeLessonId || undefined}
            onLessonClick={(lessonId) => setActiveLessonId(lessonId)}
          />
        ))}

        {/* Add New Chapter */}
        <button className="flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 text-slate-500 hover:bg-slate-100 hover:border-[#0074bd] transition-all group">
          <div className="size-12 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">add_circle</span>
          </div>
          <span className="text-base font-bold">Thêm chương mới</span>
        </button>
      </div>
    </CourseBuilderLayout>
  );
};

export default CourseBuilderPage;
