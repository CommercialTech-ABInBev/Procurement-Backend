module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
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
    password: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      isEmail: true,
      unique: true
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    vendorId: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    supplier: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    companyAddress: {
      type: Sequelize.TEXT,
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
    verifiedCompany: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    companyPhoneNumber: {
      type: Sequelize.STRING,
      allowNull: true
    },
    companyUrl: {
      type: Sequelize.STRING,
      allowNull: true
    },
    companyEmail: {
      type: Sequelize.STRING,
      isEmail: true,
      allowNull: true,
      unique: true
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
  down: (queryInterface) => queryInterface.dropTable('Users')
};
