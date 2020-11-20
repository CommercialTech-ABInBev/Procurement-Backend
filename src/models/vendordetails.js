module.exports = (sequelize, DataTypes) => {
  const VendorDetail = sequelize.define('VendorDetail', {
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
    approvalStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    vendorId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    companyAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    companyLocation: {
      type: DataTypes.STRING,
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
    companyPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    companyEmail: {
      type: DataTypes.STRING,
      isEmail: true,
      allowNull: true,
      unique: true
    },
    mediaUrls: {
      type: DataTypes.STRING,
      allowNull: true
    },
    similarVendors: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {});
  VendorDetail.associate = function(models) {
    VendorDetail.belongsTo(models.User, {
      as: 'vendorDetails',
      foreignKey: 'userId'
    });
    VendorDetail.hasMany(models.VendorCategory, {
      as: 'vendorCategories',
      foreignKey: 'vendorId'
    });
    VendorDetail.hasMany(models.Media, {
      as: 'vendorDetailImage',
      foreignKey: 'vendorDetailsId'
    });
    VendorDetail.hasMany(models.Location, {
      as: 'locations',
      foreignKey: 'vendorDetailsId'
    });
  };
  return VendorDetail;
};
