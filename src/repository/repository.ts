import { BusinessException } from 'src/util/BusinessException';
import { User } from 'src/model/user.entity';
import { UserRoles } from 'src/model/user.roles.entity';
function buildRepository(provide: string, model: any): any {
  return {
    provide: provide,
    useValue: model,
  };
}
export const UserRepository = buildRepository('USER_REPOSITORY', User);
export const UserRolesRepository = buildRepository('USER_ROLES_REPOSITORY', UserRoles);
export const repositories = [UserRepository, UserRolesRepository];
