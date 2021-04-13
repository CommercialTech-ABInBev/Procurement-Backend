'use strict';
module.exports = (sequelize, DataTypes) => {
  const VendorRegistration = sequelize.define('VendorRegistration', {
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'JobFunction',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    vendorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    services: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vendorType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vendorJustification: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    approvalStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {});
  VendorRegistration.associate = function(models) {
    VendorRegistration.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
    VendorRegistration.belongsTo(models.User, {
      as: 'manager',
      foreignKey: 'approvedBy'
    });
    VendorRegistration.belongsTo(models.JobFunction, {
      as: 'units',
      foreignKey: 'jobId'
    });
  };
  return VendorRegistration;
};
