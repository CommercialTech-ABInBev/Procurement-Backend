module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define('Media', {
    imageUrl: {
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
  Media.associate = (models) => {
    Media.belongsTo(models.VendorDetail, {
      as: 'vendorDetailImages',
      foreignKey: 'vendorDetailsId'
    });
  };
  return Media;
};
