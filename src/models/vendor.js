module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define(
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
  Vendor.associate = (models) => {
  };
  return Vendor;
};
