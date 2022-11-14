/**
 * <p>
 *   Description: ReactUtils
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-26 15:20
 */
import {SyntheticEvent} from "react";
import {types} from "util";

/**
 * React Utils
 */
export class ReactUtils {

  /**
   * 转成字符串
   * @param value
   */
  public static getString(
    value: SyntheticEvent<HTMLInputElement, Event> | string | undefined
  ): string {

    if(value === undefined) {
      return '';
    }

    const typeStr = typeof value;

    if(typeStr === 'string') {
      return <string>value;
    }

    return typeStr;
  }
}
