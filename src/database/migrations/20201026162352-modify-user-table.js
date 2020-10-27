module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'mediaUrls', {
    type: Sequelize.STRING,
    allowNull: true
  }),
  down: (queryInterface) => queryInterface.removeColumn('Users', 'mediaUrls')
};
