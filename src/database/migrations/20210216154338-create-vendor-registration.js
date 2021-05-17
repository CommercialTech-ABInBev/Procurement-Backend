module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('VendorRegistrations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    jobId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'JobFunctions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    vendorName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    industry: {
      type: Sequelize.STRING,
      allowNull: true
    },
    services: {
      type: Sequelize.STRING,
      allowNull: true
    },
    vendorType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    vendorJustification: {
      type: Sequelize.TEXT,
      allowNull: true,
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
    approvalStatus: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    approvedBy: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
  down: (queryInterface) => queryInterface.dropTable('VendorRegistrations')
};
