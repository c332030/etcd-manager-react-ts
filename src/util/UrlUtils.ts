/**
 * <p>
 *   Description: UrlUtils
 * </p>
 * @author c332030
 * @version 1.0
 * @date 2019-11-16 10:28
 */
import {UrlConfig} from "entity";

export class UrlUtils {

  /**
   * 根据 UrlConfig 生成可用的 url
   * @param url
   */
  public static getUrl(url: UrlConfig): string {

    const {
      username
      , password
      , port
      , path
      , query
      , fragment
    } = url;

    let urlStr = `${url.scheme}://`;

    if(username) {
      urlStr += username;

      if(password) {
        urlStr += `:${password}`
      }

      urlStr += '@'
    }

    urlStr += url.host;

    if(port) {
      urlStr += `:${port}`
    }

    if(path) {
      urlStr += `/${path}`
    }

    if(query && query.size > 0) {

      urlStr += '?';

      const entries = query.entries();

      let [key, value] = entries.next().value;
      urlStr += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

      let entry;
      while ((entry=entries.next())) {
        let [key, value] = entry.value;
        urlStr += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
    }

    if(fragment) {
      urlStr += `#${fragment}`;
    }

    return urlStr;
  }
}
