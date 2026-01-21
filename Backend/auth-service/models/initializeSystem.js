const bcrypt = require('bcryptjs');
const Role = require('../models/role');
const User = require('../models/user');

module.exports = async function initializeSystem() {
  let role = await Role.findOne({
    where: { roleName: 'Super Administrator' }
  });

  if (!role) {
    role = await Role.create({
      roleName: 'Super Administrator',
      abbreviation: 'SA',
      description: 'Has all permissions',
      permissions: ['*'],
      isActive: true
    });
  }

  const userExists = await User.findOne({
    where: { empNo: 'SA001' }
  });

  if (!userExists) {
    const hashedPassword = await bcrypt.hash('SuperAdmin@2024', 10);

    await User.create({
      email: 'superadmin@leedsaerospace.com',
      empNo: 'SA001',
      password: hashedPassword,
      name: 'System Super Administrator',
      roleId: role.id,
      status: 'approved',
      isActive: true
    });
  }
};
