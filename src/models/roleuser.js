'use strict';
module.exports = (sequelize, DataTypes) => {
  const RoleUser = sequelize.define('RoleUser', {
    role: DataTypes.STRING
  }, {});
  RoleUser.associate = function(models) {
    // associations can be defined here
  };
  return RoleUser;
};