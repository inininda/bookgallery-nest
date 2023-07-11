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
  tableName: 'User_Roles',
  timestamps: false,
})
export class UserRoles extends BaseModel {
  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  @Index({
    name: 'user_id',
    using: 'BTREE',
    order: 'ASC',
    unique: false,
  })
  user_id?: string;
  @Column({
    allowNull: true,
    type: DataType.STRING(255),
  })
  role?: string;
}
