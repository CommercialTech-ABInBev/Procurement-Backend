module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Vendor',
    {
      vendorId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  // eslint-disable-next-line no-unused-vars
  Role.associate = (models) => {
  };
  return Role;
};
