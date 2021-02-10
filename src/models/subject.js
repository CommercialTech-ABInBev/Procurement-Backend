'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vendor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    adminRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    vendorRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {});
  Subject.associate = function(models) {
    Subject.hasMany(models.Notification, {
      as: 'message',
      foreignKey: 'subjectId'
    });
  };
  return Subject;
};