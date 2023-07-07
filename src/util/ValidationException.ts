export class ValidationException extends Error {
  constructor(message: any, fieldName: any) {
    super(message);
    this.fieldName = fieldName;
  }
  fieldName: any;
}
