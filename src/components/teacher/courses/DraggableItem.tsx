import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../../../types/dndTypes";
import type { OutlineItem } from "./CourseOutline";
import type { LessonItem } from "../../../types/learningTypes";

interface DraggableItemProps {
  item: LessonItem;
  index: number;
  lessonId: string;
  selectedItem: OutlineItem | null;
  onSelectItem: (item: OutlineItem) => void;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onDropItem: () => void;
}

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

const DraggableItem = ({
  item,
  index,
  lessonId,
  selectedItem,
  onSelectItem,
  moveItem,
  onDropItem,
}: DraggableItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.ITEM,
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
      const sourceLessonId = item.lessonId;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && sourceLessonId === lessonId) {
        return;
      }

      // Only allow reordering within the same lesson for now
      if (sourceLessonId !== lessonId) {
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
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    drop() {
      onDropItem();
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: () => {
      return { id: item.id, index, lessonId };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className={`flex items-center gap-2 p-2 rounded-lg cursor-grab active:cursor-grabbing transition-all ${
        selectedItem?.type === "item" && selectedItem?.id === item.id
          ? "bg-blue-50 border border-blue-200"
          : "hover:bg-slate-50"
      }`}
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering lesson selection
        onSelectItem({
          type: "item",
          id: item.id,
          title: item.title,
          lessonId: lessonId,
          itemType: item.type,
        });
      }}
    >
      <span className="material-symbols-outlined text-sm text-slate-300 cursor-move">
        drag_indicator
      </span>
      <span className="material-symbols-outlined text-sm text-slate-400">
        {getItemIcon(item.type)}
      </span>
      <span className="text-sm text-slate-600 truncate flex-1">
        {item.title}
      </span>
      <span className="text-xs text-slate-400 uppercase">{item.type}</span>
    </div>
  );
};

export default DraggableItem;
