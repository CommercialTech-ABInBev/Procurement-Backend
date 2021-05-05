module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Subjects', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    subject: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    vendor: {
      type: Sequelize.STRING,
      allowNull: true
    },
    adminRead: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    vendorRead: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('Subjects')
};
