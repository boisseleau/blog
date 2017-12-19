'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define('Comments', {
    author: DataTypes.STRING,
    comment: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

    Comments.associate = (models) => {
        Comments.belongsTo(models.Billet, {
            foreignKey: 'billetId',
            onDelete: 'CASCADE',
        });
    };

    Comments.associate = (models) => {
        Comments.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
    };
  return Comments;
};