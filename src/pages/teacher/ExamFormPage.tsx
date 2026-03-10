import { Link, useParams } from "react-router-dom";
import { useExamFormLogic } from "@/hooks/useExamFormLogic";
import { FaCircleNotch } from "react-icons/fa";
import Breadcrumb from "@/components/common/Breadcrumb";
import LoadingOverlay from "@/components/common/LoadingOverlay";

// Form Sections
import BasicInfoSection from "@/components/teacher/exams/FormSections/BasicInfoSection";
import SettingsSection from "@/components/teacher/exams/FormSections/SettingsSection";
import DynamicConfigSection from "@/components/teacher/exams/FormSections/DynamicConfigSection";
import StaticQuestionSelectionSection from "@/components/teacher/exams/FormSections/StaticQuestionSelectionSection";

const ExamFormPage = () => {
  const { id } = useParams();
  const logic = useExamFormLogic(id);

  const {
    isEditMode,
    creating,
    updating,
    quizLoading,
    formData,
    setFormData,
    selectedCourseId,
    setSelectedCourseId,
    selectedLessonId,
    setSelectedLessonId,
    selectedLessonItemId,
    setSelectedLessonItemId,
    dynamicConfigs,
    setDynamicConfigs,
    staticQuestions,
    toggleStaticQuestion,
    handleSelectAllDisplayed,
    updateStaticQuestion,
    moveQuestion,
    handleSubmit,
    questionContentCache,
    questionSearch,
    setQuestionSearch,
    qPage,
    setQPage,
    qPageSize,
    setQPageSize,
    qLessonName,
    setQLessonName,
    myLessonNames,
    availableQuestions,
    loadingQuestions,
    fetchingQuestions,
    qTotalPages,
    courses,
    lessons,
    lessonItems,
  } = logic;

  return (
    <div className="space-y-6 pb-24">
      <LoadingOverlay
        isLoading={creating || updating || quizLoading}
        message={isEditMode ? "Đang cập nhật..." : "Đang tạo bài thi..."}
      />

      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: "Đề thi", url: "/teacher/quizzes" },
          { label: isEditMode ? "Chỉnh sửa" : "Tạo mới" },
        ]}
        className="flex items-center gap-2 text-sm font-medium"
        itemClassName="text-slate-500 hover:text-[#0074bd] transition-colors"
        activeItemClassName="text-[#111518]"
        separator={<span className="text-slate-400">/</span>}
      />

      {/* Page Heading */}
      <div>
        <h2 className="text-3xl font-black text-[#111518] tracking-tight">
          {isEditMode ? "Chỉnh sửa đề thi" : "Thiết lập bài thi"}
        </h2>
        <p className="text-slate-500 mt-2 font-medium">
          Cấu hình các thông số và câu hỏi cho bài kiểm tra của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Thông tin chung */}
        <BasicInfoSection
          formData={formData}
          setFormData={setFormData}
          courses={courses}
          selectedCourseId={selectedCourseId}
          setSelectedCourseId={setSelectedCourseId}
          lessons={lessons}
          selectedLessonId={selectedLessonId}
          setSelectedLessonId={setSelectedLessonId}
          lessonItems={lessonItems}
          selectedLessonItemId={selectedLessonItemId}
          setSelectedLessonItemId={setSelectedLessonItemId}
        />

        {/* Section 2: Cấu hình */}
        <SettingsSection formData={formData} setFormData={setFormData} />

        {/* Section 3: Chọn câu hỏi */}
        {formData.isDynamic ? (
          <DynamicConfigSection
            isEditMode={isEditMode}
            isDynamic={formData.isDynamic}
            setIsDynamic={(val) => setFormData({ ...formData, isDynamic: val })}
            dynamicConfigs={dynamicConfigs}
            setDynamicConfigs={setDynamicConfigs}
            lessons={lessons}
            selectedLessonId={selectedLessonId}
          />
        ) : (
          <StaticQuestionSelectionSection
            isEditMode={isEditMode}
            isDynamic={formData.isDynamic}
            setIsDynamic={(val) => setFormData({ ...formData, isDynamic: val })}
            questionSearch={questionSearch}
            setQuestionSearch={setQuestionSearch}
            qLessonName={qLessonName}
            setQLessonName={setQLessonName}
            myLessonNames={myLessonNames}
            qPage={qPage}
            setQPage={setQPage}
            qPageSize={qPageSize}
            setQPageSize={setQPageSize}
            qTotalPages={qTotalPages}
            availableQuestions={availableQuestions}
            loadingQuestions={loadingQuestions}
            fetchingQuestions={fetchingQuestions}
            staticQuestions={staticQuestions}
            toggleStaticQuestion={toggleStaticQuestion}
            handleSelectAllDisplayed={handleSelectAllDisplayed}
            moveQuestion={moveQuestion}
            updateStaticQuestion={updateStaticQuestion}
            questionContentCache={questionContentCache}
          />
        )}
      </form>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-0 left-64 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 px-8 py-4 z-20 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="max-w-5xl mx-auto flex justify-end gap-4">
          <Link
            to="/teacher/quizzes"
            className="px-6 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={creating || updating}
            className="px-8 py-2.5 rounded-xl bg-[#1E90FF] text-white font-black hover:bg-[#0074bd] transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {creating || updating ? (
              <span className="animate-spin text-xl">
                <FaCircleNotch />
              </span>
            ) : (
              <span className="material-symbols-outlined text-xl">save</span>
            )}
            {isEditMode ? "Lưu thay đổi" : "Tạo đề thi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamFormPage;
