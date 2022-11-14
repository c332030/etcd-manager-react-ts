/**
 * <p>
 *   Description: StringUtils
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-22 10:24
 */

import {Tools} from './Tools'

export class StringUtils {

  protected constructor() {}

  /**
   * 是否是字符串
   * @param str
   */
  public static isString(str: any): boolean {
    return typeof str === 'string';
  }

  /**
   * 删除多余空格
   * @param str
   */
  public static trim(str: string): string{

    if(Tools.isEmpty(str)) {
      return '';
    }

    return str.trim();
  }

  public static dealNull(str: string | null | undefined): string {
    return str ? str : '';
  }
}

export const isString = StringUtils.isString;
export const dealStrNull = StringUtils.dealNull;
