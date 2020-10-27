module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Vendors', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    vendorId: {
      type: Sequelize.STRING,
      allowNull: false,
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
  down: (queryInterface) => queryInterface.dropTable('Vendors')
};
