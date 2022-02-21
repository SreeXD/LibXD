'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userBooks', {
      userId: {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'userId'
        }
      },
      isbn: { 
        type: Sequelize.STRING,
        references: {
          model: 'books',
          key: 'isbn'
        }
      },
      nCount: {
        type: Sequelize.INTEGER
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

    await queryInterface.addIndex('userBooks', [ 'userId', 'isbn' ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('userBooks');
  }
};