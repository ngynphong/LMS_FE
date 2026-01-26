interface CourseBuilderSidebarProps {
  lessonType?: 'video' | 'document' | 'quiz' | null;
}

const CourseBuilderSidebar = ({ lessonType }: CourseBuilderSidebarProps) => {
  if (!lessonType) {
    return (
      <aside className="w-80 bg-white border-l border-slate-200 fixed right-0 h-full overflow-y-auto">
        <div className="p-6 h-full flex flex-col items-center justify-center text-center">
          <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-slate-400">touch_app</span>
          </div>
          <h3 className="text-[#101518] font-bold mb-2">Chọn một bài học</h3>
          <p className="text-[#5e7b8d] text-sm">
            Nhấp vào một bài học để xem và chỉnh sửa cài đặt
          </p>
        </div>
      </aside>
    );
  }

  if (lessonType === 'quiz') {
    return (
      <aside className="w-80 bg-white border-l border-slate-200 fixed right-0 h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-[#0074bd]">tune</span>
            <h2 className="text-[#101518] text-lg font-bold">Cài đặt bài kiểm tra</h2>
          </div>

          <div className="space-y-6">
            {/* Quiz Title */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Tiêu đề bài kiểm tra</label>
              <input
                type="text"
                defaultValue="HTML Elements"
                className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
              />
            </div>

            {/* Time & Pass Score */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Thời gian (phút)</label>
                <input
                  type="number"
                  defaultValue={15}
                  className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Điểm chuẩn (%)</label>
                <input
                  type="number"
                  defaultValue={80}
                  className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
                />
              </div>
            </div>

            {/* Question Bank */}
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
              <label className="text-sm font-semibold text-slate-700">Ngân hàng câu hỏi</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border-slate-200 text-sm py-2.5 pl-3 pr-10 focus:ring-[#0074bd] focus:border-[#0074bd]">
                  <option>Nhập môn Web (50 câu)</option>
                  <option>HTML/CSS Cơ bản (120 câu)</option>
                  <option>Javascript nâng cao (80 câu)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
              <p className="text-[11px] text-[#5e7b8d] italic mt-1">
                * Hệ thống sẽ tự động chọn câu hỏi ngẫu nhiên từ ngân hàng đã chọn.
              </p>
            </div>

            {/* Question Count */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700">Số lượng câu hỏi</span>
                <span className="text-xs font-bold bg-[#0074bd]/10 text-[#0074bd] px-2 py-0.5 rounded">
                  10 câu
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                defaultValue={10}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0074bd]"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-6">
              <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#0074bd]/10 text-[#0074bd] text-sm font-bold hover:bg-[#0074bd]/20 transition-all">
                <span className="material-symbols-outlined text-sm">visibility</span>
                Xem trước bộ đề
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-all">
                Hủy thay đổi
              </button>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="absolute bottom-0 w-full p-6 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">Trạng thái</span>
            <span className="flex items-center gap-1.5 text-amber-500 font-bold text-xs uppercase tracking-wider">
              <span className="size-2 bg-amber-500 rounded-full animate-pulse"></span>
              Bản nháp
            </span>
          </div>
          <button className="w-full py-3 rounded-lg bg-[#0074bd] text-white font-bold shadow-lg shadow-[#0074bd]/20 hover:scale-[1.02] active:scale-95 transition-all">
            Cập nhật cài đặt
          </button>
        </div>
      </aside>
    );
  }

  // Video or Document settings
  return (
    <aside className="w-80 bg-white border-l border-slate-200 fixed right-0 h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-[#0074bd]">tune</span>
          <h2 className="text-[#101518] text-lg font-bold">
            Cài đặt {lessonType === 'video' ? 'Video' : 'Tài liệu'}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Tiêu đề bài học</label>
            <input
              type="text"
              defaultValue="Lộ trình trở thành Fullstack Developer"
              className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Mô tả</label>
            <textarea
              rows={4}
              placeholder="Nhập mô tả cho bài học..."
              className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd] resize-none"
            />
          </div>

          {lessonType === 'video' && (
            <>
              {/* Video Upload */}
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                <label className="text-sm font-semibold text-slate-700">Video</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-[#0074bd] transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">cloud_upload</span>
                  <p className="text-sm text-slate-600">Kéo thả hoặc nhấp để tải lên</p>
                  <p className="text-xs text-slate-400 mt-1">MP4, WebM (tối đa 500MB)</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Thời lượng</label>
                <input
                  type="text"
                  defaultValue="12:45"
                  className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
                  placeholder="Tự động phát hiện khi tải video"
                />
              </div>
            </>
          )}

          {lessonType === 'document' && (
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
              <label className="text-sm font-semibold text-slate-700">Tài liệu</label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-[#0074bd] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">upload_file</span>
                <p className="text-sm text-slate-600">Kéo thả hoặc nhấp để tải lên</p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOCX (tối đa 50MB)</p>
              </div>
            </div>
          )}

          {/* Preview Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-700">Cho phép xem trước</p>
              <p className="text-xs text-slate-500">Học viên chưa đăng ký có thể xem</p>
            </div>
            <button className="relative w-11 h-6 bg-slate-200 rounded-full transition-colors">
              <span className="absolute left-1 top-1 size-4 bg-white rounded-full shadow transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Footer */}
      <div className="absolute bottom-0 w-full p-6 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-500">Trạng thái</span>
          <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs uppercase tracking-wider">
            <span className="size-2 bg-green-500 rounded-full"></span>
            Hoàn tất
          </span>
        </div>
        <button className="w-full py-3 rounded-lg bg-[#0074bd] text-white font-bold shadow-lg shadow-[#0074bd]/20 hover:scale-[1.02] active:scale-95 transition-all">
          Lưu thay đổi
        </button>
      </div>
    </aside>
  );
};

export default CourseBuilderSidebar;
