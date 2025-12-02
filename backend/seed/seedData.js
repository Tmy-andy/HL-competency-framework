const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load models
const User = require('../models/User');
const Competency = require('../models/Competency');
const Employee = require('../models/Employee');
const Store = require('../models/Store');
const Position = require('../models/Position');
const Assessment = require('../models/Assessment');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, '❌ MongoDB connection error:'));
db.once('open', async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await Competency.deleteMany();
    await Employee.deleteMany();
    await Store.deleteMany();
    await Position.deleteMany();
    await Assessment.deleteMany();
    console.log('✅ Existing data cleared');

    // Load competencies from barista JSON
    console.log('📥 Loading competencies from JSON...');
    const baristaCompPath = path.join(__dirname, '../competencies-barista.json');
    const baristaComp = JSON.parse(fs.readFileSync(baristaCompPath, 'utf-8'));
    
    const competencies = baristaComp.map(comp => ({
      id: comp.id,
      name: comp.name || comp.nameVi,
      nameVi: comp.nameVi || comp.name,
      definition: comp.definition,
      category: comp.category,
      level1: comp.level1,
      level2: comp.level2,
      level3: comp.level3,
      level4: comp.level4,
      evidence: comp.evidence,
      trainingMethod: comp.trainingMethod
    }));
    
    await Competency.insertMany(competencies);
    console.log(`✅ ${competencies.length} competencies imported`);

    // Create default stores
    console.log('🏪 Creating stores...');
    const stores = [
      {
        code: 'SG-TPHCM-001',
        name: 'Cửa hàng TP. Hồ Chí Minh - Chi nhánh 1',
        region: 'Miền Nam',
        address: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
        phone: '0838123456',
        manager: 'Trần Minh Châu',
        employeeCount: 8,
        status: 'active'
      },
      {
        code: 'SG-TPHCM-002',
        name: 'Cửa hàng TP. Hồ Chí Minh - Chi nhánh 2',
        region: 'Miền Nam',
        address: '456 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
        phone: '0838234567',
        manager: '',
        employeeCount: 6,
        status: 'active'
      },
      {
        code: 'HN-HANOI-001',
        name: 'Cửa hàng Hà Nội - Chi nhánh 1',
        region: 'Miền Bắc',
        address: '789 Đường Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
        phone: '0243456789',
        manager: '',
        employeeCount: 7,
        status: 'active'
      }
    ];
    
    const createdStores = await Store.insertMany(stores);
    console.log(`✅ ${createdStores.length} stores created`);

    // Create default positions
    console.log('💼 Creating positions...');
    const positions = [
      {
        code: 'barista',
        name: 'Barista',
        description: 'Nhân viên pha chế, tạo ra các đồ uống chất lượng cao, phục vụ khách hàng',
        level: 'entry'
      },
      {
        code: 'server',
        name: 'Server',
        description: 'Nhân viên phục vụ khách hàng',
        level: 'entry'
      },
      {
        code: 'sales',
        name: 'Sales',
        description: 'Nhân viên bán hàng',
        level: 'intermediate'
      },
      {
        code: 'manager',
        name: 'Store Manager',
        description: 'Quản lý cửa hàng',
        level: 'management'
      }
    ];
    
    await Position.insertMany(positions);
    console.log(`✅ ${positions.length} positions created`);

    // Create default employees
    console.log('👥 Creating employees...');
    const employees = [
      {
        employeeId: 'EMP001',
        name: 'Trần Minh Châu',
        email: 'tran.minh.chau@company.com',
        phone: '0912345678',
        position: 'sales',
        store: createdStores[0]._id,
        hireDate: new Date('2023-01-15'),
        department: 'Sales & Marketing',
        status: 'active'
      },
      {
        employeeId: 'EMP002',
        name: 'Nguyễn Văn A',
        email: 'nguyen.van.a@company.com',
        phone: '0913456789',
        position: 'server',
        store: createdStores[0]._id,
        hireDate: new Date('2023-02-20'),
        department: 'Retail',
        status: 'active'
      },
      {
        employeeId: 'EMP003',
        name: 'Phạm Thị B',
        email: 'pham.thi.b@company.com',
        phone: '0914567890',
        position: 'barista',
        store: createdStores[0]._id,
        hireDate: new Date('2023-03-10'),
        department: 'Operations',
        status: 'active'
      },
      {
        employeeId: 'EMP004',
        name: 'Hoàng Minh Tú',
        email: 'hoang.minh.tu@company.com',
        phone: '0915678901',
        position: 'sales',
        store: createdStores[1]._id,
        hireDate: new Date('2023-04-05'),
        department: 'Sales & Marketing',
        status: 'active'
      },
      {
        employeeId: 'EMP005',
        name: 'Lê Thị C',
        email: 'le.thi.c@company.com',
        phone: '0916789012',
        position: 'server',
        store: createdStores[1]._id,
        hireDate: new Date('2023-05-12'),
        department: 'Retail',
        status: 'active'
      }
    ];
    
    const createdEmployees = await Employee.insertMany(employees);
    console.log(`✅ ${createdEmployees.length} employees created`);

    // Create default admin user
    console.log('👤 Creating default users...');
    const users = [
      {
        username: 'admin',
        email: 'admin@company.com',
        password: 'admin123',
        fullName: 'Quản trị viên hệ thống',
        role: 'admin',
        isActive: true
      },
      {
        username: 'manager1',
        email: 'manager1@company.com',
        password: 'manager123',
        fullName: 'Trần Minh Châu',
        role: 'manager',
        store: createdStores[0]._id,
        isActive: true
      }
    ];
    
    await User.insertMany(users);
    console.log(`✅ ${users.length} users created`);
    
    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('📋 Default credentials:');
    console.log('   Admin:');
    console.log('   - Username: admin');
    console.log('   - Password: admin123');
    console.log('');
    console.log('   Manager:');
    console.log('   - Username: manager1');
    console.log('   - Password: manager123');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
});
