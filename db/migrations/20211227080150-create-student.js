'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('students', {
      userId: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'userId'
        }
      },
      admNo: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      branch: {
        allowNull: false,
        type: Sequelize.STRING
      },
      batch: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('students', [ 'userId', 'name', 'admNo' ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('students');
  }
};