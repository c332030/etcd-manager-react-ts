/**
 * <p>
 *   Description: ArrayUtils
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-8-2 14:22
 */

export class ArrayUtils {

  public static isEmpty(arr?: Array<any>):boolean {
    return arr ? arr.length === 0 : false;
  }

  public static isNotEmpty(arr?: Array<any>):boolean {
    return !ArrayUtils.isEmpty(arr);
  }
}

export const isArrEmpty = ArrayUtils.isEmpty;
export const isArrNotEmpty = ArrayUtils.isEmpty;
