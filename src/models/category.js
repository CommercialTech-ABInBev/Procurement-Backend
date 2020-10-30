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
    // Category.belongsToMany(models.User, {
    //   through: 'UserCategory',
    //   as: 'users',
    //   foreignKey: 'userId'
    // });
  };
  return Category;
};