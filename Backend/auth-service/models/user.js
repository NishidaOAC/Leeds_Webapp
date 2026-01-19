const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const Role = require('./role');

const User = sequelize.define('user', { 
  email: { 
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  empNo: {
    type: DataTypes.STRING,
    unique: true
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('pending_approval', 'approved', 'rejected', 'suspended'),
    defaultValue: 'pending_approval'
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  failedLoginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  passwordChangedAt: {
    type: DataTypes.DATE
  },
  resetPasswordToken: {
    type: DataTypes.STRING
  },
  resetPasswordExpires: {
    type: DataTypes.DATE
  }
}, {
  // ... rest of the model configuration
});

// Instance method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate JWT token
User.prototype.generateToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: this.id, email: this.email, roleId: this.roleId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
};

// Instance method to generate refresh token
User.prototype.generateRefreshToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: this.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
};

const initializeSystem = async () => {
  try {
    console.log('🚀 Initializing system...');
    
    // 1. First, find the role - MUST use await
    const superAdminRole = await Role.findOne({ where: { roleName: 'Super Administrator' } });
    console.log('Super Admin Role:', superAdminRole);
    
    if (!superAdminRole) {
      console.error('❌ Super Administrator role not found! Creating it first...');
      
      // Create the role if it doesn't exist
      const newRole = await Role.create({
        roleName: 'Super Administrator',
        abbreviation: 'SA',
        description: 'Has all permissions',
        permissions: ['*'],
        level: 1,
        isActive: true
      });
      
      console.log('✅ Created Super Administrator role:', newRole.id);
      
      const defaultUsers = [
        {
          email: 'superadmin@leedsaerospace.com',
          password: 'SuperAdmin@2024',
          name: 'System Super Administrator',
          empNo: 'SA001',
          roleId: newRole.id, // Use newRole.id
          status: 'approved',
          isActive: true
        }
      ];
      
      console.log('Default Users:', defaultUsers);
      
      // Create users
      for (const userData of defaultUsers) {
        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (!existingUser) {
          const user = await User.create(userData);
          console.log(`✅ Created user: ${user.email}`);
        }
      }
      
    } else {
      console.log('✅ Super Admin role found with ID:', superAdminRole.id);
      
      const defaultUsers = [
        {
          email: 'superadmin@leedsaerospace.com',
          password: 'SuperAdmin@2024',
          name: 'System Super Administrator',
          empNo: 'SA001',
          roleId: superAdminRole.id, // Use superAdminRole.id
          status: 'approved',
          isActive: true
        },
      ];
      
      console.log('Default Users:', defaultUsers);
      
      // Create users
      for (const userData of defaultUsers) {
        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (!existingUser) {
          const hashedPassword = await bcrypt.hash(userData.password, 10);
          const user = await User.create({
            ...userData,
            password: hashedPassword  // Important: Use hashed password
          });
          console.log(`✅ Created user: ${user.email}`);
        } else {
          console.log(`📝 User already exists: ${userData.email}`);
        }
      }
    }
    
    console.log('🎉 System initialization completed!');
    
  } catch (error) {
    console.error('❌ Error during initialization:', error);
  }
};


User.sync({ alter: true })
.then(initializeSystem)
.catch(console.error);

    
    // const salt = await bcrypt.genSalt(12);
    
module.exports = User;