/**
 * <p>
 *   Description: RequestHead
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-17 10:40
 */

import { Head } from '../Head';
import {UrlConfig} from "../UrlConfig";

/**
 * 报文体的头
 */
export interface RequestHead extends Head {

  method: string

  proxy ?: UrlConfig | null
}
