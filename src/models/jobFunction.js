'use strict';
module.exports = (sequelize, DataTypes) => {
  const JobFunction = sequelize.define('JobFunction', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    directorEmail: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  JobFunction.associate = function(models) {
    // associations can be defined here
  };
  return JobFunction;
};