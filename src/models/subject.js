'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {});
  Subject.associate = function(models) {
    // Message.belongsTo(models.Notification, {
    //   as: 'singleMmessage',
    //   foreignKey: 'subjectId'
    // });
  };
  return Subject;
};