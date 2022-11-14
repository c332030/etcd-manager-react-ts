/**
 * <p>
 *   Description: TreeState
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-22 11:42
 */

/**
 * Tree 结构中节点属性
 */
export interface TreeOptions {

  /**
   * 描述当前节点的变量名称
   */
  label?: string

  /**
   * 数据中子节点
   */
  children?: string,
}

export interface TreeEntity {

  data?: any

  options?: any
}
