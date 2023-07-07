import { Column, DataType, Model } from 'sequelize-typescript';
import * as _ from 'lodash';

import { ObjectType } from '../util/types';
import { BusinessException } from '../util/BusinessException';

export class BaseModel extends Model {
  static async getById(filterPK: string | number): Promise<any> {
    return this.findByPk(filterPK).then((value) => {
      if (value == null) {
        throw new BusinessException('Record not found!');
      }
      return value;
    });
  }

  static async getOne(filters: any = {}): Promise<any> {
    return this.findOne({ where: filters }).then((value) => {
      if (value == null) {
        throw new BusinessException('Records not found!');
      }
      return value;
    });
  }

  static async getAll(filters: any = {}): Promise<any[]> {
    return this.findAll(filters).then((value) => {
      if (ObjectType.isEmpty(value)) {
        return [];
      }
      return value;
    });
  }

  /**
   * **add** - Async create record in DB
   * @param {object} [data={}]
   * @returns (Promise) Sequelize.Model | Error
   */
  static async add(data: any = {}): Promise<any> {
    return this.create(data).then((value) => {
      if (value == null) {
        throw new BusinessException('Records not created!');
      }
      return value;
    });
  }

  /**
   * **upd** - Async update record in DB
   * @param {object} [filters={}]
   * @param {object} [data={}]
   * @param {boolean} [forceInsert=false]
   * @returns (Promise) Sequelize.Model
   *
   * @memberOf Extended
   */
  static async upd(
    filters: any = {},
    data: any = {},
    forceInsert: boolean = false,
  ): Promise<any> {
    try {
      let result: any;
      if (!!filters) {
        let isExists = await this.findAll(filters);
        if (!!isExists && !ObjectType.isEmpty(isExists)) {
          result = await this.update(data, filters);
          if (!!result[0]) {
            result =
              result[0] === 1
                ? await this.findOne(filters)
                : this.findAll(filters);
          } else {
            result = new BusinessException('Error while updating record');
          }
        } else {
          result = forceInsert
            ? await this.create(data)
            : new BusinessException('Update failed to non-existing records');
        }
      } else {
        result = this.create(data);
      }
      return result;
    } catch (error) {
      console.log('Error while executing updOrAdd: ', error);
      return error;
    }
  }

  /**
   * **updById** - Async update record by id
   * @param {any} id
   * @param {object} [data={}]
   * @param {boolean} [forceInsert=false]
   * @returns (Promise) Sequelize.Model
   *
   * @memberOf Extended
   */
  static async updById(
    filterPKs: any = {},
    data: any = {},
    forceInsert: boolean = false,
  ) {
    try {
      let result: any;
      let ids: any = _.pick(filterPKs, this.primaryKeyAttributes);

      if (!ObjectType.isEmpty(ids)) {
        let isExists = await this.findAll(ids);
        if (!!isExists && !ObjectType.isEmpty(isExists)) {
          result = await this.update(data, ids);
          if (!!result[0]) {
            result =
              result[0] === 1 ? await this.findOne(ids) : this.findAll(ids);
          } else {
            result = new BusinessException('Error while updating record');
          }
        } else {
          result = forceInsert
            ? await this.create(data)
            : new BusinessException('Update failed to non-existing records');
        }
      } else {
        result = this.create(data);
      }
      return result;
    } catch (error) {
      console.log('Error while executing updById: ', error);
      return error;
    }
  }

  /**
   * **bulk** - Async bulk create/update record in DB
   * @param {array} [data=[]]
   * @param {object} [options={}]
   * @returns (Promise) Sequelize.Model
   *
   * Bulk Create just pass array of records to create
   *
   * Bulk Update required pass array of records to update and options:
   * {
   *    updateOnDuplicate: ["fieldNameToUpdate",...],
   * }
   *
   * @memberOf Extended
   */
  static async updBulk(data: Array<any> = [], options: any = {}): Promise<any> {
    try {
      const result = this.bulkCreate(
        data,
        _.merge({}, ObjectType.isEmpty(options) ? {} : options),
      );
      return result;
    } catch (err) {
      throw new BusinessException(
        err.message || 'Error while bulk updating records',
      );
    }
  }

  /**
   * **del** - Async delete records in DB
   * @param {object} [where={}]
   * @param {object} [options={}]
   * @returns (Promise) Sequelize.Model
   *
   * @memberOf Extended
   */
  static async del(where: any = {}, options: any = {}): Promise<any> {
    try {
      const result = await this.destroy(
        _.merge(ObjectType.isEmpty(where) ? null : { where: where }, options),
      );
      return result;
    } catch (err) {
      throw new BusinessException(
        err.message || 'Error while deleting records',
      );
    }
  }

  /**
   * **delById** - Async delete record by id
   * @param {any} id
   * @param {object} [options={}]
   * @returns (Promise) Sequelize.Model
   *
   * @memberOf Extended
   */
  static async delById(id: string | number, options: any = {}): Promise<any> {
    try {
      const result = await this.destroy(_.merge({ where: { id } }, options));
      return result;
    } catch (err) {
      throw new BusinessException(
        err.message || 'Error while deleting a record',
      );
    }
  }

  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  created_at!: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updated_at!: Date;
}
