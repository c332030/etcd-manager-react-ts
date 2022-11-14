/**
 * <p>
 *   Description: CookieUtils
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-8-7 19:45
 */

import {
  Tools
} from '.';

export class CookieUtils {

  /**
   * 获取所有 cookie
   */
  public static list(): Map<string, string> {

    const cookieMap = new Map<string, string>();

    if(!Tools.hasDocument()) {
      return cookieMap;
    }

    const cookies = document.cookie;

    if(!cookies) {
      return cookieMap;
    }

    cookies.split(';').forEach(cookie => {
      const cookieSplit = cookie.split('=');
      cookieMap.set(cookieSplit[0].trim(), cookieSplit[1].trim());
    });

    return cookieMap;
  }

  /**
   * 获取 cookie
   * @param key
   */
  public static get(key: string): string {
    if (!key) {
      return '';
    }

    const value = this.list().get(key.trim());

    return value ? value.trim() : '';
  }

  /**
   * 设置 cookie
   * @param key
   * @param value
   */
  public static set(key: string, value: string):boolean {
    if(!key) {
      return false;
    }

    if(!Tools.hasDocument()) {
      return false;
    }

    document.cookie = `${key.trim()}=${value.trim()}`;
    return true;
  }
}
