
import {EtcdNode} from "../entity";

/**
 * <p>
 *   Description: EtcdService
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-30 17:13
 */
export class EtcdUtils {

  /**
   * 是否是根节点
   * @param node
   */
  public static isRoot(node: EtcdNode | string): boolean {

    if(typeof node === 'string') {
      return node === '/';
    }

    return node.key === '/';
  }

  /**
   * 是否是目录
   * @param node
   */
  public static isDir(node: EtcdNode): boolean {
    return node.dir || EtcdUtils.isRoot(node);
  }

  /**
   * 获取启用排序的 url
   * @param url
   */
  public static getSortUrl(url: string): string{
    if(!url) {
      throw new Error('链接不存在');
    }

    return url + '?sorted=true';
  }

  /**
   * 节点排序
   * @param nodes
   */
  // public static sort(nodes: Array<EtcdNode>) {
  //   nodes.sort((node1: EtcdNode, node2: EtcdNode) => {
  //     return (node1.key as string).localeCompare(node2.key  as string);
  //   });
  // }

  /**
   * 操作目录
   * @param key
   */
  public static operateDir(key: string): string {
    return key + '?dir=true';
  }

  /**
   * 过滤目录节点和数据节点
   * @param nodes
   */
  public static filterDirAndDataNodes(nodes: Array<EtcdNode>): Array<Array<EtcdNode>> {
    const dirNodes: Array<EtcdNode> = [];
    const dataNodes: Array<EtcdNode> = [];

    nodes.forEach((node:EtcdNode) => {

      if(EtcdUtils.isDir(node)) {
        dirNodes.push(node);
      } else {
        dataNodes.push(node);
      }
    });

    return [dirNodes, dataNodes];
  }

  /**
   * 过滤数据节点，返回目录节点
   * @param nodes
   */
  public static filterDirNodes(nodes: Array<EtcdNode>): Array<EtcdNode>{
    return this.filterDirAndDataNodes(nodes)[0];
  }

  /**
   * 过滤目录节点，返回数据节点
   * @param nodes
   */
  public static filterDataNodes(nodes: Array<EtcdNode>): Array<EtcdNode>{
    return this.filterDirAndDataNodes(nodes)[1];
  }
}
