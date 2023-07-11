import { Inject, Injectable } from '@nestjs/common';
import { UsersRequest } from './users.request';
import { JWT } from 'src/util/jwt';
import { Auth } from 'src/auth/authorization.util';
import { User } from 'src/model/user.entity';
import { UserRoles } from 'src/model/user.roles.entity';
import { ObjectType } from 'src/util/types';
import { BusinessException } from 'src/util/BusinessException';
import _ from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
    @Inject('USER_ROLES_REPOSITORY')
    private userRolesRepository: typeof UserRoles,
    private readonly jwt: JWT,
  ) {
    this.auth = new Auth(this.jwt, User, UserRoles);
  }
  auth: any;
  async getUserActive(req: any): Promise<any> {
    try {
      const jwtParams = req.headers.authorization;
      const verifyJWT = await this.auth.verify(jwtParams);

      const getUser = await this.userRepository.findOne({
        where: { id: verifyJWT?.credentials.id },
      });
      let getUserData = JSON.parse(JSON.stringify(getUser));
      if (!getUserData) {
        throw new BusinessException('Profile not found!');
      }
      const finalResult = {};
      Object.keys(getUserData).forEach((prop) => {
        if (ObjectType.expect(getUserData[prop], ObjectType.Array)) {
          finalResult[prop] = getUserData[prop].map((item) =>
            _.omit(item, [
              'profile_id',
              'createdAt',
              'created_at',
              'updatedAt',
              'updated_at',
            ]),
          );
        } else if (ObjectType.expect(getUserData[prop], ObjectType.Object)) {
          finalResult[prop] = _.omit(getUserData[prop], [
            'profile_id',
            'createdAt',
            'created_at',
            'updatedAt',
            'updated_at',
          ]);
        } else {
          if (prop !== 'password' && prop !== 'id') {
            finalResult[prop] = getUserData[prop];
          }
        }
      });
      return finalResult;
    } catch (error) {
      throw error;
    }
  }
}
