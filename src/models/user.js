module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber1: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneNumber2: {
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
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      vendorId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      supplier: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      companyAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      companyDescription: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      companyLogo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      portfolioUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      verifiedCompany: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      companyPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      companyUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mediaUrls: {
        type: DataTypes.STRING,
        allowNull: true
      },
      companyEmail: {
        type: DataTypes.STRING,
        isEmail: true,
        allowNull: true,
        unique: true
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
