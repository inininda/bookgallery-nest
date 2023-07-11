'use strict';

const { UpdatedAt } = require('sequelize-typescript');

//npx sequelize-cli migration:generate --name create_user_roles_table.js
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    return queryInterface.createTable(
      'User_Roles',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.BIGINT.UNSIGNED,
        },
        user_id: {
          allowNull: true,
          type: DataTypes.BIGINT.UNSIGNED,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'NO ACTION',
        },
        role: {
          allowNull: false,
          type: DataTypes.STRING,
          defaultValue: 'ANYONE',
        },
        createdAt: {
          allowNull: false,
          type: 'TIMESTAMP',
          defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
        UpdatedAt: {
          allowNull: false,
          type: 'TIMESTAMP',
          defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
          field: 'updated_at',
        },
      },
      {
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'UserRoles__Users_id__fk',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
        ],
      },
    );
  },

  async down(queryInterface, Sequelize, done) {
    return await queryInterface.dropTable('User_Roles').nodeify(done);
  },
};
