module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      role: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        isEmail: true,
        unique: true
      },
      vendorId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {}
  );
  User.associate = (models) => {
    User.belongsToMany(models.Role, {
      through: 'roleUsers',
      as: 'role',
      foreignKey: 'userId'
    });
  };
  return User;
};
