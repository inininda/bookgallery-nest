import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
  HasMany,
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';

import { BaseModel } from './base.model';

@Table({
  tableName: 'Users',
  timestamps: false,
})
export class User extends BaseModel {
  @Column({
    allowNull: true,
    type: DataType.STRING(255),
  })
  name?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(255),
  })
  username?: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(255),
    unique: true,
  })
  @Index({ unique: true, name: 'email', using: 'BTREE', order: 'ASC' })
  email?: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(255),
  })
  password?: string;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
    unique: true,
  })
  phone?: number;

  @Column({
    allowNull: true,
    type: DataType.DATEONLY,
  })
  date_of_birth?: Date;

  @Column({
    allowNull: true,
    type: DataType.STRING(255),
  })
  address?: string;
}
