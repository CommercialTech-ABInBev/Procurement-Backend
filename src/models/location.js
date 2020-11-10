'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vendorDetailsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'VendorDetail',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {});
  Location.associate = function(models) {
    Location.belongsTo(models.VendorDetail, {
      as: 'vendorDetailImages',
      foreignKey: 'vendorDetailsId'
    });
  };
  return Location;
};