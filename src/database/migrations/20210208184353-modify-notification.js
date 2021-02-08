module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Notifications', 'imageUrl', {
    type: Sequelize.STRING,
    allowNull: true
  }),
  down: (queryInterface) => queryInterface.removeColumn('Notifications', 'imageUrl')
};
