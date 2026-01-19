const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('Role', {
  roleName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    field: 'role_name'
  },  
  abbreviation: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  permissions: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const roleData =[ 
    {roleName : 'Super Administrator', abbreviation: 'SA'},
    {roleName : 'Administrator', abbreviation: 'A'}
]

const initialize = async () => {
    const role = await Role.findAll();
    if (!role.length) {
        await Role.bulkCreate(roleData);
    }
};
Role.sync({ force: true })
.then(initialize)
.catch(console.error);

module.exports = Role;