/**
 * <p>
 *   Description: ResponseHead
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-17 10:42
 */

import {Head} from '../Head';

import {ResponseHeadStatus} from './ResponseHeadStatus';

export interface ResponseHead extends Head {

  /**
   * 响应日期
   */
  responseDate: string

  /**
   * 响应时间
   */
  responseTime: string

  status: ResponseHeadStatus
}
