// src/data/faqData.ts
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "Làm thế nào để đăng ký khóa học trên hệ thống?",
    answer: "Để đăng ký khóa học, trước tiên bạn cần tạo một tài khoản học viên miễn phí. Sau khi đăng nhập thành công, hãy truy cập vào trang 'Danh sách khóa học', tìm kiếm và chọn khóa học phù hợp với nhu cầu của bạn. Nhấn vào nút 'Đăng ký ngay' hoặc 'Tham gia' và làm theo các bước thanh toán (nếu có). Ngay sau khi hoàn tất, khóa học sẽ xuất hiện trong phần 'Khóa học của tôi' và bạn có thể bắt đầu quá trình học ngay lập tức."
  },
  {
    id: "faq-2",
    question: "Khóa học có bị giới hạn thời gian truy cập không?",
    answer: "Không! Tất cả các khóa học bạn đã kích hoạt và đăng ký thành công đều có giá trị truy cập trọn đời. Bạn có thể học vào bất kỳ thời gian nào, xem đi xem lại bài giảng bao nhiêu lần tùy thích để ôn tập kiến thức mà không phải chịu thêm bất kỳ khoản phí gia hạn nào. Hệ thống trực tuyến luôn sẵn sàng 24/7 để phục vụ lộ trình học tập của riêng bạn."
  },
  {
    id: "faq-3",
    question: "Hệ thống có hỗ trợ giải đáp thắc mắc trong quá trình học không?",
    answer: "Chắc chắn rồi. Hệ thống có đội ngũ trợ giảng (Teaching Assistants) và giảng viên luôn sẵn sàng giải đáp thắc mắc của bạn qua diễn đàn nội bộ hoặc khung chat. Ngoài ra, chúng tôi đã tích hợp trợ lý ảo AI (Chatbot) thông minh giúp phân tích, gợi ý và trả lời những câu hỏi thường gặp hoặc cung cấp tài liệu tham khảo ngay lập tức trong quá trình bạn xem video bài giảng."
  },
  {
    id: "faq-4",
    question: "Chính sách học thử và hoàn tiền hoạt động như thế nào?",
    answer: "Chúng tôi mang đến chính sách hoàn tiền 100% trong vòng 7 ngày đầu tiên kể từ khi đăng ký nếu bạn cảm thấy khóa học không phù hợp. Tuy nhiên, điều kiện áp dụng là bạn chưa hoàn thành quá 20% thời lượng nội dung khóa học và chưa thi bài trắc nghiệm cuối khóa. Bạn chỉ cần liên hệ với bộ phận hỗ trợ khách hàng kèm theo mã đơn hàng, mọi yêu cầu sẽ được xử lý trong vòng 3 ngày làm việc."
  }
];