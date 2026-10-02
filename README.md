# 🎓 TRÍCH DẪN TỰ ĐỘNG (Automatic Citation Generator)

> **Hệ thống tạo & chuẩn hóa Trích dẫn & Danh mục Tài liệu Tham khảo (TLTK) tự động cho Nghiên cứu Khoa học tại Việt Nam**  
> Tuân thủ các quy chuẩn học thuật: **Chuẩn APA**, **Chuẩn IEEE**, **Chuẩn VNU (ĐHQG Hà Nội)** và **Chuẩn VNUA (Quyết định số 491/QĐ-HVN ngày 21/02/2020)**.

---

## 🚀 Bản Chất & Triết Lý Sản Phẩm

Đây là một **Website Trích dẫn Tài liệu Tham khảo Tự động** hoạt động theo mô hình phiên tạm thời:
- **Dán URL / DOI**: Tự động bóc tách siêu dữ liệu học thuật (JSON-LD, Citation Meta Tags, Dublin Core, OpenGraph, Crossref).
- **Kiểm tra & Chỉnh sửa**: Người dùng rà soát và chỉnh sửa thông tin trực tiếp trước khi định dạng.
- **Hỗ trợ 11 trường thông tin**: Có thể nhập thủ công linh hoạt bất kỳ khi nào cần.
- **Bảo mật & Quyền riêng tư tuyệt đối**: **KHÔNG** lưu trữ thông tin người dùng vào `localStorage`, `sessionStorage`, `IndexedDB`, hay cơ sở dữ liệu vĩnh viễn.
- **Cơ chế tự hủy (TTL 15 phút = 900 giây)**: Mọi dữ liệu trích dẫn chỉ tồn tại tạm thời trong bộ nhớ phiên làm việc (in-memory) và sẽ tự động xóa sạch khi hết hạn.

---

## 🌟 Tính Năng Nổi Bật

### 1. Phân Tích & Bóc Tách Siêu Dữ Liệu Tự Động (URL / DOI)
- **Hỗ trợ DOI**: Tự động phân giải qua Crossref API (`https://api.crossref.org/works/...`), bóc tách tác giả, tạp chí, số, tập, trang, năm xuất bản, nhà xuất bản.
- **Hỗ trợ URL bài báo & trang web**: Tự động trích xuất theo thứ tự ưu tiên chuẩn học thuật:
  1. `JSON-LD` (`schema.org/ScholarlyArticle`, `TechArticle`, ...)
  2. `citation_*` meta tags (Google Scholar, Highwire Press)
  3. `Dublin Core` (`dc.title`, `dc.creator`, `dc.date`, ...)
  4. `OpenGraph` & `HTML title`
- **Không tự bịa dữ liệu**: Trường nào không xác định được sẽ để trống để người dùng xác nhận hoặc bổ sung.
- **Bảo vệ an toàn mạng (SSRF Protection)**: Chặn truy cập localhost, IP nội bộ (`127.0.0.1`, `10.x`, `192.168.x`, `172.16-31.x`), địa chỉ link-local (`169.254.x`), endpoint metadata của Cloud, giới hạn kích thước gói tin và timeout an toàn.

### 2. Bốn Chuẩn Trích Dẫn Học Thuật Chuẩn Xác

1. **Chuẩn APA**:
   - Trích dẫn trong bài: `(Tác giả, Năm)` hoặc `(Tác giả 1 & Tác giả 2, Năm)`, 3 tác giả trở lên dùng `(Tác giả 1 et al., Năm)`.
   - Danh mục TLTK: Sắp xếp chữ cái A-Z theo họ tác giả, định dạng thụt dòng dòng thứ 2 (hanging indent), in nghiêng tên sách/tên tạp chí và tập.
2. **Chuẩn IEEE**:
   - Trích dẫn trong bài: Dạng số trong ngoặc vuông `[1]`, `[2]`.
   - **Tự động gộp dải số liên tục**: Ví dụ trích dẫn nhiều nguồn tự động gom thành `[2–5]` thay vì `[2, 3, 4, 5]`, số rời rạc thành `[2, 5, 8]`.
   - Tác giả nước ngoài dạng viết tắt tên trước họ: `J. K. Smith`, danh mục đánh số thứ tự `[1]`, `[2]`.
3. **Chuẩn VNU (NXB Đại học Quốc gia Hà Nội)**:
   - Dòng trích dẫn tham khảo chuẩn:
     > *"Tham khảo Lưu Thế Anh (ch.b.), Võ Thanh Sơn, Lê Thị Vân Huệ, Bùi Ngọc Quý, Phương pháp luận nghiên cứu khoa học trong môi trường và phát triển bền vững, Nxb. Đại học Quốc gia Hà Nội, 2025, 492 tr."*
   - Tự động phân chia danh mục thành **TÀI LIỆU TIẾNG VIỆT** và **TÀI LIỆU TIẾNG ANH / NƯỚC NGOÀI**.
   - Tác giả Việt Nam giữ nguyên thứ tự họ tên tự nhiên, tác giả chủ biên ghi thêm `(ch.b.)`.
4. **Chuẩn VNUA (Học viện Nông nghiệp Việt Nam - QĐ số 491/QĐ-HVN)**:
   - Ban hành ngày 21/02/2020 với quy định chi tiết cho **11 loại tài liệu tham khảo**:
     1. Bài báo trên tạp chí in
     2. Bài báo trên tạp chí điện tử (có DOI hoặc URL)
     3. Sách / giáo trình xuất bản
     4. Chương trong sách có chủ biên (ch.b.)
     5. Kỷ yếu hội nghị / hội thảo khoa học
     6. Luận văn thạc sĩ / luận án tiến sĩ
     7. Báo cáo kỹ thuật / đề tài nghiên cứu nghiệm thu
     8. Văn bản quy phạm pháp luật / tiêu chuẩn kỹ thuật
     9. Tài liệu từ website / internet
     10. Bằng sáng chế (Patent)
     11. Dữ liệu số / phần mềm nghiên cứu
   - Quy tắc tác giả VNUA:
     - Trích dẫn trong bài: 1 tác giả (`Nguyễn Văn A, 2020` hoặc `Smith, 2020`); 2 tác giả nối bằng ký tự `&` (`Nguyễn Văn A & Trần Văn B, 2021`); 3 tác giả trở lên dùng `và cs.` (tiếng Việt) hoặc `et al.` (tiếng Anh).
     - Danh mục TLTK: Liệt kê đầy đủ tất cả tác giả (không dùng *và cs.*), nối tác giả cuối bằng `&`. Tác giả nước ngoài viết dạng `Họ Tên.Đệm.` (ví dụ: `Li H.`, `Goodpaster K. E.`). Tên tạp chí viết đầy đủ không viết tắt.

### 3. Giao Diện & Trải Nghiệm Tinh Tế (Theo Mô tả.pdf)
- Kiểu chữ học thuật thanh thoát: **Font Arsenal** (Google Fonts).
- Hệ màu chủ đạo hiện đại: `#dcfdc3` (xanh nhạt), `#3a8080` (xanh mòng két học thuật), `#1b2835` (xanh than trầm), footer chuyển sắc `#518281`, `#2b7a70`, `#0f4b4f`, `#000000`.
- Bo góc hiện đại `rounded-[10px]`.
- Đồng hồ đếm ngược thời gian phiên làm việc (15:00 → 00:00).
- Chức năng **Sao chép Text**, **Sao chép Định dạng (HTML/Word)**, và **Xuất file Word (.doc)** giữ trọn vẹn kiểu chữ in nghiêng và thụt dòng học thuật (hanging indent).
- **Sổ tay tra cứu quy cách trích dẫn**: Hiển thị bảng đối chiếu trực quan 4 chuẩn.
- **Khu vực Quản trị (Admin Modal)**: Cho phép mở rộng và định nghĩa thêm chuẩn trích dẫn tùy biến mới.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
citation-studio/
├── api/
│   └── fetch-metadata.ts        # Serverless API fetch URL an toàn (SSRF protected) cho Vercel
├── public/
│   └── favicon.svg              # Logo trích dẫn
├── src/
│   ├── components/              # Các thành phần giao diện (UI)
│   │   ├── AboutModal.tsx       # Giới thiệu hệ thống & chính sách bảo mật
│   │   ├── AdminModal.tsx       # Modal quản trị: Thêm quy cách trích dẫn mới
│   │   ├── CitationResult.tsx   # Hiển thị trích dẫn trong bài & tài liệu tham khảo
│   │   ├── Footer.tsx           # Chân trang chuẩn màu sắc & thông tin liên hệ tác giả
│   │   ├── ManualForm.tsx       # Form nhập liệu thủ công với 11 trường thông tin
│   │   ├── MetadataPreview.tsx  # Xem lại & chỉnh sửa siêu dữ liệu bóc tách được
│   │   ├── Navbar.tsx           # Thanh điều hướng, đếm ngược TTL 15 phút, menu
│   │   ├── SessionList.tsx      # Danh sách trích dẫn tạm thời trong phiên làm việc
│   │   ├── StyleGuideView.tsx   # Sổ tay tra cứu hướng dẫn chi tiết 4 chuẩn
│   │   ├── StyleSelector.tsx    # Thanh chuyển đổi nhanh giữa 4 chuẩn trích dẫn
│   │   └── UrlDoiInput.tsx      # Khung dán URL/DOI với hiệu ứng phân tích tự động
│   ├── engines/                 # Bộ sinh trích dẫn độc lập (Citation Engines)
│   │   ├── apaEngine.ts         # Chuẩn APA
│   │   ├── ieeeEngine.ts        # Chuẩn IEEE (gộp dải số [2-5])
│   │   ├── styleRegistry.ts     # Bộ điều phối & đăng ký phong cách trích dẫn
│   │   ├── vnuHanoiEngine.ts    # Chuẩn VNU ĐHQG Hà Nội (Lưu Thế Anh ch.b.)
│   │   └── vnuaEngine.ts        # Chuẩn VNUA (QĐ 491/QĐ-HVN - 11 loại tài liệu)
│   ├── types/
│   │   └── citation.ts          # Định nghĩa TypeScript data models & CitationItem
│   ├── utils/
│   │   ├── doiResolver.ts       # Phân giải DOI qua Crossref REST API
│   │   ├── htmlMetadataParser.ts# Bóc tách JSON-LD, citation_*, DC, OpenGraph
│   │   ├── metadataFetcher.ts   # Điều phối đọc URL/DOI qua proxy an toàn
│   │   ├── nameParser.ts        # Xử lý tên tiếng Việt, tác giả nước ngoài, tổ chức
│   │   ├── ssrfProtection.ts    # Kiểm tra & chặn SSRF (Private IP, Localhost)
│   │   └── useSessionTtl.ts     # Quản lý vòng đời dữ liệu 15 phút trong React state
│   ├── App.tsx                  # Luồng xử lý chính: Input -> Preview -> Result
│   ├── index.css                # Tùy biến Tailwind, font Arsenal, academic hanging indent
│   └── main.tsx                 # Điểm khởi chạy React 19
├── index.html                   # HTML template nạp Google Fonts Arsenal
├── package.json                 # Cấu hình dự án (React 19, Lucide, Tailwind v4)
├── tsconfig.json                # Cấu hình TypeScript nghiêm ngặt
├── vercel.json                  # Cấu hình định tuyến Serverless Functions trên Vercel
├── vite.config.ts               # Cấu hình Vite & Dev Server proxy
└── README.md                    # Tài liệu kỹ thuật dự án
```

---

## 🛠️ Hướng Dẫn Chạy Cục Bộ (Local Development)

Yêu cầu máy tính đã cài đặt **Node.js** (từ phiên bản 18 trở lên).

```bash
# 1. Chuyển vào thư mục dự án
cd citation-studio

# 2. Cài đặt các dependencies
npm install

# 3. Khởi chạy máy chủ phát triển Vite
npm run dev
```

Mở trình duyệt truy cập: `http://localhost:5173`.  
*(Vite Dev Server đã tích hợp sẵn proxy `/api/fetch-metadata` giả lập serverless function an toàn để đọc link bên ngoài mà không bị lỗi CORS).*

---

## 🌐 Hướng Dẫn Triển Khai Lên Vercel (1-Click Deployment)

Dự án đã được cấu hình tối ưu sẵn sàng deploy ngay lên Vercel:

### Cách 1: Đẩy mã nguồn lên GitHub rồi liên kết Vercel
1. Đẩy toàn bộ thư mục `citation-studio` lên một repository mới trên GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete automatic citation generator"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Truy cập [Vercel Dashboard](https://vercel.com/new).
3. Chọn Import Repository vừa tạo.
4. Giữ nguyên cấu hình mặc định (Framework Preset: **Vite**).
5. Nhấn **Deploy**. Vercel sẽ tự động build frontend và kích hoạt Serverless API `/api/fetch-metadata` hoàn chỉnh!

### Cách 2: Triển khai bằng Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 🔒 Cam Kết Bảo Mật & Quyền Riêng Tư (Privacy by Design)

- **Zero Persistent Data**: Không bao giờ ghi dữ liệu người dùng vào ổ cứng hay trình duyệt qua LocalStorage, IndexedDB hoặc Cookies.
- **Tự hủy 15 phút**: Mọi tài liệu và kết quả trích dẫn được lưu trữ tạm thời trong RAM của phiên trình duyệt. Sau 15 phút không thao tác, hệ thống kích hoạt xóa sạch bộ nhớ và đưa ra thông báo:  
  *“Phiên trích dẫn đã hết hạn. Dữ liệu tạm thời đã được xóa.”*
- **SSRF Defense**: Mọi URL bên ngoài được kiểm duyệt IP nghiêm ngặt nhằm bảo vệ hạ tầng máy chủ khỏi các cuộc tấn công rà quét mạng nội bộ.

---

## 📬 Liên Hệ Tác Giả

- **Tác giả**: Anh Duy
- **Email**: `duyanhdoan012@gmail.com`
- **LinkedIn**: [Anh Duy trên LinkedIn](https://www.linkedin.com/in/anh-duy-401418316/)
