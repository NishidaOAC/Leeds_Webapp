const User = require('./user');
const Role = require('./role');
const UserApproval = require('./userApproval');
const { Team, TeamLeader, TeamMember } = require('./team');

// Define associations
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

// UserApproval.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// User.hasMany(UserApproval, { foreignKey: 'userId', as: 'approvals' });

Team.hasMany(TeamLeader, { foreignKey: 'teamId', onUpdate: 'CASCADE' });
TeamLeader.belongsTo(Team, { foreignKey: 'teamId' });

Team.hasMany(TeamMember, { foreignKey: 'teamId', onUpdate: 'CASCADE' });
TeamMember.belongsTo(Team, { foreignKey: 'teamId' });

User.hasMany(TeamLeader, { foreignKey: 'userId', onUpdate: 'CASCADE' });
TeamLeader.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(TeamMember, { foreignKey: 'userId', onUpdate: 'CASCADE' });
TeamMember.belongsTo(User, { foreignKey: 'userId' });

const models = {
  User,
  Role,
  UserApproval,
  Team,
  TeamLeader,
  TeamMember
};

module.exports = models;