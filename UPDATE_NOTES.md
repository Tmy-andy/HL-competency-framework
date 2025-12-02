# Hướng Dẫn Cập Nhật Mới

## 🎯 Các Vấn Đề Đã Được Sửa

### 1. ✅ Lỗi Thêm Nhân Viên Mới

**Vấn đề:**
- Không có validation check trùng mã nhân viên
- Không có validation check trùng email
- Error handling không rõ ràng

**Đã sửa:**
- ✅ Kiểm tra mã nhân viên đã tồn tại
- ✅ Kiểm tra email đã được sử dụng
- ✅ Hiển thị message lỗi rõ ràng
- ✅ Handle validation errors từ Mongoose
- ✅ Populate store data khi tạo thành công

**File:** `backend/controllers/employeeController.js`

### 2. ✅ Cập Nhật Danh Sách Vị Trí

**Trước đây:** Vị trí tự do nhập (barista, server, sales, manager)

**Bây giờ:** Danh sách cố định (enum)
- **AP** - Assistant Manager
- **B** - Barista
- **MB** - Master Barista
- **SL** - Server Leader
- **Crew Leader** - Crew Leader

**Files đã cập nhật:**
- ✅ `backend/models/Employee.js` - Thêm enum validation
- ✅ `frontend/src/pages/Employees.jsx` - Cập nhật dropdown
- ✅ `frontend/src/pages/Reports.jsx` - Cập nhật filter

### 3. ✅ Dữ Liệu Cửa Hàng (24 stores)

**Đã thêm vào database:**

| Mã Cửa Hàng | Tên Cửa Hàng | Khu Vực |
|--------------|---------------|---------|
| GRBVTA002 | 199 N KKN Vung Tau | Miền Nam |
| HCSVTA0001 | Kim Minh Plaza-VTA | Miền Nam |
| HCSVTA0002 | Nguyen Thai Hoc-VTA | Miền Nam |
| HCSVTA0003 | Hoang Hoa Tham-VTA | Miền Nam |
| HCSVTA0004 | Tan Hoang Mao | Miền Nam |
| HCSVTA0005 | 304 Le Hong Phong_VT | Miền Nam |
| HCSVTA0006 | Lotte Vung Tau | Miền Nam |
| HCSVTA0007 | KNG Phu My | Miền Nam |
| HCSVTA0008 | 150 Ha Long VT | Miền Nam |
| HCSVTA0010 | Go! Mall Ba Ria | Miền Nam |
| HCSVTA0011 | Dien Bien Phu Ba Ria | Miền Nam |
| HCSVTA0016 | 30 Thang 4 Vung Tau | Miền Nam |
| HCSVTA0017 | 252 QL55 XUYEN MOC | Miền Nam |
| HCSVTA0018 | Nguyen An Ninh-VTA | Miền Nam |
| HCSVTA0019 | 30 Thang 4 Vung Tau 2 | Miền Nam |
| HCSVTA0020 | 24 Ha Long Vung Tau | Miền Nam |
| HCSVTATRAILER01 | PVOil No.7 QL51 | Miền Nam |
| HCSVTATRAILER02 | PVOil No.12 QL51 | Miền Nam |
| HCSVTATRAILER03 | PVOil No.1 Vung Tau | Miền Nam |
| HCSVTA0012 | Vung Tau Center | Miền Nam |
| HCSVTA0014 | 75 Thuy Van Vung Tau | Miền Nam |
| HCSVTA0013 | 72 Hung Vuong Ba Ria | Miền Nam |
| GRBVTA003 | Chi Linh Vung Tau | Miền Nam |
| HCSVTA0015 | 408 CMT8 Ba Ria | Miền Nam |

**Script seed:** `backend/seed/seedStores.js`

**Chạy lại script (nếu cần):**
```bash
cd backend
node seed/seedStores.js
```

## 🔄 Testing

### Test 1: Thêm Nhân Viên Mới
1. Vào trang "Quản lý nhân viên"
2. Click "Thêm nhân viên"
3. Điền thông tin:
   - Mã NV (unique)
   - Email (unique)
   - **Chọn vị trí từ dropdown** (AP, B, MB, SL, Crew Leader)
   - **Chọn cửa hàng từ 24 stores có sẵn**
   - Ngày vào làm
4. Nhấn "Lưu"

**Kiểm tra:**
- ✅ Nếu mã NV đã tồn tại → Hiện lỗi "Mã nhân viên đã tồn tại"
- ✅ Nếu email đã tồn tại → Hiện lỗi "Email đã được sử dụng"
- ✅ Nếu thiếu thông tin bắt buộc → Hiện lỗi validation
- ✅ Tạo thành công → Redirect về danh sách

### Test 2: Filter Theo Vị Trí
1. Vào trang "Quản lý nhân viên" hoặc "Báo cáo"
2. Chọn dropdown "Vị trí"
3. Thấy 5 options: AP, B, MB, SL, Crew Leader
4. Chọn 1 vị trí → Lọc đúng nhân viên

### Test 3: Danh Sách Cửa Hàng
1. Vào trang "Quản lý cửa hàng"
2. Thấy 24 stores đã được tạo
3. Mỗi store có: Mã, Tên, Khu vực (Miền Nam), Địa chỉ

## 📝 Notes

- ⚠️ **Vị trí cũ**: Nếu có nhân viên với vị trí cũ (barista, server, sales, manager), cần cập nhật thủ công trong database hoặc qua UI
- 🔄 **Backend cần restart** để áp dụng thay đổi validation
- 💾 **Dữ liệu stores** đã được lưu vào MongoDB Atlas

## 🚀 Next Steps

1. Restart backend server
2. Refresh frontend
3. Test tất cả các chức năng trên
4. Cập nhật vị trí cho nhân viên cũ (nếu có)
