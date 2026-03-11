const bcrypt = require('bcryptjs');
const Role = require('../models/role');
const User = require('../models/user');

module.exports = async function initializeSystem() {
  // 1. Define the required roles
  const requiredRoles = [
    {
      roleName: 'Super Administrator',
      abbreviation: 'SA',
      description: 'Has all permissions',
      permissions: ['*'],
      isActive: true
    },
    {
      roleName: 'Quality Super Administrator',
      abbreviation: 'QSA',
      description: 'Full access to quality and compliance modules',
      permissions: ['QUALITY_ALL', 'DOC_APPROVE', 'AUDIT_ALL'], // Adjust as per your permission set
      isActive: true
    }
  ];

  // 2. Ensure Roles exist and map them for easy lookup
  const roleMap = {};
  for (const roleData of requiredRoles) {
    let [role] = await Role.findOrCreate({
      where: { roleName: roleData.roleName },
      defaults: roleData
    });
    roleMap[roleData.abbreviation] = role.id;
  }

  // 3. Define the Super Users
  const hashedPassword = await bcrypt.hash('SuperAdmin@2024', 10);
  const hashedQualityPassword = await bcrypt.hash('QualityAdmin@2024', 10);
  const superUsers = [
    {
      email: 'superadmin@leedsaerospace.com',
      empNo: 'SA001',
      password: hashedPassword,
      name: 'System Super Administrator',
      roleId: roleMap['SA'],
      status: 'approved',
      isActive: true
    },
    {
      email: 'qualityadmin@leedsaerospace.com',
      empNo: 'QSA001',
      password: hashedQualityPassword,
      name: 'Quality Super Administrator',
      roleId: roleMap['QSA'],
      status: 'approved',
      isActive: true
    }
  ];

  // 4. Create users if they don't exist
  for (const userData of superUsers) {
    const userExists = await User.findOne({ where: { empNo: userData.empNo } });
    if (!userExists) {
      await User.create(userData);
      console.log(`User created: ${userData.name} (${userData.empNo})`);
    }
  }
};