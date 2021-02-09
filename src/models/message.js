'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Notification',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.Notification, {
      as: 'singleMmessage',
      foreignKey: 'subectId'
    });
  };
  return Message;
};