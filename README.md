# 🎓 Vietnam Citation Studio

> **Hệ thống tạo & chuẩn hóa Trích dẫn & Danh mục Tài liệu Tham khảo (TLTK) cho Nghiên cứu Khoa học tại Việt Nam**  
> Tuân thủ nghiêm ngặt **Quy định ĐH Huế (Chuẩn APA & IEEE)** và **NXB Đại học Quốc gia Hà Nội (Chuẩn VNU / Bộ GD&ĐT)**.

---

## 🌟 Tính Năng Nổi Bật

1. **Hỗ trợ 3 chuẩn trích dẫn phổ biến nhất tại Việt Nam**:
   - **APA (Đại học Huế)**: Trích dẫn theo kiểu *Tác giả - Năm* (`Tiến, 2010`), quy chuẩn hóa họ tên tác giả Việt Nam (`Châu, N.B.`), sắp xếp A-Z theo tên.
   - **IEEE (Đại học Huế)**: Trích dẫn theo *Số trong ngoặc vuông* (`[1]`), tự động **gộp dải số liên tục** `[2–5]` hoặc số rời rạc `[2, 10]`, định dạng tên tác giả Việt (`N.B. Châu`), hỗ trợ hanging indent chuẩn học thuật.
   - **VNU (NXB ĐHQG Hà Nội / Bộ GD&ĐT)**: Tự động **phân chia danh mục theo từng nhóm ngôn ngữ** (*TÀI LIỆU TIẾNG VIỆT*, *TÀI LIỆU TIẾNG ANH*,...), tác giả Việt giữ nguyên thứ tự họ tên tự nhiên nhưng xếp thứ tự A-Z theo Tên.

2. **Bao phủ 9+ chủng loại tài liệu nghiên cứu**:
   - Sách / Báo cáo kỹ thuật (`Book / Report`)
   - Một chương trong sách có chủ biên (`Book Chapter`)
   - Bài báo khoa học trên tạp chí (`Journal Article`) có DOI, tập, số
   - Bài trong kỷ yếu hội thảo / hội nghị khoa học (`Conference Proceedings`)
   - Luận án tiến sĩ / Luận văn thạc sĩ (`Theses / Dissertations`)
   - Bài viết trên báo chí phổ thông (`Newspaper Article`)
   - Tài liệu trực tuyến / website (`Webpage / Online`)
   - Văn bản quy phạm pháp luật (`Legal Document`)
   - Bản thảo chưa xuất bản (`Manuscript / Forthcoming`)
   - Tài liệu tiếng nước ngoài phi Latinh (Nga, Trung, Nhật, Ả Rập...) với bản dịch tựa đề trong ngoặc vuông `[...]`.

3. **Bộ Tạo Trích Dẫn Thân Bài Tương Tác (In-Text Generator Playground)**:
   - Tự do chọn nhiều nguồn tài liệu để mô phỏng trích dẫn trực tiếp (`tr. 97-98`) hoặc trích dẫn diễn giải.
   - Hỗ trợ cả 2 dạng: *Trong ngoặc đơn* (Parenthetical) và *Dẫn dắt* (Narrative - "Theo Hair và nnk. (1998)...").

4. **Xuất Bản & Chia Sẻ Chuyên Nghiệp**:
   - 1-click **Xuất file Microsoft Word (.doc)** giữ nguyên định dạng in nghiêng, trích dẫn chuẩn và thụt dòng hanging indent.
   - 1-click **Tải file BibTeX (.bib)** cho người dùng LaTeX / Overleaf.
   - Sao chép toàn bộ danh mục dạng Rich Text hoặc Plain Text.
   - Dữ liệu được lưu tự động trên trình duyệt (`LocalStorage`).

5. **Sổ tay quy chuẩn tích hợp**:
   - Tích hợp bảng tóm tắt đối chiếu trực quan quy tắc trích dẫn giữa 3 chuẩn để sinh viên và nhà nghiên cứu tiện tra cứu.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
citation-studio/
├── public/
│   └── favicon.svg              # Icon sách học thuật
├── src/
│   ├── components/              # Các thành phần giao diện (UI Components)
│   │   ├── Navbar.tsx           # Thanh điều hướng, chọn chuẩn, nút hành động
│   │   ├── CitationCard.tsx     # Card hiển thị từng tài liệu, nhãn phân loại, copy nhanh
│   │   ├── CitationFormModal.tsx# Form thêm/sửa động cho 9 loại tài liệu
│   │   ├── InTextGenerator.tsx  # Trình giả lập trích dẫn trong thân bài
│   │   ├── BibliographyView.tsx # Danh mục TLTK hoàn chỉnh (phân nhóm tiếng Việt/Anh)
│   │   └── StyleGuideModal.tsx  # Sổ tay quy chuẩn trích dẫn ĐH Huế & VNU
│   ├── data/
│   │   └── sampleCitations.ts   # Bộ dữ liệu mẫu thực tế trích từ 2 văn bản gốc
│   ├── engines/                 # Bộ quy tắc định dạng (Format Engines)
│   │   ├── apaEngine.ts         # Logic chuẩn APA ĐH Huế
│   │   ├── ieeeEngine.ts        # Logic chuẩn IEEE ĐH Huế & gộp dải số [2-5]
│   │   └── vnuEngine.ts         # Logic chuẩn VNU & phân loại ngôn ngữ
│   ├── types/
│   │   └── citation.ts          # Định nghĩa TypeScript data models
│   ├── utils/
│   │   ├── nameParser.ts        # Nhận diện họ tên người Việt vs Nước ngoài
│   │   └── bibtex.ts            # Chuyển đổi BibTeX
│   ├── App.tsx                  # Ứng dụng chính (State management, tìm kiếm, lọc)
│   ├── index.css                # Tailwind CSS v4 & Academic typography
│   └── main.tsx                 # Điểm khởi chạy React 19
├── index.html                   # HTML template chuẩn SEO & Google Fonts
├── package.json                 # Cấu hình dependencies (React 19, Lucide, Tailwind)
├── tsconfig.json                # Cấu hình TypeScript
├── vercel.json                  # Cấu hình Deploy Vercel (1-Click Deploy)
├── vite.config.ts               # Cấu hình Vite & Tailwind v4
└── README.md                    # Tài liệu hướng dẫn sử dụng & triển khai
```

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local Development)

Yêu cầu máy tính đã cài đặt **Node.js** (khuyến nghị từ Node 18 trở lên).

```bash
# 1. Chuyển vào thư mục dự án
cd citation-studio

# 2. Cài đặt các gói thư viện
npm install

# 3. Khởi chạy máy chủ phát triển
npm run dev
```

Mở trình duyệt truy cập: `http://localhost:5173`.

---

## 🌐 Hướng Dẫn Đẩy Lên GitHub & Deploy Lên Vercel

Dự án đã được cấu hình sẵn file `vercel.json` và file build tương thích 100% với Vercel.

### Cách 1: Kéo thả / Đẩy lên GitHub bằng dòng lệnh

1. Tạo một repository mới trên GitHub (ví dụ đặt tên: `vietnam-citation-studio`).
2. Mở terminal tại thư mục `citation-studio` và chạy:

```bash
git init
git add .
git commit -m "feat: initial commit for Vietnam Citation Studio"
git branch -M main
git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git
git push -u origin main
```

*(Lưu ý: Thư mục `node_modules` và `dist` đã được cấu hình trong `.gitignore` nên khi đẩy lên sẽ cực kỳ gọn nhẹ).*

### Cách 2: Triển khai trực tiếp lên Vercel trong 1 phút

1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Chọn **"Add New..."** -> **"Project"**.
3. Chọn repository GitHub bạn vừa tạo ở trên và bấm **Import**.
4. Vercel sẽ tự động phát hiện framework là **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Nhấn **Deploy**. Chỉ sau khoảng 30 giây, dự án của bạn sẽ online với một đường link HTTPS miễn phí dạng `https://ten-du-an.vercel.app`!
