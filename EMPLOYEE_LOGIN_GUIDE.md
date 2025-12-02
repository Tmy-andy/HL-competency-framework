# Hướng Dẫn Đăng Nhập Nhân Viên

## Tổng Quan

Hệ thống giờ đây hỗ trợ 2 loại người dùng:
1. **Quản trị viên/Nhân viên HR** - Đăng nhập bằng username/password
2. **Nhân viên** - Đăng nhập bằng mã nhân viên/số điện thoại

## Đăng Nhập Nhân Viên

### Thông Tin Đăng Nhập
- **Tên đăng nhập**: Mã nhân viên (employeeId)
- **Mật khẩu**: Số điện thoại

### Ví Dụ
Nếu nhân viên có:
- Mã nhân viên: `EMP001`
- Số điện thoại: `0912345678`

Thì đăng nhập với:
- Username: `EMP001`
- Password: `0912345678`

## Giao Diện Nhân Viên

### Đặc Điểm
- ✅ Tối ưu hóa cho mobile
- ✅ Giao diện đơn giản, dễ sử dụng
- ✅ Chỉ hiển thị thông tin của chính mình
- ✅ Không thể truy cập thông tin nhân viên khác

### Tính Năng

#### 1. Tab Tổng Quan
- Thông tin cá nhân (Email, Vị trí, Cửa hàng, SĐT)
- Cấp độ hiện tại với biểu đồ tròn
- Đánh giá gần nhất

#### 2. Tab Lịch Sử
- Danh sách tất cả đánh giá
- Thông tin người đánh giá
- Điểm số và cấp độ
- Ghi chú (nếu có)

### Header
- Avatar và tên nhân viên
- Mã nhân viên
- Nút đăng xuất

## Kiểm Tra Thông Tin Nhân Viên

### 1. Xem Danh Sách Nhân Viên (Admin)
```bash
# Truy cập MongoDB hoặc dùng API
GET http://localhost:5001/api/employees
```

### 2. Tìm Thông Tin Đăng Nhập
Mỗi nhân viên cần có:
- `employeeId` (dùng làm username)
- `phone` (dùng làm password)

### 3. Ví Dụ Employee Document
```json
{
  "_id": "...",
  "employeeId": "EMP001",
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0912345678",
  "position": "Barista",
  "store": "...",
  "currentLevel": 3
}
```

## Quy Trình Auto-Create User

Khi nhân viên đăng nhập lần đầu:
1. Hệ thống tìm Employee với `employeeId` = username
2. Kiểm tra `phone` = password
3. Tự động tạo User account với:
   - username = employeeId
   - email = employee.email
   - password = phone (được hash)
   - fullName = employee.name
   - role = 'employee'
   - phone = employee.phone

## Phân Quyền

### Admin/Manager/HR
- ✅ Truy cập dashboard
- ✅ Quản lý nhân viên
- ✅ Tạo đánh giá
- ✅ Xem báo cáo
- ✅ Quản lý competencies
- ✅ Quản lý cửa hàng

### Employee
- ✅ Xem thông tin cá nhân
- ✅ Xem lịch sử đánh giá
- ✅ Xem cấp độ hiện tại
- ❌ Không truy cập được admin pages
- ❌ Không xem được thông tin nhân viên khác

## Test Employee Login

### Bước 1: Tạo Employee (nếu chưa có)
```bash
POST http://localhost:5001/api/employees
Content-Type: application/json

{
  "employeeId": "TEST001",
  "name": "Test Employee",
  "email": "test@example.com",
  "phone": "0900000000",
  "position": "Barista",
  "dateOfBirth": "2000-01-01",
  "hireDate": "2024-01-01"
}
```

### Bước 2: Đăng Nhập
```
Username: TEST001
Password: 0900000000
```

### Bước 3: Kiểm Tra
- ✅ Redirect tự động đến `/employee-dashboard`
- ✅ Hiển thị thông tin cá nhân
- ✅ Hiển thị cấp độ (nếu có)
- ✅ Hiển thị lịch sử đánh giá
- ✅ Không truy cập được routes khác

## Responsive Design

### Mobile-First Approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly: Buttons tối thiểu 44x44px
- Font size lớn, dễ đọc
- Layout dọc, không scroll ngang

### Sticky Elements
- Header cố định trên cùng
- Tabs cố định ngay dưới header
- Dễ navigation khi scroll

### Dark Mode Support
- Tự động theo system preference
- Colors tối ưu cho cả light/dark mode

## Troubleshooting

### Employee không đăng nhập được
1. Kiểm tra `employeeId` có đúng không (case-sensitive)
2. Kiểm tra `phone` có đúng không
3. Xem log backend để debug
4. Verify employee tồn tại trong database

### Không redirect đến employee dashboard
1. Kiểm tra `role` trong localStorage
2. Clear cache và localStorage
3. Đăng nhập lại
4. Check console cho errors

### Không hiển thị thông tin
1. Kiểm tra email của employee
2. Verify API response
3. Check console logs
4. Ensure employee có email trùng với user.email

## API Endpoints

### Employee Login
```
POST /api/auth/login
Body: { username: "employeeId", password: "phone" }
Response: {
  success: true,
  data: {
    _id: "...",
    username: "EMP001",
    email: "...",
    fullName: "...",
    role: "employee",
    isEmployee: true,
    employeeId: "...",
    token: "..."
  }
}
```

### Get Employee Info
```
GET /api/employees?search=email@example.com
```

### Get Assessments
```
GET /api/assessments?employee=employeeId
```

## Security Notes

1. ✅ Employee chỉ xem được thông tin của mình
2. ✅ Routes được protect bằng role-based access
3. ✅ Password (phone) được hash trước khi lưu
4. ✅ JWT token expire sau 30 ngày
5. ✅ Không thể access admin routes từ employee account

## Next Steps

### Tính Năng Có Thể Thêm
- [ ] Đổi mật khẩu (phone number)
- [ ] Thông báo push khi có đánh giá mới
- [ ] Export PDF báo cáo cá nhân
- [ ] Chat với manager
- [ ] Calendar view cho assessments
- [ ] Goal setting và tracking

### UI/UX Improvements
- [ ] PWA (Progressive Web App) support
- [ ] Offline mode
- [ ] Better loading states
- [ ] Skeleton screens
- [ ] Pull-to-refresh
- [ ] Swipe gestures
