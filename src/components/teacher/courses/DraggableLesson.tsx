import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../../../types/dndTypes";
import type { OutlineItem } from "./CourseOutline";
import DraggableItem from "./DraggableItem";
import type { ApiLesson, LessonItem } from "../../../types/learningTypes";

interface DraggableLessonProps {
  lesson: ApiLesson;
  index: number;
  selectedItem: OutlineItem | null;
  expandedLessons: Set<string>;
  onSelectItem: (item: OutlineItem) => void;
  toggleLesson: (lessonId: string) => void;
  onAddItem: (lessonId: string) => void;
  moveLesson: (dragIndex: number, hoverIndex: number) => void;
  onDropLesson: () => void;
  moveItem: (lessonId: string, dragIndex: number, hoverIndex: number) => void;
  onDropItem: (lessonId: string) => void;
}

const DraggableLesson = ({
  lesson,
  index,
  selectedItem,
  expandedLessons,
  onSelectItem,
  toggleLesson,
  onAddItem,
  moveLesson,
  onDropLesson,
  moveItem,
  onDropItem,
}: DraggableLessonProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.LESSON,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveLesson(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      item.index = hoverIndex;
    },
    drop() {
      onDropLesson();
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.LESSON,
    item: () => {
      return { id: lesson.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      {/* Lesson Item */}
      <div
        className={`flex items-center gap-2 p-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all ${
          selectedItem?.type === "lesson" && selectedItem?.id === lesson.id
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
        <span className="material-symbols-outlined text-sm text-slate-300 cursor-move">
          drag_indicator
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLesson(lesson.id);
          }}
          className="p-0.5 hover:bg-slate-200 rounded transition-colors"
        >
          <span className="material-symbols-outlined text-sm text-slate-500">
            {expandedLessons.has(lesson.id) ? "expand_more" : "chevron_right"}
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
            {lesson.lessonItems.map((item: LessonItem, i: number) => (
              <DraggableItem
                key={item.id}
                item={item}
                index={i}
                lessonId={lesson.id}
                selectedItem={selectedItem}
                onSelectItem={onSelectItem}
                moveItem={(dragIndex, hoverIndex) =>
                  moveItem(lesson.id, dragIndex, hoverIndex)
                }
                onDropItem={() => onDropItem(lesson.id)}
              />
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
  );
};

export default DraggableLesson;
