export interface CourseData {
  id: number;
  title: string;
  category: string;
  image: string;
  duration: string;
  rating: number;
  reviews: number;
  price: string;
}


const coursesData: CourseData[] = [
  {
    id: 1,
    title: 'Thiết kế UI/UX thực chiến với Figma cho người mới',
    category: 'Thiết kế',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC170vL5TK6cMbb7ebkpdywycBWohy49pRyvdK0vkCSnXrVpW9Susq29sfTqGgSlUgoObwRScu2qwACYqTNX6v0gDaAXkJFB-t3vkIigo3RqRvSxDLPb2ZqfNSe1w53Go7gcYFYVUFCrJRDsYWvve9rpxjNRqUQRRI4fTW3hIGBZEYpGT-H3ITPPRiqZFw5c5y2vdINwQqfwRV8ify3gyOOoWggBpt7EkTTkqe1l8lDXhqVDeP844TqEEGceKa7VQ9IEsTIEmhMxDWf',
    duration: '24 giờ học',
    rating: 4.9,
    reviews: 1200,
    price: '499.000đ'
  },
  {
    id: 2,
    title: 'Lập trình ReactJS từ số 0 đến chuyên gia',
    category: 'Lập trình',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVxFoSNGXC0o3rbfiEzjXo6ZYvLUhr-fnCp5FSUvMhmMjZJ8GEiZRBRjTvbFLS3gQfqcLtedesDVaKCXzjzgiyAnz_RpW_SvPNn1IZV59faKnteTTtwgaRP4wesJRs0yiL9-ewy5Fz9Sh_IC0M3Ho0PtIh7dpd1WF1xDQcyZnPHB0eGZoPvdrGMlJqEqyj-xG-Q0TM6A62DiEAczL0yrlkICZuJ7MUcTQVdYbgFobjWRLiYEfXZqqyKgLJ9S-VDZRdSmwTJeWJkx65',
    duration: '45 giờ học',
    rating: 4.8,
    reviews: 856,
    price: '850.000đ'
  },
  {
    id: 3,
    title: 'Marketing Online cho người mới bắt đầu',
    category: 'Marketing',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEWz47QgzW21hBJShqevYgxQuC92yhHr66Gt6llaDYGUCBdjK-lxloJ-UDuYr9Bk_6mRSvQfy5f6EH3i0d5Fo_SMmaPfc7kgcbEJ5ssSKDsWiE6Dh7_D1ALPx-q7QTDbixwuvoPmGC4-IpJI86rKoI_mTVJBSVbzFW7ubwZZQ55MI6b4TZc2KvZ5CDSN8AFKcrrscr63Wkc25Wjqjy7LFjpWOAD7X2jJixSHMp1bpaCRj4J-4an05sE7PXWI2OekuwIMN4A5ijJqTY',
    duration: '18 giờ học',
    rating: 4.7,
    reviews: 540,
    price: 'Miễn phí'
  },
  {
    id: 4,
    title: 'Cấu trúc dữ liệu và giải thuật căn bản',
    category: 'Lập trình',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCroIwSipGcsFsDtgzkDneEcThLuQE9TlOWtlZrvU-FOK35nNoc8XrUjJh5F2k_NIH82mmznOi1AwxmROe-3I-NE5Y9MvFOEil3l2Pva6G8aoyIK2CEVdtyPvtLE-OqI8HRJvSPgtbrtBv0xp9TdsFAMtZVYQmB93npW8qpykYYySRaS7Jz1w2i1KvNftEKIsreibasaxD1oE40tPWUJ6A4RmofBXdG7PVwY_8pB5r7qz_XaHzz_mXQnKqTsezT-t8bN_Z5Sz8DlKpL',
    duration: '32 giờ học',
    rating: 4.9,
    reviews: 432,
    price: '550.000đ'
  },
  {
    id: 5,
    title: 'Quản trị kinh doanh trong kỷ nguyên số',
    category: 'Kinh doanh',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIYwc7PPOX4jh94moAaDyrxmggOeCWxuq4vHdi8-WTa6kt7VnHAtB-gPdA4xB1YYqHcXESPIigvbRStJZi1pzZUt57Q7DHS8z6ZO2oIFrGYv2nSr-chkb8uECvzho0HRjRAV9SxVLJ8OKLYLC49S5yIA2JTv-lXd07UB4PckIM2jm-8SdW7xKd1VvNnHgljavSa6fjX3c2HXIJUQHR2eTyuPtBCXr6aiWbbHPG8nnHwX504B9iemp6UBY_9jgowgG9SP4nOwFYnngO',
    duration: '28 giờ học',
    rating: 4.6,
    reviews: 210,
    price: '720.000đ'
  },
  {
    id: 6,
    title: 'Tiếng Anh giao tiếp chuyên sâu cho người đi làm',
    category: 'Ngoại ngữ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1oR04mdN43q5ktQO-mmf8QbPM0uxrUnbPlQXDCMcuDyoTgz56qhP0Meod-X0MKKI8KG_atPLK8TjHGCAlM_-n0NWtmJ2hGYh8QrLm4_TfSkaauCbGTf6_ZyQWy0C1_AqcizT98pKzm5h4S0u_O782M7kfhHnTunWo1ajdmOSmbgu6huK0sQX2N5vlnaqNwma9KAevgh_6dYSokmOaIQzIOhdaElDYroAqhzgBxWmm6GMWdJF-1bXXoJMbHCvKsW1v3xSt7rVfcf9D',
    duration: '50 giờ học',
    rating: 4.9,
    reviews: 2400,
    price: '1.200.000đ'
  }
];


export default coursesData;
