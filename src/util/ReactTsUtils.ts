
import {Notification} from "element-react";

import {
  debug
  ,get
  ,getNullable
} from '@c332030/common-utils-ts'

/**
 * <p>
 *   Description: ReactTsUtils
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-31 9:52
 */
export class ReactTsUtils {

  /**
   * 处理错误
   * @param error
   */
  public static handleError(error: any){

    debug([error]);

    if(typeof error === 'string') {
      Notification.error(error);
      return;
    }

    const response = error.response;
    if(response) {
      error = response;
    }

    let msg: string | undefined = getNullable(error, 'message');

    if(!msg) {
      msg = getNullable(error, 'data.message');
    }

    if(!msg) {
      msg = get(error, 'Notification', '通讯发生异常');
    }

    Notification.error(msg);
  }
}

export const handleError = ReactTsUtils.handleError;
