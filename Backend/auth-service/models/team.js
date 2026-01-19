const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Team = sequelize.define(
  'Team',
  {
    teamName: { type: DataTypes.STRING, allowNull: false }
  },
  { freezeTableName: true }
);

const TeamLeader = sequelize.define(
  'TeamLeader',
  {
    teamId: { type: DataTypes.INTEGER },
    userId: { type: DataTypes.INTEGER }
  },
  { freezeTableName: true }
);

const TeamMember = sequelize.define(
  'TeamMember',
  {
    teamId: { type: DataTypes.INTEGER },
    userId: { type: DataTypes.INTEGER }
  },
  { freezeTableName: true }
);

Team.sync({ force: true })
  .then(() => {
    console.log('Team table synced successfully.');
  })
  .catch(err => {
    console.error('Error syncing Team table:', err);
  });

TeamLeader.sync({ alter: true })
  .then(() => {
    console.log('TeamLeader table synced successfully.');
  })
  .catch(err => {
    console.error('Error syncing TeamLeader table:', err);
  });

TeamMember.sync({ alter: true })
  .then(() => {
    console.log('TeamMember table synced successfully.');
  })
  .catch(err => {
    console.error('Error syncing TeamMember table:', err);
  });

module.exports = { Team, TeamLeader, TeamMember };
