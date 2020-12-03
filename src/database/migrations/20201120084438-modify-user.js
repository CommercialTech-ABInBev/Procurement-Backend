module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'verified', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }),
  down: (queryInterface) => queryInterface.removeColumn('Users', 'verified')
};
