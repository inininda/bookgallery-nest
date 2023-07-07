'use strict';

const { UpdatedAt } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'Users',
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        username: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        phone: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: true,
          unique: true,
        },
        date_of_birth: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        address: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        createdAt: {
          field: 'created_at',
          type: 'TIMESTAMP',
          defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
        UpdatedAt: {
          field: 'updated_at',
          type: 'TIMESTAMP',
          defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
      },
      {
        freezeTableName: true,
        timestamps: true,
        underscored: true,
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
            name: 'email',
            using: 'BTREE',
            unique: true,
            fields: [{ name: 'email' }],
          },
        ],
      },
    );
  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable('Users');
  },
};
