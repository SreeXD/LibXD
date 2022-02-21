'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    
    }
  };
  userBook.init({
    userId: {
      type: DataTypes.STRING,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    isbn: { 
      type: DataTypes.STRING,
      references: {
        model: 'books',
        key: 'isbn'
      }
    },
    nCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userBook',
    indexes: [
      {
        fields: [ 'userId', 'isbn' ]
      }
    ]
  });
  return userBook;
};