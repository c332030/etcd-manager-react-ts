/**
 * <p>Description: </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-12 16:25
 */

export const log = console.log;

export const trace = console.trace;
export const debug = console.debug;
export const info = console.info;
export const warn = console.warn;
export const error = console.error;

/**
 * 工具类
 */
export class Tools{

  protected constructor(){}

  /**
   * 是否存在 document 变量
   */
  public static hasDocument(): boolean {
    return typeof document !== 'undefined';
  }

  /**
   * 是否存在 window 变量
   */
  public static hasWindow(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * 判断是否为空
   * @param obj
   */
  public static isNull(obj: any | null | undefined): boolean {
    return obj === undefined || obj === null;
  }

  /**
   * 判断是否为空
   * @param obj
   */
  public static isEmpty(obj: any): boolean {
    return isNull(obj) || obj === '';
  }

  /**
   * 处理空值
   * @param obj
   * @param defaultValue
   */
  public static dealNull<E>(obj: E | undefined | null, defaultValue: E): E {
    return isNull(obj) ? defaultValue : <E>obj;
  }

  /**
   * 处理空值
   * @param obj
   * @param defaultValue
   */
  public static dealEmpty<E>(obj: E | null | undefined, defaultValue: E): E {
    return isEmpty(obj) ? defaultValue : <E>obj;
  }

  /**
   *
   * @param obj
   * @param msg
   */
  public static notNull(obj: any, msg: string = 'Not null') {
    if(isNull(obj)) {
      throw new Error(msg);
    }
  }

  /**
   *
   * @param obj
   * @param msg
   */
  public static notEmpty(obj: any, msg: string = 'Not empty') {
    if(isEmpty(obj)) {
      throw new Error(msg);
    }
  }

  /**
   * 获取值，不允许为空
   * @param obj 对象
   * @param key 值
   * @param defaultValue 默认值
   */
  public static get<E>(
    obj: any
    ,key: string
    ,defaultValue: E
  ): E {

    if(!obj || !key) {
      return defaultValue;
    }

    const keySpilt = key.split('.');

    let objTmp = obj;
    for(const keyTmp of keySpilt) {

      if(isEmpty(keyTmp)) {
        return defaultValue;
      }

      objTmp = objTmp[keyTmp];
      if(isNull(objTmp)) {
        return defaultValue;
      }
    }

    return objTmp;
  }

  /**
   * 允许为空的 get
   * @param obj
   * @param key
   */
  public static getNullable<E>(
    obj: any
    ,key: string
  ):E | undefined {
    return Tools.get(obj, key, undefined);
  }

  /**
   * 深拷贝
   * @param url
   */
  public static clone(url: any): any {
    return JSON.parse(JSON.stringify(url));
  }
}

export const get = Tools.get;
export const getNullable = Tools.getNullable;

export const isNull = Tools.isNull;
export const isEmpty = Tools.isEmpty;

export const notNull = Tools.notNull;
export const notEmpty = Tools.notEmpty;

export const dealNull = Tools.dealNull;
export const dealEmpty = Tools.dealEmpty;
