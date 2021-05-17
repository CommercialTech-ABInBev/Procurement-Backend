module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('VendorDetails', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    companyName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phoneNumber1: {
      type: Sequelize.STRING,
      allowNull: true
    },
    phoneNumber2: {
      type: Sequelize.STRING,
      allowNull: true
    },
    approvalStatus: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    vendorId: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    companyAddress: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    companyLocation: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    companyDescription: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    companyLogo: {
      type: Sequelize.STRING,
      allowNull: true
    },
    portfolioUrl: {
      type: Sequelize.STRING,
      allowNull: true
    },
    companyPhoneNumber: {
      type: Sequelize.STRING,
      allowNull: true
    },
    website: {
      type: Sequelize.STRING,
      allowNull: true
    },
    companyEmail: {
      type: Sequelize.STRING,
      isEmail: true,
      allowNull: true,
      unique: true
    },
    mediaUrls: {
      type: Sequelize.STRING,
      allowNull: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    similarVendors: {
      type: Sequelize.STRING,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('VendorDetails')
};
