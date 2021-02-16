'use strict';
module.exports = (sequelize, DataTypes) => {
  const VendorRegistration = sequelize.define('VendorRegistration', {
    jobFunction: {
      type: DataTypes.STRING,
      allowNull: false,
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
  }, {});
  VendorRegistration.associate = function(models) {
    // associations can be defined here
  };
  return VendorRegistration;
};