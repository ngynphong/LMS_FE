import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { StaticQuestion } from "@/types/quiz";
import { MdDelete } from "react-icons/md";

const DRAG_TYPE = "QUESTION_ROW";

interface DraggableRowProps {
  index: number;
  sq: StaticQuestion;
  cachedContent: string | undefined;
  onMove: (from: number, to: number) => void;
  onScoreChange: (questionId: string, score: number) => void;
  onDelete: (questionId: string) => void;
  hasAttempts?: boolean;
}

const DraggableRow = ({
  index,
  sq,
  cachedContent,
  onMove,
  onScoreChange,
  onDelete,
  hasAttempts = false,
}: DraggableRowProps) => {
  const ref = useRef<HTMLTableRowElement>(null);

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: DRAG_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop<
    { index: number },
    void,
    { isOver: boolean }
  >({
    accept: DRAG_TYPE,
    hover(item) {
      if (item.index === index || hasAttempts) return;
      onMove(item.index, index);
      item.index = index;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  dragPreview(drop(ref));

  return (
    <tr
      ref={ref}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className={`transition-colors text-sm ${
        isOver ? "bg-blue-50" : "hover:bg-slate-50"
      }`}
    >
      <td className="px-3 py-3 w-8">
        <div
          ref={drag as unknown as React.Ref<HTMLDivElement>}
          className={`${hasAttempts ? "cursor-not-allowed opacity-30" : "cursor-grab active:cursor-grabbing hover:text-slate-600"} text-slate-400 flex items-center justify-center font-black`}
          title={hasAttempts ? "Không thể sắp xếp khi đã có bài làm" : "Kéo để sắp xếp"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="4" r="1.5" />
            <circle cx="11" cy="4" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="11" cy="12" r="1.5" />
          </svg>
        </div>
      </td>
      <td className="py-3 w-8">
        <span className="text-xs font-bold text-slate-400">{index + 1}</span>
      </td>
      <td className="px-4 py-3">
        <div
          className="line-clamp-1"
          dangerouslySetInnerHTML={{
            __html:
              cachedContent || sq.questionContent || "(Không có nội dung)",
          }}
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          className="w-16 h-8 border border-slate-200 rounded px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 font-bold"
          value={sq.score}
          onChange={(e) =>
            onScoreChange(sq.questionId, parseFloat(e.target.value))
          }
          disabled={hasAttempts}
          min={0.5}
          step={0.5}
        />
      </td>
      <td className="px-4 py-3 text-center">
        <button
          type="button"
          onClick={() => onDelete(sq.questionId)}
          disabled={hasAttempts}
          className="text-red-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          title={hasAttempts ? "Không thể xóa khi đã có bài làm" : "Xóa câu hỏi"}
        >
          <MdDelete className="text-lg" />
        </button>
      </td>
    </tr>
  );
};

export default DraggableRow;
