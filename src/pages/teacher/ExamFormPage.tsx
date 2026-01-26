import { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const ExamFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: isEditMode ? 'Kiểm tra cuối kỳ Lập trình Web' : '',
    description: isEditMode ? 'Bài thi đánh giá kiến thức về HTML, CSS và JavaScript nâng cao.' : '',
    startDate: '',
    endDate: '',
    duration: 60,
    maxAttempts: 1,
    passingScore: 50,
    shuffleQuestions: true
  });

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);

  // Validation errors
  const dateErrors = useMemo(() => {
    const errors: { startDate?: string; endDate?: string } = {};
    
    if (formData.startDate && formData.startDate < today) {
      errors.startDate = 'Ngày bắt đầu không thể là ngày trong quá khứ';
    }
    
    if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
      errors.endDate = 'Ngày kết thúc không thể trước ngày bắt đầu';
    }
    
    return errors;
  }, [formData.startDate, formData.endDate, today]);

  const hasErrors = Object.keys(dateErrors).length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasErrors) {
      alert('Vui lòng sửa các lỗi trước khi lưu');
      return;
    }
    
    // TODO: API call to save exam
    console.log('Saving exam:', formData);
    navigate('/teacher/exams');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium">
        <Link to="/teacher/exams" className="text-slate-500 hover:text-[#0074bd] transition-colors">Đề thi</Link>
        <span className="text-slate-400">/</span>
        <span className="text-[#111518]">{isEditMode ? 'Chỉnh sửa' : 'Tạo mới'}</span>
      </nav>

      {/* Page Heading */}
      <div>
        <h2 className="text-3xl font-black text-[#111518] tracking-tight">
          {isEditMode ? 'Chỉnh sửa đề thi' : 'Thiết lập bài thi'}
        </h2>
        <p className="text-slate-500 mt-2">Cấu hình các thông số và câu hỏi cho bài kiểm tra của bạn.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Thông tin chung */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-[#111518]">Thông tin chung</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="max-w-2xl">
              <label className="block text-sm font-semibold text-[#111518] mb-2">
                Tiêu đề bài thi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#0074bd]/20 focus:border-[#0074bd] outline-none transition-all"
                placeholder="Nhập tên bài thi..."
                required
              />
            </div>
            <div className="max-w-2xl">
              <label className="block text-sm font-semibold text-[#111518] mb-2">Mô tả ngắn</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 focus:ring-2 focus:ring-[#0074bd]/20 focus:border-[#0074bd] outline-none transition-all"
                placeholder="Nhập mô tả cho sinh viên..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Cấu hình thời gian */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-[#111518]">Cấu hình thời gian</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#111518] mb-2">
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.startDate}
                    min={today}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={`w-full h-12 rounded-lg border bg-white px-4 pr-10 focus:ring-2 focus:ring-[#0074bd]/20 focus:border-[#0074bd] outline-none ${
                      dateErrors.startDate ? 'border-red-500' : 'border-slate-200'
                    }`}
                    required
                  />
                </div>
                {dateErrors.startDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {dateErrors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111518] mb-2">
                  Ngày kết thúc <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.endDate}
                    min={formData.startDate || today}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={`w-full h-12 rounded-lg border bg-white px-4 pr-10 focus:ring-2 focus:ring-[#0074bd]/20 focus:border-[#0074bd] outline-none ${
                      dateErrors.endDate ? 'border-red-500' : 'border-slate-200'
                    }`}
                    required
                  />
                </div>
                {dateErrors.endDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {dateErrors.endDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111518] mb-2">Thời gian làm bài (phút)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#0074bd]/20 focus:border-[#0074bd] outline-none"
                  placeholder="60"
                  min={1}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Quy tắc làm bài */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-[#111518]">Quy tắc làm bài</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111518] mb-2">Số lần thử tối đa</label>
                  <select
                    value={formData.maxAttempts}
                    onChange={(e) => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) })}
                    className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#0074bd]/20 focus:border-[#0074bd] outline-none appearance-none"
                  >
                    <option value={1}>1 lần</option>
                    <option value={2}>2 lần</option>
                    <option value={3}>3 lần</option>
                    <option value={-1}>Không giới hạn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111518] mb-2">Điểm chuẩn để đạt (%)</label>
                  <input
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                    className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#0074bd]/20 focus:border-[#0074bd] outline-none"
                    min={0}
                    max={100}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-bold text-[#111518]">Xáo trộn câu hỏi</p>
                    <p className="text-xs text-slate-500 mt-1">Thay đổi thứ tự hiển thị câu hỏi cho mỗi sinh viên</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shuffleQuestions}
                      onChange={(e) => setFormData({ ...formData, shuffleQuestions: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0074bd]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Chọn câu hỏi */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#111518]">Chọn câu hỏi</h3>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center py-10">
            <div className="bg-[#0074bd]/10 rounded-full p-4 mb-4">
              <span className="material-symbols-outlined text-[#0074bd] text-3xl">quiz</span>
            </div>
            <p className="text-xl font-bold text-[#111518]">
              Số lượng câu hỏi hiện tại: <span className="text-[#0074bd]">0</span>
            </p>
            <p className="text-slate-500 text-sm mt-2 max-w-sm">
              Bạn có thể thêm câu hỏi trực tiếp hoặc nhập từ ngân hàng câu hỏi có sẵn.
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                to="/teacher/questions"
                className="flex items-center gap-2 px-6 py-3 bg-[#0074bd] hover:bg-[#0074bd]/90 text-white font-bold rounded-lg transition-all shadow-md"
              >
                <span className="material-symbols-outlined">library_add</span>
                Thêm từ ngân hàng câu hỏi
              </Link>
              <Link
                to="/teacher/questions/new"
                className="flex items-center gap-2 px-6 py-3 border border-[#0074bd] text-[#0074bd] hover:bg-[#0074bd]/5 font-bold rounded-lg transition-all"
              >
                <span className="material-symbols-outlined">add</span>
                Tạo câu hỏi mới
              </Link>
            </div>
          </div>
        </div>
      </form>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-slate-200 px-8 py-4 z-20">
        <div className="max-w-5xl mx-auto flex justify-end gap-4">
          <Link
            to="/teacher/exams"
            className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-[#111518] font-bold rounded-lg transition-all"
          >
            Hủy
          </Link>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#0074bd] hover:bg-[#0074bd]/90 text-white font-bold rounded-lg shadow-lg shadow-[#0074bd]/20 transition-all"
          >
            Lưu thiết lập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamFormPage;
