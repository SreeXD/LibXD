'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.author, { through: models.bookAuthor, foreignKey: 'isbn' })
      this.belongsToMany(models.user, { through: models.userBook, foreignKey: 'isbn' })
    }
  };
  book.init({
    isbn: {
      type: DataTypes.STRING,
      primaryKey: true
    },

    title: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'book',
    indexes: [
      {
        fields: [ 'title' ]
      }
    ]
  });
  return book;
};