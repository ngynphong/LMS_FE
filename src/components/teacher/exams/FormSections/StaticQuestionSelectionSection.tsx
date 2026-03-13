import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableRow from "./DraggableRow";
import type { StaticQuestion } from "@/types/quiz";
import type { Question } from "@/types/question";

interface StaticQuestionSelectionSectionProps {
  isEditMode: boolean;
  isDynamic: boolean;
  setIsDynamic: (val: boolean) => void;
  questionSearch: string;
  setQuestionSearch: (val: string) => void;
  qLessonName: string;
  setQLessonName: (val: string) => void;
  myLessonNames: string[];
  qPage: number;
  setQPage: (val: number | ((prev: number) => number)) => void;
  qPageSize: number;
  setQPageSize: (val: number) => void;
  qTotalPages: number;
  availableQuestions: Question[];
  loadingQuestions: boolean;
  fetchingQuestions: boolean;
  staticQuestions: StaticQuestion[];
  toggleStaticQuestion: (question: Question) => void;
  handleSelectAllDisplayed: () => void;
  moveQuestion: (from: number, to: number) => void;
  updateStaticQuestion: (
    id: string,
    field: keyof StaticQuestion,
    value: any,
  ) => void;
  questionContentCache: Record<string, string>;
  hasAttempts?: boolean;
}

const StaticQuestionSelectionSection = ({
  isEditMode,
  isDynamic,
  setIsDynamic,
  questionSearch,
  setQuestionSearch,
  qLessonName,
  setQLessonName,
  myLessonNames,
  qPage,
  setQPage,
  qPageSize,
  setQPageSize,
  qTotalPages,
  availableQuestions,
  loadingQuestions,
  fetchingQuestions,
  staticQuestions,
  toggleStaticQuestion,
  handleSelectAllDisplayed,
  moveQuestion,
  updateStaticQuestion,
  questionContentCache,
  hasAttempts = false,
}: StaticQuestionSelectionSectionProps) => {
  const isAllDisplayedSelected =
    availableQuestions.length > 0 &&
    availableQuestions.every((q) =>
      staticQuestions.some((sq) => sq.questionId === q.id),
    );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#111518]">Cấu hình câu hỏi</h3>
        {(!isEditMode || (isEditMode && !hasAttempts)) && (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold ${!isDynamic ? "text-[#0074bd]" : "text-slate-400"}`}
            >
              Thủ công
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDynamic}
                onChange={(e) => setIsDynamic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E90FF]"></div>
            </label>
            <span
              className={`text-sm font-bold ${isDynamic ? "text-[#1E90FF]" : "text-slate-400"}`}
            >
              Tự động (Dynamic)
            </span>
          </div>
        )}
        {isEditMode && hasAttempts && (
            <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
             Chế độ {isDynamic ? "Tự động" : "Thủ công"} (Đã có bài làm - Không thể đổi)
           </span>
        )}
      </div>
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] font-medium"
                value={questionSearch}
                onChange={(e) => {
                  setQuestionSearch(e.target.value);
                  setQPage(1);
                }}
              />
            </div>
            <div className="min-w-[200px]">
              <select
                value={qLessonName}
                onChange={(e) => {
                  setQLessonName(e.target.value);
                  setQPage(1);
                }}
                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] font-medium"
              >
                <option value="">Tất cả bài học</option>
                {myLessonNames.map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={isAllDisplayedSelected}
                      onChange={handleSelectAllDisplayed}
                      disabled={
                        !availableQuestions || availableQuestions.length === 0 || hasAttempts
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                      title={hasAttempts ? "Không thể thay đổi khi đã có bài làm" : "Chọn tất cả trang này"}
                    />
                  </th>
                  <th className="px-4 py-3">Nội dung câu hỏi</th>
                  <th className="px-4 py-3 w-28 text-center uppercase tracking-tight font-black text-[11px] text-slate-400">
                    Loại
                  </th>
                  <th className="px-4 py-3 w-28 text-center uppercase tracking-tight font-black text-[11px] text-slate-400">
                    Độ khó
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y divide-slate-100 transition-opacity duration-200 ${fetchingQuestions && !loadingQuestions ? "opacity-50 pointer-events-none" : ""}`}
              >
                {loadingQuestions ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-10 text-center font-bold text-slate-500"
                    >
                      Đang tải câu hỏi...
                    </td>
                  </tr>
                ) : availableQuestions?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-10 text-center text-slate-500 font-bold"
                    >
                      Không tìm thấy câu hỏi nào.
                    </td>
                  </tr>
                ) : (
                  availableQuestions?.map((q) => {
                    const isSelected = staticQuestions.some(
                      (sq) => sq.questionId === q.id,
                    );
                    return (
                      <tr
                        key={q.id}
                        className={`transition-colors font-medium ${isSelected ? "bg-blue-50" : "hover:bg-slate-50"}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleStaticQuestion(q)}
                            disabled={hasAttempts}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className="line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: q.content }}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {q.type === "SINGLE_CHOICE"
                              ? "1 Đáp án"
                              : "Nhiều ĐA"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                              q.difficulty === "EASY"
                                ? "bg-green-50 text-green-700 border-green-100"
                                : q.difficulty === "MEDIUM"
                                  ? "bg-amber-50 text-amber-700 border-amber-100"
                                  : "bg-red-50 text-red-700 border-red-100"
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4 font-bold">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Hiển thị</span>
                <select
                  value={qPageSize}
                  onChange={(e) => {
                    setQPageSize(Number(e.target.value));
                    setQPage(1);
                  }}
                  className="bg-white border border-slate-300 text-slate-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 outline-none font-bold"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>kết quả</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 mr-2">
                  Trang {qPage} / {qTotalPages || 1}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setQPage((prev) => Math.max(prev - 1, 1))}
                    disabled={qPage === 1}
                    className="p-1 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    Trước
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setQPage((prev) => Math.min(prev + 1, qTotalPages))
                    }
                    disabled={qPage >= (qTotalPages || 1)}
                    className="p-1 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>

          {staticQuestions.length > 0 && (
            <div className="mt-10 animate-in fade-in zoom-in duration-500">
              <h4 className="font-bold text-[#111518] mb-4 flex items-center gap-2">
                Câu hỏi đã chọn ({staticQuestions.length})
                <span className="text-[10px] uppercase font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  kéo để sắp xếp
                </span>
              </h4>
              <div className="border rounded-xl overflow-hidden shadow-sm">
                <DndProvider backend={HTML5Backend}>
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-3 w-8"></th>
                        <th className="py-3 w-8">#</th>
                        <th className="px-4 py-3">Nội dung câu hỏi</th>
                        <th className="px-4 py-3 w-28 text-center uppercase tracking-tight font-black text-[11px] text-slate-400">
                          Điểm
                        </th>
                        <th className="px-4 py-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {staticQuestions.map((sq, index) => (
                        <DraggableRow
                          key={sq.questionId}
                          index={index}
                          sq={sq}
                          cachedContent={questionContentCache[sq.questionId]}
                          onMove={moveQuestion}
                          onScoreChange={(id, score) =>
                            updateStaticQuestion(id, "score", score)
                          }
                          onDelete={(questionId) =>
                            toggleStaticQuestion({ id: questionId } as any)
                          }
                          hasAttempts={hasAttempts}
                        />
                      ))}
                    </tbody>
                  </table>
                </DndProvider>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaticQuestionSelectionSection;
