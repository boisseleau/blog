'use strict';
const Comments = require('../models').Comments;
module.exports = (sequelize, DataTypes) => {
  const Billet = sequelize.define('Billet', {
    picture: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });


    Billet.associate = (models) => {
        Billet.hasMany(models.Comments, {
            foreignKey: 'billetId',
            as: 'comments',
        });
        Billet.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
    };
 
  return Billet;
};