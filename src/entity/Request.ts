/**
 * <p>
 *   Description: Request
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-17 10:29
 */

import {
  RequestHead
} from './request/';

export interface Request {

  head: RequestHead,

  body?: any
}
