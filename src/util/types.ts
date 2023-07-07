export class ObjectType {
  static String = Symbol.for('string');
  static Number = Symbol.for('number');
  static Bool = Symbol.for('bool');
  static Object = Symbol.for('object');
  static Array = Symbol.for('array');
  static Function = Symbol.for('function');
  static Symbol = Symbol.for('symbol');
  static Error = Symbol.for('error');
  static Date = Symbol.for('date');
  static Null = Symbol.for('null');
  static Undefined = Symbol.for('undefined');

  constructor() {}

  public static of(obj) {
    return Symbol.for(
      {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase(),
    );
  }
  public static expect(obj, type) {
    return type === this.of(obj);
  }
  public static isEmpty(obj) {
    switch (this.of(obj)) {
      case this.String:
        return (
          !obj ||
          obj.length === 0 ||
          obj.trim().length === 0 ||
          obj === 'null' ||
          obj === 'undefined' ||
          obj === 'NaN' ||
          obj === 'Infinity' ||
          obj === '-Infinity' ||
          obj === '0' ||
          obj === '0.0' ||
          obj === 'false' ||
          obj === ''
        );
      case this.Number:
        return (
          !obj ||
          obj === 0 ||
          obj === 0.0 ||
          obj === -0.0 ||
          Number.isNaN(obj) ||
          obj === Infinity ||
          obj === -Infinity
        );
      case this.Bool:
        return !obj || obj === false;
      case this.Object:
        return !obj || Object.keys(obj).length === 0;
      case this.Array:
        return !obj || obj.length === 0;
      case this.Function:
        return !obj;
      case this.Symbol:
        return !obj;
      case this.Date:
        return !obj;
      case this.Null:
        return !obj;
      case this.Undefined:
        return !obj;
      default:
        return !obj;
    }
  }
  originStackName(stack) {
    const me = 'module.exports';
    let fid = stack
      .split('\n')
      .reduce((p, c) => (c.includes(me) ? c.trim() : p), '');
    return fid.substr(
      fid.search(me) + me.length + 1,
      fid.indexOf(' (') - fid.search(me) - me.length - 1,
    );
  }
}
