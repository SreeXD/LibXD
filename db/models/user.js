'use strict';

import bcrypt from 'bcryptjs'

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.student, { foreignKey: 'userId' })
      this.belongsToMany(models.book, { through: models.userBook, foreignKey: 'userId' })
    }
  };
  user.init({
    userId: { 
      type: DataTypes.STRING,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'user',

    hooks: {
      beforeCreate: async (user, options) => {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },

    indexes: [
      {
        fields: [ 'email' ],
        unique: true
      }
    ]
  });
  return user;
};