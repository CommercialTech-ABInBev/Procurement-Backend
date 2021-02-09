'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {});
  Subject.associate = function(models) {
    // Subject.belongsToMany(models.User, {
    //   as: 'user',
    //   through: 'Notification',
    //   foreignKey: 'subjectId'
    // });
    Subject.hasMany(models.Notification, {
      as: 'message',
      foreignKey: 'subjectId'
    });
  };
  return Subject;
};