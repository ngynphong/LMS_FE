import type { ApiCourse, ApiLesson } from "@/types/learningTypes";

interface BasicInfoSectionProps {
  formData: {
    title: string;
    description: string;
    type: "PRACTICE" | "QUIZ";
    isPublished: boolean;
  };
  setFormData: (data: any) => void;
  courses: ApiCourse[];
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  lessons: ApiLesson[];
  selectedLessonId: string;
  setSelectedLessonId: (id: string) => void;
  lessonItems: any[];
  selectedLessonItemId: string;
  setSelectedLessonItemId: (id: string) => void;
}

const BasicInfoSection = ({
  formData,
  setFormData,
  courses,
  selectedCourseId,
  setSelectedCourseId,
  lessons,
  selectedLessonId,
  setSelectedLessonId,
  lessonItems,
  selectedLessonItemId,
  setSelectedLessonItemId,
}: BasicInfoSectionProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#111518]">Thông tin chung</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm font-semibold text-slate-700">
            Công khai
          </span>
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData({ ...formData, isPublished: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </div>
        </label>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#111518] mb-2">
              Tiêu đề bài thi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none transition-all font-medium"
              placeholder="Nhập tên bài thi..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#111518] mb-2">
              Loại bài thi
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "PRACTICE" | "QUIZ",
                })
              }
              className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none transition-all font-medium"
            >
              <option value="PRACTICE">Luyện tập (Practice)</option>
              <option value="QUIZ">Kiểm tra (Quiz)</option>
            </select>
          </div>
        </div>

        <div className="max-w-full">
          <label className="block text-sm font-semibold text-[#111518] mb-2">
            Mô tả ngắn
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none transition-all font-medium"
            placeholder="Nhập mô tả cho sinh viên..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#111518] mb-2">
              Khóa học <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none transition-all font-medium"
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedLessonId("");
                setSelectedLessonItemId("");
              }}
              required
            >
              <option value="">-- Chọn khóa học --</option>
              {courses?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#111518] mb-2">
              Bài học (Module) <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none transition-all font-medium"
              value={selectedLessonId}
              onChange={(e) => {
                setSelectedLessonId(e.target.value);
                setSelectedLessonItemId("");
              }}
              disabled={!selectedCourseId}
              required
            >
              <option value="">-- Chọn bài học --</option>
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#111518] mb-2">
              Nội dung (Quiz) <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none transition-all font-medium"
              value={selectedLessonItemId}
              onChange={(e) => setSelectedLessonItemId(e.target.value)}
              disabled={!selectedLessonId}
              required
            >
              <option value="">-- Chọn nội dung --</option>
              {lessonItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
