module.exports = (sequelize, DataTypes) => {
  const VendorCategory = sequelize.define('VendorCategory', {
    subCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'VendorDetail',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Category',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {});
  VendorCategory.associate = function(models) {
    // associations can be defined here
  };
  return VendorCategory;
};