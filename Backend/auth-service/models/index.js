const User = require('./user');
const Role = require('./role');
const UserApproval = require('./userApproval');

// Define associations
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

// UserApproval.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// User.hasMany(UserApproval, { foreignKey: 'userId', as: 'approvals' });

const models = {
  User,
  Role,
  UserApproval
};

module.exports = models;