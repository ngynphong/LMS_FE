// src/data/faqData.ts
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    "id": "faq-1",
    "question": "Làm sao để em bắt đầu học máy tính IC3?",
    "answer": "Rất đơn giản! Em hãy nhờ Bố Mẹ tạo giúp một tài khoản nhé. Sau khi đăng nhập, em chỉ cần chọn khóa học IC3 và nhấn 'Vào học ngay'. Khóa học sẽ nằm sẵn trong chiếc cặp 'Khóa học của em' để em có thể bắt đầu khám phá thế giới máy tính bất cứ lúc nào!"
  },
  {
    "id": "faq-2",
    "question": "Em có thể xem lại bài giảng nếu lỡ quên không?",
    "answer": "Chắc chắn rồi! Bài giảng của các thầy cô luôn mở sẵn ở đó. Em có thể xem đi xem lại bao nhiêu lần cũng được để nhớ bài thật kỹ. Hệ thống không bao giờ khóa bài học của em, nên em cứ thoải mái ôn tập nhé!"
  },
  {
    "id": "faq-3",
    "question": "Khi xem video mà không hiểu bài, em phải hỏi ai?",
    "answer": "Đừng lo lắng! Ngay bên dưới mỗi video đều có mục 'Hỏi đáp', em chỉ cần gõ thắc mắc của mình vào đó, các thầy cô sẽ vào trả lời em ngay. Đặc biệt, hệ thống còn có một 'Người bạn Robot AI' siêu thông minh, luôn túc trực để giải đáp và gợi ý bài tập cho em ngay lập tức đấy!"
  },
  {
    "id": "faq-4",
    "question": "Chính sách học thử dành cho Bố Mẹ như thế nào?",
    "answer": "(Dành cho Phụ huynh) Bố mẹ hoàn toàn yên tâm nhé! Hệ thống hỗ trợ hoàn tiền 100% trong vòng 7 ngày đầu tiên nếu bé cảm thấy chưa phù hợp với phương pháp học. Điều kiện áp dụng là bé chưa học quá 20% video bài giảng và chưa thi bài trắc nghiệm cuối khóa. Bố mẹ chỉ cần liên hệ bộ phận hỗ trợ, yêu cầu sẽ được xử lý rất nhanh chóng."
  }
];