module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
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
  Location.associate = (models) => {
    Location.belongsTo(models.VendorDetail, {
      as: 'location',
      foreignKey: 'vendorDetailsId'
    });
  };
  return Location;
};
