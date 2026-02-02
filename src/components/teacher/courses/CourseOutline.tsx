import { useState, useEffect } from "react";
import type { ApiLesson } from "../../../types/learningTypes";
import type { ApiCourse } from "../../../types/learningTypes";
import DraggableLesson from "./DraggableLesson";

interface OutlineItem {
  type: "course" | "lesson" | "item";
  id: string;
  title: string;
  lessonId?: string; // for items
  itemType?: string; // VIDEO, TEXT, etc.
}

interface CourseOutlineProps {
  course: ApiCourse | null;
  lessons: ApiLesson[];
  selectedItem: OutlineItem | null;
  onSelectItem: (item: OutlineItem) => void;
  onAddLesson: () => void;
  onAddItem: (lessonId: string) => void;
  courseCreated: boolean;
  moveLesson: (dragIndex: number, hoverIndex: number) => void;
  onDropLesson: () => void;
  moveItem: (lessonId: string, dragIndex: number, hoverIndex: number) => void;
  onDropItem: (lessonId: string) => void;
}

const CourseOutline = ({
  course,
  lessons,
  selectedItem,
  onSelectItem,
  onAddLesson,
  onAddItem,
  courseCreated,
  moveLesson,
  onDropLesson,
  moveItem,
  onDropItem,
}: CourseOutlineProps) => {
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set(),
  );

  // Expand all lessons by default when lessons change
  useEffect(() => {
    if (lessons.length > 0 && expandedLessons.size === 0) {
      setExpandedLessons(new Set(lessons.map((l) => l.id)));
    }
  }, [lessons]);

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">Cấu trúc khóa học</h3>
      </div>

      {/* Outline Tree */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Course Level */}
        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
            selectedItem?.type === "course"
              ? "bg-blue-50 border border-blue-200"
              : "hover:bg-slate-50"
          }`}
          onClick={() =>
            onSelectItem({
              type: "course",
              id: course?.id || "new",
              title: course?.name || "Khóa học mới",
            })
          }
        >
          <span className="material-symbols-outlined text-blue-600">
            menu_book
          </span>
          <span className="font-semibold text-slate-900 truncate flex-1">
            {course?.name || "Khóa học mới"}
          </span>
          {!courseCreated && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              Chưa lưu
            </span>
          )}
        </div>

        {/* Lessons */}
        <div className="mt-2 ml-4 space-y-1">
          {lessons.map((lesson, index) => (
            <DraggableLesson
              key={lesson.id}
              lesson={lesson}
              index={index}
              selectedItem={selectedItem}
              expandedLessons={expandedLessons}
              onSelectItem={onSelectItem}
              toggleLesson={toggleLesson}
              onAddItem={onAddItem}
              moveLesson={moveLesson}
              onDropLesson={onDropLesson}
              moveItem={moveItem}
              onDropItem={onDropItem}
            />
          ))}

          {/* Add Lesson Button */}
          <button
            onClick={onAddLesson}
            disabled={!courseCreated}
            className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors w-full mt-2 ${
              courseCreated
                ? "text-blue-600 hover:bg-blue-50"
                : "text-slate-400 cursor-not-allowed"
            }`}
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span className="text-sm font-medium">Thêm bài học</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      {!courseCreated && (
        <div className="p-4 border-t border-slate-200 bg-amber-50">
          <p className="text-sm text-amber-700">
            <span className="material-symbols-outlined text-sm align-middle mr-1">
              info
            </span>
            Lưu khóa học trước để thêm bài học
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseOutline;
export type { OutlineItem };
