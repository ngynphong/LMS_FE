import { useState, useEffect } from "react";
import type { ApiLesson, LessonItem } from "../../types/learningTypes";

interface LessonSidebarProps {
  lessons: ApiLesson[];
  currentLesson: ApiLesson | null;
  currentItem: LessonItem | null;
  isOpen: boolean;
  onClose: () => void;
  onLessonSelect: (lessonId: string) => void;
  onItemSelect: (item: LessonItem) => void;
  completedItemIds?: Set<string>;
}

// Helper functions
const getItemTypeIcon = (type: string) => {
  switch (type) {
    case "VIDEO":
      return "play_circle";
    case "TEXT":
      return "article";
    case "PDF":
      return "picture_as_pdf";
    case "PPT":
      return "co_present";
    default:
      return "description";
  }
};

const getItemTypeColor = (type: string) => {
  switch (type) {
    case "VIDEO":
      return "text-purple-600 bg-purple-100";
    case "TEXT":
      return "text-blue-600 bg-blue-100";
    case "PDF":
      return "text-red-600 bg-red-100";
    case "PPT":
      return "text-orange-600 bg-orange-100";
    default:
      return "text-slate-600 bg-slate-100";
  }
};

const LessonSidebar = ({
  lessons,
  currentLesson,
  currentItem,
  isOpen,
  onClose,
  onLessonSelect,
  onItemSelect,
  completedItemIds = new Set(),
}: LessonSidebarProps) => {
  // Check if a lesson item is accessible (previous items in ALL lessons must be completed)
  const isItemAccessible = (
    lessonIndex: number,
    itemIndex: number,
  ): boolean => {
    // Check all previous lessons are fully completed
    for (let i = 0; i < lessonIndex; i++) {
      const lesson = lessons[i];
      const items = lesson.lessonItems || [];
      for (const item of items) {
        if (!completedItemIds.has(item.id)) {
          return false;
        }
      }
    }

    // Check previous items in current lesson
    const currentLessonItems = lessons[lessonIndex]?.lessonItems || [];
    for (let i = 0; i < itemIndex; i++) {
      if (!completedItemIds.has(currentLessonItems[i].id)) {
        return false;
      }
    }

    return true;
  };

  // Check if a lesson is accessible
  const isLessonAccessible = (lessonIndex: number): boolean => {
    if (lessonIndex === 0) return true;

    // All items in previous lessons must be completed
    for (let i = 0; i < lessonIndex; i++) {
      const lesson = lessons[i];
      const items = lesson.lessonItems || [];
      for (const item of items) {
        if (!completedItemIds.has(item.id)) {
          return false;
        }
      }
    }
    return true;
  };

  // Count completed items in a lesson
  const getCompletedCount = (lesson: ApiLesson): number => {
    if (!lesson.lessonItems) return 0;
    return lesson.lessonItems.filter((item) => completedItemIds.has(item.id))
      .length;
  };

  // State for expanded lessons
  const [expandedLessonIds, setExpandedLessonIds] = useState<Set<string>>(
    new Set(),
  );

  // Auto-expand current lesson
  useEffect(() => {
    if (currentLesson?.id) {
      setExpandedLessonIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(currentLesson.id);
        return newSet;
      });
    }
  }, [currentLesson?.id]);

  const toggleLesson = (lessonId: string) => {
    setExpandedLessonIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-80 flex flex-col border-r border-gray-200 bg-white overflow-hidden transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-100 bg-[#f5f7fa] flex justify-between items-center">
          <div>
            <h1 className="text-base font-semibold text-[#1A2B3C]">
              Nội dung khóa học
            </h1>
            <p className="mt-1 text-xs text-[#4A5568]">
              {lessons.length} bài học
            </p>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Lessons List with Items */}
        <div className="flex-1 overflow-y-auto">
          {lessons.map((lesson, lessonIndex) => {
            const isCurrentLesson = currentLesson?.id === lesson.id;
            const lessonAccessible = isLessonAccessible(lessonIndex);
            const completedCount = getCompletedCount(lesson);
            const totalItems = lesson.lessonItems?.length || 0;
            const isLessonComplete =
              lesson.completed ||
              (totalItems > 0 && completedCount === totalItems);
            const isExpanded = expandedLessonIds.has(lesson.id);

            return (
              <div key={lesson.id} className="border-b border-gray-100">
                {/* Lesson Header */}
                <div
                  onClick={() => {
                    if (lessonAccessible) {
                      onLessonSelect(lesson.id);
                      // Ensure it expands when selected
                      if (!isExpanded) toggleLesson(lesson.id);
                    }
                  }}
                  className={`px-4 py-3 flex items-center gap-3 transition-colors ${
                    !lessonAccessible
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  } ${
                    isCurrentLesson
                      ? "bg-blue-50 border-l-4 border-blue-600"
                      : lessonAccessible
                        ? "hover:bg-gray-50"
                        : ""
                  } ${isLessonComplete ? "border-green-500 bg-green-50" : ""}`}
                >
                  <div
                    className={`size-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isLessonComplete
                        ? "bg-green-500 text-white"
                        : isCurrentLesson
                          ? "bg-blue-600 text-white"
                          : !lessonAccessible
                            ? "bg-slate-300 text-slate-500"
                            : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isLessonComplete ? (
                      <span className="material-symbols-outlined text-sm">
                        check
                      </span>
                    ) : !lessonAccessible ? (
                      <span className="material-symbols-outlined text-sm">
                        lock
                      </span>
                    ) : (
                      lessonIndex + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-medium truncate ${
                        isCurrentLesson
                          ? "text-blue-700"
                          : !lessonAccessible
                            ? "text-slate-500"
                            : "text-slate-800"
                      }`}
                    >
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {completedCount}/{totalItems} hoàn thành
                    </p>
                  </div>
                  {/* Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLesson(lesson.id);
                    }}
                    className="size-6 flex items-center justify-center rounded-full hover:bg-black/5 text-slate-400"
                  >
                    <span
                      className={`material-symbols-outlined text-xl transition-transform duration-400 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                </div>

                {/* Lesson Items */}
                {isExpanded &&
                  lesson.lessonItems &&
                  lesson.lessonItems.length > 0 && (
                    <div className="bg-gray-50 py-1">
                      {lesson.lessonItems.map((item, itemIndex) => {
                        const isCurrentItem = currentItem?.id === item.id;
                        const itemAccessible = isItemAccessible(
                          lessonIndex,
                          itemIndex,
                        );
                        const isItemComplete = completedItemIds.has(item.id);

                        return (
                          <div
                            key={item.id}
                            onClick={() => itemAccessible && onItemSelect(item)}
                            className={`px-4 py-2.5 flex items-center gap-3 transition-colors ml-4 border-l-2 ${
                              !itemAccessible
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            } ${
                              isCurrentItem
                                ? "border-blue-500 bg-blue-50"
                                : itemAccessible
                                  ? "border-transparent hover:bg-gray-100"
                                  : "border-transparent"
                            }
                              ${
                                isItemComplete
                                  ? "border-green-500 bg-green-50"
                                  : ""
                              }
                            }`}
                          >
                            <div
                              className={`size-6 rounded flex items-center justify-center ${
                                isItemComplete
                                  ? getItemTypeColor(item.type)
                                  : !itemAccessible
                                    ? "bg-slate-200 text-slate-400"
                                    : getItemTypeColor(item.type)
                              }`}
                            >
                              <span className="material-symbols-outlined text-sm">
                                {isItemComplete
                                  ? getItemTypeIcon(item.type)
                                  : !itemAccessible
                                    ? "lock"
                                    : getItemTypeIcon(item.type)}
                              </span>
                            </div>
                            <span
                              className={`text-sm truncate flex-1 ${
                                isCurrentItem
                                  ? "text-blue-700 font-medium"
                                  : isItemComplete
                                    ? "text-green-700"
                                    : !itemAccessible
                                      ? "text-slate-400"
                                      : "text-slate-600"
                              }`}
                            >
                              {item.title}
                            </span>
                            {isItemComplete && (
                              <span className="material-symbols-outlined text-green-500 text-sm">
                                check
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default LessonSidebar;

// Export helper functions for use in other components
export { getItemTypeIcon, getItemTypeColor };
