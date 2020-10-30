module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {}
  );
  Category.associate = (models) => {
    Category.belongsToMany(models.VendorDetail, {
      through: 'vendorCategory',
      as: 'vendorDetails',
      foreignKey: 'categoryId'
    });
  };
  return Category;
};
