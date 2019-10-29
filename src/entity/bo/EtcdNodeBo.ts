/**
 * <p>
 *   Description: EtcdNodeBo
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-8-6 8:56
 */
import {EtcdNode} from "../EtcdNode";

export interface EtcdNodeBo extends EtcdNode {

  /**
   * 链接
   */
  url?: string

  /**
   * 名字
   */
  label?: string

  /**
   * 子目录节点
   */
  dirNodes?: EtcdNode[]

  /**
   * 子数据节点
   */
  dataNodes?: EtcdNode[]

  /**
   * 加载子树的函数
   */
  resolve?: Function
}
