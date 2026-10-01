import type { CitationItem } from '../types/citation';
import { parseAuthorName } from '../utils/nameParser';

export const SAMPLE_CITATIONS: CitationItem[] = [
  {
    id: 'hue-1',
    type: 'legal',
    title: 'Danh mục bổ sung giống vật nuôi được phép sản xuất, kinh doanh tại Việt Nam',
    documentNumber: 'Thông tư số 18/2014/TT-BNNPTNT',
    pubDateExact: '23/6/2014',
    issuingAuthority: 'Bộ Nông nghiệp và Phát triển Nông thôn',
    authors: [parseAuthorName('Bộ Nông nghiệp và Phát triển Nông thôn', true)],
    year: 2014,
    language: 'vi'
  },
  {
    id: 'hue-2',
    type: 'journal',
    title: 'Copper toxicity, oxidative stress, and antioxidant nutrients',
    authors: [
      parseAuthorName('Gaetke, L.M.', false, false),
      parseAuthorName('Chow, C.K.', false, false)
    ],
    year: 2003,
    journalName: 'Toxicology',
    volume: '189',
    issue: '1–2',
    pages: '147–163',
    doi: '10.1016/S0300-483X(03)00159-8',
    language: 'en'
  },
  {
    id: 'hue-3',
    type: 'journal',
    title: 'Nhận thức của du khách về hình ảnh điểm đến du lịch Huế',
    authors: [
      parseAuthorName('Nguyễn Thị Lan Hương', false, true),
      parseAuthorName('Trần Trọng Quân', false, true)
    ],
    year: 2017,
    journalName: 'Tạp chí Khoa học Đại học Huế: Kinh tế và Phát triển',
    volume: '126',
    issue: '5D',
    pages: '79–94',
    doi: '10.26459/hueuni-jed.v126i5D.4555',
    language: 'vi'
  },
  {
    id: 'hue-4',
    type: 'journal',
    title: 'Đánh giá của du khách về du lịch lễ hội tổ chức tại chùa ở Thừa Thiên Huế',
    authors: [
      parseAuthorName('Lê Thị Kim Liên', false, true),
      parseAuthorName('Trần Thị Thu Thủy', false, true),
      parseAuthorName('Quách Bá Chính', false, true),
      parseAuthorName('Trần Như Quyền', false, true)
    ],
    year: 2015,
    journalName: 'Tạp chí Khoa học Đại học Huế',
    volume: '109',
    issue: '10',
    pages: '191–202',
    language: 'vi'
  },
  {
    id: 'hue-5',
    type: 'conference',
    title: 'Tính toán mức phát thải nhà kính của chính quyền thành phố Huế bằng công cụ Bilan Carbone',
    authors: [
      parseAuthorName('Phạm Khắc Liệu', false, true),
      parseAuthorName('Trần Anh Tuấn', false, true)
    ],
    year: 2011,
    conferenceName: 'Kỷ yếu Hội thảo Khoa học Quốc gia Đất ngập nước và Biến đổi khí hậu, Hà Nội, 2011',
    publisher: 'Nxb Khoa học và Kỹ thuật',
    place: 'Hà Nội',
    pages: '343-356',
    language: 'vi'
  },
  {
    id: 'hue-6',
    type: 'book',
    title: 'Ngoại giao Cộng hòa Nhân dân Trung Hoa 30 năm cải cách mở cửa (1978-2008)',
    authors: [
      parseAuthorName('Lương Văn Mỹ', false, true)
    ],
    year: 2007,
    publisher: 'Nxb Khoa học Xã hội',
    place: 'Hà Nội',
    language: 'vi'
  },
  {
    id: 'hue-7',
    type: 'thesis',
    title: 'Eutrophication and the Baltic Sea: Studies on Phytoplankton, Bacterioplankton and Pelagic Nutrient Cycles',
    authors: [
      parseAuthorName('Tamminen, T.', false, false)
    ],
    year: 1990,
    degree: 'PhD thesis',
    institution: 'University of Helsinki',
    place: 'Finland',
    language: 'en'
  },
  {
    id: 'hue-8',
    type: 'book_chapter',
    title: 'Về quá trình tụ cư lập làng ở Hương Vinh',
    authors: [
      parseAuthorName('Nguyễn Quang Trung Tiến', false, true)
    ],
    bookTitle: 'Văn hóa - lịch sử Huế qua góc nhìn làng xã phụ cận và quan hệ với bên ngoài',
    editors: [
      parseAuthorName('Nguyễn Quang Trung Tiến', false, true),
      parseAuthorName('Nishimura Masanari', false, false)
    ],
    year: 2010,
    publisher: 'Nxb. Thuận Hóa',
    place: 'Huế',
    pages: '10 - 28',
    language: 'vi'
  },
  {
    id: 'hue-9',
    type: 'thesis',
    title: 'Nâng cao năng lực cạnh tranh của các doanh nghiệp du lịch thành phố Hồ Chí Minh đến năm 2020',
    authors: [
      parseAuthorName('Nguyễn Cửu Trí', false, true)
    ],
    year: 2011,
    degree: 'Luận án Tiến sĩ kinh tế',
    institution: 'Trường Đại học Kinh tế Tp. HCM',
    place: 'Tp. HCM',
    language: 'vi'
  },
  {
    id: 'hue-10',
    type: 'webpage',
    title: 'Nuôi tôm thẻ chân trắng trải bạt nền đáy',
    authors: [
      parseAuthorName('Dương Tử', false, true)
    ],
    year: 2015,
    url: 'http://thuysanvietnam.com.vn/nuoi-tom-the-chan-trang-trai-bat-nen-day-article-6651.tsvn',
    accessDate: '21/7/2016',
    siteName: 'Thủy Sản Việt Nam',
    language: 'vi'
  },
  {
    id: 'vnu-1',
    type: 'book',
    title: 'Một số điều cần biết về biến đổi khí hậu',
    authors: [
      parseAuthorName('Trương Quang Học', false, true),
      parseAuthorName('Nguyễn Đức Ngữ', false, true)
    ],
    year: 2009,
    publisher: 'Nhà xuất bản Khoa học và Kỹ thuật',
    place: 'Hà Nội',
    totalPageCount: '389 tr.',
    language: 'vi'
  },
  {
    id: 'vnu-2',
    type: 'book',
    title: 'Vietnam: A Natural History',
    authors: [
      parseAuthorName('Sterling, E.J.', false, false),
      parseAuthorName('Hurley, M.M.', false, false),
      parseAuthorName('Lê Đức Minh', false, true)
    ],
    year: 2006,
    publisher: 'Yale University Press',
    place: 'U.S.A.',
    totalPageCount: '448 p.',
    language: 'en'
  },
  {
    id: 'vnu-3',
    type: 'journal',
    title: 'Lượng tử hóa trường chuẩn có tương tác với vật chất và hệ phương trình cho các hàm Green',
    authors: [
      parseAuthorName('Cao Chi', false, true),
      parseAuthorName('Phạm Khánh Vân', false, true)
    ],
    year: 1983,
    journalName: 'Tạp chí Vật lý',
    volume: 'VIII',
    issue: '1',
    pages: '11–18',
    language: 'vi'
  },
  {
    id: 'vnu-4',
    type: 'book_chapter',
    title: 'Phát triển kinh tế nông hộ – nông lâm kết hợp theo mô hình R-VAC',
    authors: [
      parseAuthorName('Lê Trọng Cúc', false, true)
    ],
    year: 2010,
    bookTitle: 'Phục hồi và tái sử dụng các vùng đất bị suy thoái do chất độc hóa học',
    editors: [
      parseAuthorName('Võ Quý', false, true),
      parseAuthorName('Võ Thanh Sơn', false, true)
    ],
    publisher: 'Nhà xuất bản Nông nghiệp',
    place: 'Hà Nội',
    pages: '277–290',
    language: 'vi'
  },
  {
    id: 'vnu-5',
    type: 'manuscript',
    title: 'Hội thảo khoa học quốc gia “Tài nguyên thiên nhiên và tăng trưởng xanh”: Tuyển tập báo cáo khoa học',
    authors: [
      parseAuthorName('Trung tâm Nghiên cứu Tài nguyên và Môi trường', true)
    ],
    year: 2013,
    institution: 'Trung tâm Nghiên cứu Tài nguyên và Môi trường, Đại học Quốc gia Hà Nội',
    place: 'Hà Nội',
    language: 'vi'
  },
  {
    id: 'vnu-6',
    type: 'thesis',
    title: 'Phát triển hệ chương trình xử lý, phân tích tài liệu phân cực kích thích ở Việt Nam',
    authors: [
      parseAuthorName('Vũ Đức Minh', false, true)
    ],
    year: 2001,
    degree: 'Luận án Tiến sĩ Vật lý',
    institution: 'Khoa Vật lý, Trường Đại học Khoa học Tự nhiên, Đại học Quốc gia Hà Nội',
    place: 'Hà Nội',
    totalPageCount: '155 tr.',
    language: 'vi'
  },
  {
    id: 'non-latin-1',
    type: 'thesis',
    title: '汉语人体成语的认知机制研究',
    authors: [
      parseAuthorName('Lizhi, X. [谢丽芝]', false, false)
    ],
    year: 2012,
    degree: '硕士论文',
    institution: '曲阜师范大学',
    language: 'zh'
  }
];
