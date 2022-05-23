const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      // postId: {
      //   ref:'post',
      //   required: true
      // }
    
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    //user와 comment는 1:n 관계
    db.Comment.belongsTo(db.User, {foreignKey: "UserId", targetKey:'id'});
    //post와 comment는 1:n 관계
    db.Comment.belongsTo(db.Post, {foreignKey: "postId", targetKey:'id'});
    
  }
};
