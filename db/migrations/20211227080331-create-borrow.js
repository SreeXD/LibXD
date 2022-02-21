'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('borrows', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true, 
        autoIncrement: true
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true
      },
      admNo: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      isbn: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true
      },
      borrowDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      dueDate: {
        allowNull: false,
        type: Sequelize.DATE
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

    await queryInterface.addIndex('borrows', [ 'userId', 'dueDate', 'id' ])
    await queryInterface.addIndex('borrows', [ 'userId', 'admNo', 'dueDate', 'id' ])
    await queryInterface.addIndex('borrows', [ 'userId', 'isbn', 'dueDate', 'id' ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('borrows');
  }
};