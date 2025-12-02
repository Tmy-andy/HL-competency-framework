const mongoose = require('mongoose');
const Store = require('../models/Store');
require('dotenv').config();

const stores = [
  { code: 'GRBVTA002', name: '199 N KKN Vung Tau', region: 'Miền Nam', address: '199 N KKN, Vũng Tàu', status: 'active' },
  { code: 'HCSVTA0001', name: 'Kim Minh Plaza-VTA', region: 'Miền Nam', address: 'Kim Minh Plaza, Vũng Tàu', status: 'active' },
  { code: 'HCSVTA0002', name: 'Nguyen Thai Hoc-VTA', region: 'Miền Nam', address: 'Nguyễn Thái Học, Vũng Tàu', status: 'active' },
  { code: 'HCSVTA0003', name: 'Hoang Hoa Tham-VTA', region: 'Miền Nam', address: 'Hoàng Hoa Thám, Vũng Tàu', status: 'active' },
  { code: 'HCSVTA0004', name: 'Tan Hoang Mao', region: 'Miền Nam', address: 'Tân Hoàng Mao', status: 'active' },
  { code: 'HCSVTA0005', name: '304 Le Hong Phong_VT', region: 'Miền Nam', address: '304 Lê Hồng Phong, Vũng Tàu', status: 'active' },
  { code: 'HCSVTA0006', name: 'Lotte Vung Tau', region: 'Miền Nam', address: 'Lotte Mart, Vũng Tàu', status: 'active' },
  { code: 'HCSVTA0007', name: 'KNG Phu My', region: 'Miền Nam', address: 'KCN Phú Mỹ', status: 'active' },
  { code: 'HCSVTA0008', name: '150 Ha Long VT', region: 'Miền Nam', address: '150 Hạ Long, Vũng Tàu', status: 'active' },
  { code: 'HCSVTA0010', name: 'Go! Mall Ba Ria', region: 'Miền Nam', address: 'Go! Mall Bà Rịa', status: 'active' },
  { code: 'HCSVTA0011', name: 'Dien Bien Phu Ba Ria', region: 'Miền Nam', address: 'Điện Biên Phủ, Bà Rịa', status: 'active' },
  { code: 'HCSVTA0016', name: '30 Thang 4 Vung Tau', region: 'Miền Nam', address: '30 Tháng 4, Vũng Tàu', status: 'active' },
  { code: 'HCSVTA0017', name: '252 QL55 XUYEN MOC', region: 'Miền Nam', address: '252 QL55, Xuyên Mộc', status: 'active' },
  { code: 'HCSVTA0018', name: 'Nguyen An Ninh-VTA', region: 'Miền Nam', address: 'Nguyễn An Ninh, Vũng Tàu', status: 'active' },
  { code: 'HCSVTA0019', name: '30 Thang 4 Vung Tau 2', region: 'Miền Nam', address: '30 Tháng 4, Vũng Tàu (Chi nhánh 2)', status: 'active' },
  { code: 'HCSVTA0020', name: '24 Ha Long Vung Tau', region: 'Miền Nam', address: '24 Hạ Long, Vũng Tàu', status: 'active' },
  { code: 'HCSVTATRAILER01', name: 'PVOil No.7 QL51', region: 'Miền Nam', address: 'Cây xăng PVOil số 7, QL51', status: 'active' },
  { code: 'HCSVTATRAILER02', name: 'PVOil No.12 QL51', region: 'Miền Nam', address: 'Cây xăng PVOil số 12, QL51', status: 'active' },
  { code: 'HCSVTATRAILER03', name: 'PVOil No.1 Vung Tau', region: 'Miền Nam', address: 'Cây xăng PVOil số 1, Vũng Tàu', status: 'active' },
  { code: 'HCSVTA0012', name: 'Vung Tau Center', region: 'Miền Nam', address: 'Vũng Tàu Center', status: 'active' },
  { code: 'HCSVTA0014', name: '75 Thuy Van Vung Tau', region: 'Miền Nam', address: '75 Thùy Vân, Vũng Tàu', status: 'active' },
  { code: 'HCSVTA0013', name: '72 Hung Vuong Ba Ria', region: 'Miền Nam', address: '72 Hùng Vương, Bà Rịa', status: 'active' },
  { code: 'GRBVTA003', name: 'Chi Linh Vung Tau', region: 'Miền Nam', address: 'Chi Linh, Vũng Tàu', status: 'active' },
  { code: 'HCSVTA0015', name: '408 CMT8 Ba Ria', region: 'Miền Nam', address: '408 CMT8, Bà Rịa', status: 'active' }
];

const seedStores = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear existing stores (optional - comment out if you want to keep existing data)
    // await Store.deleteMany({});
    // console.log('🗑️  Cleared existing stores');

    // Insert stores
    const createdStores = await Store.insertMany(stores);
    console.log(`✅ Successfully seeded ${createdStores.length} stores`);

    // Display created stores
    console.log('\n📋 Created stores:');
    createdStores.forEach(store => {
      console.log(`  - ${store.code}: ${store.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding stores:', error);
    process.exit(1);
  }
};

// Run the seeder
seedStores();
