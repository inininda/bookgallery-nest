import { ObjectType } from './types';

export class BusinessException extends Error {
  constructor(messageOrError: any) {
    
    if (ObjectType.isEmpty(messageOrError)) {
      super('NullOrUndefinedKindOfError');
    } else {
      if (messageOrError instanceof Error) {
        super(messageOrError.message);
      } else if (ObjectType.expect(messageOrError, ObjectType.String)) {
        super(messageOrError);
      } else {
        super(JSON.stringify(messageOrError));
      }
    }
  }
}
