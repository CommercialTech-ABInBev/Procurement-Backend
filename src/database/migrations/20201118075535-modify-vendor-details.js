module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('VendorDetails', 'similarVendors', {
    type: Sequelize.STRING,
    allowNull: true
  }),
  down: (queryInterface) => queryInterface.removeColumn('VendorDetails', 'similarVendors')
};
