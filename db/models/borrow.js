'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class borrow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  borrow.init({
    id: {
      type: DataTypes.INTEGER,
      unique: true
    },
    userId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    admNo: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    isbn: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    borrowDate: DataTypes.DATE,
    dueDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'borrow',
    indexes: [
      {
        fields: [ 'userId', 'dueDate', 'id' ]
      },
      {
        fields: [ 'userId', 'admNo', 'dueDate', 'id' ]
      },
      {
        fields: [ 'userId', 'isbn', 'dueDate', 'id' ]
      }
    ]
  });
  return borrow;
};