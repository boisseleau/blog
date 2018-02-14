'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    admin: {
        type: DataTypes.BOOLEAN,
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

    User.associate = (models) => {
        User.hasMany(models.Billet, {
            foreignKey: 'userId',
            as: 'billets',
        });
    };
    User.associate = (models) => {
        User.hasMany(models.Comments, {
            foreignKey: 'userId',
            as: 'comments',
        });
    };
  return User;
};