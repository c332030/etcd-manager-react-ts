import {HttpMethodEnum, HttpSchemeEnum} from "enums";

/**
 * <p>
 *   Description: Url
 *
 *  [协议名]://[用户名]:[密码]@[主机名]:[端口]/[路径]?[查询参数]#[片段ID]
 *
 *  [scheme]://[username]:[password]@[host]:[port]/[path]?[query]#[fragment]
 *
 * </p>
 * @author c332030
 * @version 1.0
 * @date 2019-11-16 10:12
 */


export interface UrlConfig {

  /**
   * 协议 http / https
   */
  scheme: HttpSchemeEnum

  /**
   * 用户名
   */
  username?: string

  /**
   * 密码
   */
  password?: string

  /**
   * 主机名
   */
  host: string

  /**
   * 端口
   */
  port?: number

  /**
   * 主机下地址
   */
  path?: string

  /**
   * get 参数
   */
  query?: Map<string, string>

  /**
   * 片段 id
   */
  fragment?: string
}
