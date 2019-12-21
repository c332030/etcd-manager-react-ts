
import {
  get
  ,debug
  , isArrNotEmpty
} from '@c332030/common-utils-ts'

import {
  axiosGet
  ,axiosPut
  ,axiosDelete
  ,EtcdUtils
} from "../util";

import {EtcdNode} from "../entity";
import {EtcdNodeBo} from "../entity/bo/EtcdNodeBo";


/**
 * <p>
 *   Description: EtcdService
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-31 10:34
 */

export class EtcdService {

  /**
   * 列出目录树
   * @param url
   */
  public static list(url: string): Promise<any> {

    if(!url) {
      return Promise.reject('链接为空');
    }

    return axiosGet(EtcdUtils.getSortUrl(url)).then(e => {

      let nodes: EtcdNodeBo[] = get(e, 'data.node.nodes', []);

      if(nodes.length > 0) {
        nodes = EtcdUtils.filterDirNodes(nodes);

        nodes.forEach(node => {
          node.label = node.key ? node.key.substr(1) : 'No key'
        });
      }

      const root: EtcdNodeBo = {
        key: '/'
        , label: '/'
        , dir: true
        , nodes: nodes
      };

      return Promise.resolve([root]);
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  /**
   * 加载节点
   * @param url
   * @param node
   */
  public static listNode(url: string, node: EtcdNode): Promise<any> {

    const { key } = node;

    if(!key) {
      return Promise.reject('节点 key 为空');
    }

    return axiosGet(EtcdUtils.getSortUrl(url + key)).then(e => {

      const childNodes: EtcdNodeBo[] = get(e, 'data.node.nodes', []);

      // 删除树已有的前缀
      childNodes.forEach(nodeE => {
        const keyE = nodeE.key;
        if(!keyE) {
          return;
        }

        let index;

        if(EtcdUtils.isRoot(node)) {
          index = 1;
        } else {
          index = key.length + 1;
        }

        // 处理 key 生成 label，避免 key 太长，使用 label 显示
        nodeE.label = keyE.substr(index);
      });

      return Promise.resolve(childNodes);
    });
  }

  /**
   * 修改
   * @param node
   * @param force
   */
  public static delete(node: EtcdNodeBo, force?: boolean): Promise<any> {

    // debug('delete');
    // debug(node);

    if(!node) {
      return Promise.reject('节点不存在');
    }

    const { url, dir } = node;
    let { key } = node;

    if(!url) {
      return Promise.reject('链接为空');
    }

    if(!key) {
      return Promise.reject('key 为空');
    }

    if(dir) {
      key = EtcdUtils.operateDir(key, force);
    }

    return axiosDelete(url + key).then(res => {

      const action: string = get(res, 'data.action', '');

      // log(`action=${action}`);

      if('delete' !== action) {
        return Promise.reject(res);
      }

      return Promise.resolve(res);
    });
  }

  /**
   * 压值
   * @param url
   * @param value
   */
  private static put(url: string, value?: string): Promise<any> {

    return axiosPut(url , `value=${encodeURIComponent(value as string)}`).then(res => {

      const action: string = get(res, 'data.action', '');
      const resValue: string = get(res, 'data.node.value', '');

      if(
        (value && resValue !== value)
        || 'set' !== action
      ) {
        return Promise.reject('操作失败');
      }

      return Promise.resolve('操作成功');
    });
  }

  /**
   * 添加
   * @param node
   * @param newKey
   * @param value
   * @param operateDir
   */
  public static add(node?: EtcdNodeBo, newKey?: string, value?: string, operateDir: boolean = false) {

    if(!node) {
      return Promise.reject('节点不存在');
    }

    const { url } = node;
    let { key } = node;

    if(!key) {
      return Promise.reject('key 为空');
    }

    if(!newKey) {
      return Promise.reject('新 key 为空');
    }

    if(EtcdUtils.isRoot(node)) {
      key += newKey;
    } else {
      key += '/' + newKey;
    }

    if(operateDir) {
      key = EtcdUtils.operateDir(key);
    }

    return EtcdService.put(url + key, value);
  }

  /**
   * 修改
   * @param node
   * @param value
   */
  public static update(node?: EtcdNodeBo, value?: string) {

    if(!node) {
      return Promise.reject('节点不存在');
    }

    const { url, key } = node;

    if(!url) {
      return Promise.reject('链接为空');
    }

    if(!key) {
      return Promise.reject('key 为空');
    }

    return EtcdService.put(url + key, value);
  }
}
