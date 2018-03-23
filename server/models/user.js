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
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    verif: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
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
            as: 'billet',
        });
        User.hasMany(models.Comments, {
            foreignKey: 'userId',
            as: 'comments',
        });
    };
   
  return User;
};