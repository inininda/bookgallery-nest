import { BusinessException } from 'src/util/BusinessException';
import { User } from 'src/model/user.entity';
function buildRepository(provide: string, model: any): any {
  return {
    provide: provide,
    useValue: model,
  };
}
export const UserRepository = buildRepository('USER_REPOSITORY', User);
export const repositories = [UserRepository];
