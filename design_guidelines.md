# Design Guidelines - Hệ Thống Quản Lý Cho Thuê Xe

## Design Approach

**Hybrid Strategy**: Customer-facing pages use reference-based design inspired by modern car rental platforms (Turo, Hertz, Enterprise modernized experiences), while Admin dashboard follows Material Design principles for data-heavy interfaces.

## Core Design Elements

### Typography
- **Primary Font**: Inter via Google Fonts CDN
- **Headings**: Bold (700) - text-2xl to text-5xl for hierarchy
- **Body Text**: Regular (400) - text-base, line-height relaxed
- **Labels/Metadata**: Medium (500) - text-sm
- **Vietnamese Support**: Ensure font supports Vietnamese diacritics perfectly

### Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, and 16
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Grid gaps: gap-4, gap-6, gap-8
- Container max-width: max-w-7xl with px-4

### Component Library

#### Customer Interface Components

**Hero Section**:
- Full-width image showcase featuring premium cars in attractive settings
- Overlay with search widget (pickup/return dates, location selector)
- Large heading: "Thuê Xe Dễ Dàng - Trải Nghiệm Tuyệt Vời"
- Blurred background buttons with clear CTAs
- Height: 70vh on desktop, 60vh on mobile

**Car Grid/Listing Cards**:
- 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Each card: car image, brand/model, daily price, transmission type, seats, availability badge
- Hover state with subtle elevation increase
- Quick action buttons: "Xem Chi Tiết", "Đặt Ngay"

**Filter Sidebar**:
- Collapsible on mobile
- Filter options: Loại xe, Giá (slider), Số ghế, Truyền động, Tình trạng
- Clear all filters button
- Sticky positioning on desktop

**Car Detail Page**:
- Large image gallery with thumbnails
- Two-column layout: Left (images + specifications), Right (booking form)
- Specifications table: well-organized with icons
- Booking form card: date pickers, total calculation, submit button
- Related cars section at bottom

**Booking Form**:
- Date range picker with Vietnamese locale
- Clear pricing breakdown
- Input fields: Họ tên, Số điện thoại, CMND/CCCD
- Prominent "Xác Nhận Đặt Xe" button

#### Admin Interface Components

**Dashboard Navigation**:
- Left sidebar: vertical navigation with icons
- Sections: Tổng Quan, Quản Lý Xe, Đơn Thuê Xe, Khách Hàng, Báo Cáo
- Active state with accent indicator
- Collapsible on mobile (hamburger menu)

**Data Tables**:
- Clean Material Design inspired tables
- Sortable columns
- Row actions: Edit (icon), Delete (icon), View (icon)
- Pagination at bottom
- Search and filter bar above table
- Status badges with semantic colors

**Forms (Add/Edit Vehicle)**:
- Two-column layout on desktop
- Grouped fields: Thông Tin Cơ Bản, Thông Số Kỹ Thuật, Giá & Tình Trạng
- Image upload with preview
- Clear submit and cancel buttons

**Statistics Cards**:
- 4-column grid on dashboard overview
- Each card: Icon, metric value, label, trend indicator
- Cards: Tổng Xe, Xe Đang Cho Thuê, Doanh Thu Tháng, Đơn Chờ Xác Nhận

**Booking Management Table**:
- Status column with color-coded badges: Chờ xác nhận (yellow), Đã xác nhận (blue), Đang thuê (green), Đã trả (gray), Hủy (red)
- Actions: Update status dropdown, View details, Contact customer
- Date range filter

### Icons
**Library**: Heroicons (via CDN)
- Navigation: home, car, calendar, users, chart-bar
- Actions: pencil, trash, eye, check, x-mark
- Status indicators: clock, check-circle, exclamation-triangle

### Images

**Customer Interface**:
- Hero: High-quality wide shot of luxury car fleet (1920x800px)
- Car listings: Professional car photos on clean backgrounds (600x400px)
- Detail page gallery: 5-8 images per car from multiple angles

**Admin Interface**:
- Minimal decorative images
- Car thumbnails in tables (80x60px)
- Placeholder for vehicles without photos

### Responsive Breakpoints
- Mobile: base (< 640px)
- Tablet: md (768px)
- Desktop: lg (1024px)
- Large Desktop: xl (1280px)

### Accessibility
- Vietnamese language attribute: lang="vi"
- ARIA labels for all interactive elements in Vietnamese
- Form validation messages in Vietnamese
- Keyboard navigation throughout
- Focus states with clear visibility
- Semantic HTML structure

### Navigation
**Customer Header**:
- Logo left, main nav center (Trang Chủ, Xe Cho Thuê, Giới Thiệu, Liên Hệ), Login/Account right
- Sticky on scroll

**Customer Footer**:
- 3-column layout: Về Chúng Tôi, Liên Kết Nhanh, Liên Hệ
- Social media icons
- Copyright text

**Admin Header**:
- Breadcrumb navigation
- User profile dropdown (top right)
- Notifications icon

### Animations
Use sparingly - only for:
- Card hover elevation transitions
- Modal/drawer open/close
- Loading states (spinner)
- Tab transitions