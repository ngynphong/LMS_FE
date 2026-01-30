import { useState, useEffect } from "react";
import type { ApiLesson, LessonItem } from "../../../types/learningTypes";
import type { ApiCourse } from "../../../types/learningTypes";

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
}

const CourseOutline = ({
  course,
  lessons,
  selectedItem,
  onSelectItem,
  onAddLesson,
  onAddItem,
  courseCreated,
}: CourseOutlineProps) => {
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set(),
  );

  // Expand all lessons by default when lessons change
  useEffect(() => {
    if (lessons.length > 0) {
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

  const getItemIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "play_circle";
      case "TEXT":
        return "article";
      case "QUIZ":
        return "quiz";
      case "PDF":
        return "picture_as_pdf";
      default:
        return "description";
    }
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
            <div key={lesson.id}>
              {/* Lesson Item */}
              <div
                className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all ${
                  selectedItem?.type === "lesson" &&
                  selectedItem?.id === lesson.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-slate-50"
                }`}
                onClick={() =>
                  onSelectItem({
                    type: "lesson",
                    id: lesson.id,
                    title: lesson.title,
                  })
                }
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLesson(lesson.id);
                  }}
                  className="p-0.5 hover:bg-slate-200 rounded transition-colors"
                >
                  <span className="material-symbols-outlined text-sm text-slate-500">
                    {expandedLessons.has(lesson.id)
                      ? "expand_more"
                      : "chevron_right"}
                  </span>
                </button>
                <span className="material-symbols-outlined text-slate-500">
                  description
                </span>
                <span className="text-sm font-medium text-slate-700 truncate flex-1">
                  {index + 1}. {lesson.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddItem(lesson.id);
                  }}
                  className="p-1 hover:bg-blue-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Thêm nội dung"
                >
                  <span className="material-symbols-outlined text-sm text-blue-600">
                    add
                  </span>
                </button>
              </div>

              {/* Lesson Items */}
              {expandedLessons.has(lesson.id) &&
                lesson.lessonItems &&
                lesson.lessonItems.length > 0 && (
                  <div className="ml-8 mt-1 space-y-1">
                    {lesson.lessonItems.map((item: LessonItem) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                          selectedItem?.type === "item" &&
                          selectedItem?.id === item.id
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-slate-50"
                        }`}
                        onClick={() =>
                          onSelectItem({
                            type: "item",
                            id: item.id,
                            title: item.title,
                            lessonId: lesson.id,
                            itemType: item.type,
                          })
                        }
                      >
                        <span className="material-symbols-outlined text-sm text-slate-400">
                          {getItemIcon(item.type)}
                        </span>
                        <span className="text-sm text-slate-600 truncate flex-1">
                          {item.title}
                        </span>
                        <span className="text-xs text-slate-400 uppercase">
                          {item.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              {/* Add Item Button for each lesson */}
              {expandedLessons.has(lesson.id) && (
                <div className="ml-8 mt-1">
                  <button
                    onClick={() => onAddItem(lesson.id)}
                    className="flex items-center gap-2 p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors w-full"
                  >
                    <span className="material-symbols-outlined text-sm">
                      add_circle
                    </span>
                    <span>Thêm nội dung</span>
                  </button>
                </div>
              )}
            </div>
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
