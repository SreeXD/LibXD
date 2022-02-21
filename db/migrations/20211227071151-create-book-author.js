'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bookAuthors', {
      isbn: {
        type: Sequelize.STRING,
        references: {
          model: 'books',
          key: 'isbn'
        }
      },
      authId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'authors',
          key: 'id'
        }
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bookAuthors');
  }
};