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
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {}
  );
  User.associate = (models) => {
    User.hasOne(models.VendorDetail, {
      as: 'user',
      foreignKey: 'userId'
    });
    User.hasMany(models.Notification, {
      as: 'users',
      foreignKey: 'userId'
    });
  };
  return User;
};
