const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserApproval = sequelize.define('UserApproval', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  approvalToken: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'approval_token'
  },
  tokenExpires: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'token_expires'
  },
  requestedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'requested_at'
  },
  requestedBy: {
    type: DataTypes.INTEGER,
    field: 'requested_by'
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    field: 'approved_by',
    allowNull: true
  },
  approvedAt: {
    type: DataTypes.DATE,
    field: 'approved_at',
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'expired'),
    defaultValue: 'pending'
  },
  approvalNotes: {
    type: DataTypes.TEXT,
    field: 'approval_notes',
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    field: 'rejection_reason',
    allowNull: true
  }
}, {
  tableName: 'user_approvals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});


module.exports = UserApproval;