const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Store = require('../models/Store');
require('dotenv').config();

const seedEmployees = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all stores
    const stores = await Store.find();
    if (stores.length === 0) {
      console.log('❌ No stores found. Please run seedStores.js first');
      process.exit(1);
    }

    // Sample employees
    const sampleEmployees = [
      {
        employeeId: 'NV001',
        name: 'Nguyễn Văn An',
        email: 'nguyenvanan@highland.com.vn',
        phone: '0901234567',
        position: 'AP',
        store: stores[0]._id,
        dateOfBirth: new Date('1995-03-15'),
        hireDate: new Date('2020-01-10'),
        status: 'active'
      },
      {
        employeeId: 'NV002',
        name: 'Trần Thị Bình',
        email: 'tranthibinh@highland.com.vn',
        phone: '0912345678',
        position: 'MB',
        store: stores[1]._id,
        dateOfBirth: new Date('1998-07-22'),
        hireDate: new Date('2021-05-15'),
        status: 'active'
      },
      {
        employeeId: 'NV003',
        name: 'Lê Văn Cường',
        email: 'levancuong@highland.com.vn',
        phone: '0923456789',
        position: 'B',
        store: stores[0]._id,
        dateOfBirth: new Date('2000-11-08'),
        hireDate: new Date('2022-03-20'),
        status: 'active'
      },
      {
        employeeId: 'NV004',
        name: 'Phạm Thị Dung',
        email: 'phamthidung@highland.com.vn',
        phone: '0934567890',
        position: 'SL',
        store: stores[2]._id,
        dateOfBirth: new Date('1997-05-30'),
        hireDate: new Date('2021-08-12'),
        status: 'active'
      },
      {
        employeeId: 'NV005',
        name: 'Hoàng Văn Em',
        email: 'hoangvanem@highland.com.vn',
        phone: '0945678901',
        position: 'Crew Leader',
        store: stores[3]._id,
        dateOfBirth: new Date('1996-12-25'),
        hireDate: new Date('2020-10-05'),
        status: 'active'
      }
    ];

    // Delete existing employees (optional)
    console.log('🗑️  Deleting existing employees...');
    await Employee.deleteMany({});

    // Insert sample employees
    console.log('📝 Creating sample employees...');
    const createdEmployees = await Employee.insertMany(sampleEmployees);

    console.log('✅ Successfully created employees:');
    createdEmployees.forEach(emp => {
      console.log(`   - ${emp.employeeId}: ${emp.name} (${emp.position})`);
    });

    console.log(`\n✅ Seed completed! Created ${createdEmployees.length} employees`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedEmployees();
