/**
 * <p>
 *   Description: LeftView
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-16 15:33
 */

import React from 'react';
import {
  Button
  , Input, MessageBox
  , Notification
  , Tree
} from "element-react";

import {
  isArrEmpty
  // , debug
} from '@c332030/common-utils-ts'

import {
  TreeOptions
} from '@c332030/common-element-ui-ts'

import {
  EtcdNode
} from "../../entity";

import {
  CenterView
} from "./CenterView";

import {EtcdService} from "../../service";
import {EtcdUtils, handleError} from "../../util";
import {EtcdNodeBo} from "../../entity/bo/EtcdNodeBo";
import {ViewComponentPropTypes, ViewComponentStateTypes} from "../../component";

/**
 * Prop 类型
 */
interface PropTypes extends ViewComponentPropTypes {
  center?: CenterView

  setReloadLeft: (fun: Function)=>void
}

interface StateTypes extends ViewComponentStateTypes {
  url: string

  expandKeys: Array<string>

  nodes: EtcdNodeBo[]
}

export class LeftView extends React.Component<PropTypes, StateTypes>{

  tree: Tree | null = null;

  options: TreeOptions = {
    label: 'label',
    children: 'nodes'
  };

  state: StateTypes = {
    url: ''
    , expandKeys: []
    , nodes: []
  };

  constructor(props: PropTypes){
    super(props);

    this.listKey.bind(this);

    this.props.setThis(this);
    this.props.setReloadLeft(this.reload.bind(this));
  }

  public reload() {
    this.listKey(this.state.url);
  }

  /**
   * 加载 key 树
   * @param url Edcd 链接
   */
  public listKey(url: string) {

    this.setState({
      url: url
    });

    const root: EtcdNodeBo = {
      key: '/'
      , label: '/'
      , dir: true
    };

    this.setState({
      nodes: [root]
    });
  }

  /**
   * 懒加载节点
   * @param data 节点
   * @param resolve 加载子节点的函数
   */
  public loadNode(data: any, resolve?: Function) {

    // debug('loadNode');
    // debug(data);

    const node: EtcdNodeBo = data.data;

    if(!node) {
      return;
    }

    if(!resolve) {
      if(node.resolve) {
        resolve = node.resolve;
      } else {
        throw new Error('resolve 不存在');
      }
    } else {
      node.resolve = resolve;
    }

    // debug('resolve');
    // debug(node.resolve);

    resolve([]);

    EtcdService.listNode(this.state.url, node).then(nodes => {

      const url = node.url;
      nodes.forEach((node: EtcdNodeBo) => {
        node.url = url;
      });

      const arr: Array<Array<EtcdNode>> = EtcdUtils.filterDirAndDataNodes(nodes);

      node.nodes = nodes;
      node.dirNodes = arr[0];
      node.dataNodes = arr[1];

      // @ts-ignore
      resolve(node.dirNodes);

      this.showNode(node);
    }).catch(() => {
      // @ts-ignore
      resolve([]);
    });
  }

  showNode(node: EtcdNodeBo) {

    const centerView = this.props.center;
    if(!centerView) {
      return
    }

    node.url = this.state.url;
    centerView.show(node);
  }

  /**
   * 添加节点
   * @param store
   * @param etcdNode 节点数据
   */
  append(store: any, etcdNode: EtcdNodeBo) {

    // debug('store');
    // debug(store);

    // debug('etcdNode');
    // debug(etcdNode);

    MessageBox.prompt('请输入名称', '添加子目录', {
      inputPattern: /[a-zA-Z0-9]{1,15}/
      , inputErrorMessage: '请输入以字母和数字组成的名称'
    }).then((value: any) => {

      this.props.loading(true);

      const label = value.value;

      EtcdService.add(etcdNode, label, '', true).then(() => {

        this.loadNode.call(this, {
          data: etcdNode
        });

        Notification.success(`新增目录成功：${label}`);
      }).catch(handleError).finally(() => {
        this.props.loading(false);
      });
    }).catch(() => {
      // debug('取消添加');
    });
  }

  remove(store: any, node: EtcdNodeBo) {
    // debug('remove');
    // debug(store);
    // debug(node);

    if(isArrEmpty(node.nodes)) {
      this.removeNode(store, node);
      return;
    }

    MessageBox.confirm('目录不为空，是否强制删除？').then(() => {
      this.removeNode(store, node, true);
    }).catch(() => {});
  }

  removeNode(store: any, node: EtcdNodeBo, force?: boolean) {

    this.props.loading(true);
    EtcdService.delete(node, force).then(() => {

      const centerView = this.props.center;

      store.remove(node);
      centerView && centerView.show();
      Notification.success(`删除目录成功：${node.label}`);
    }).catch(handleError).finally(() => {
      this.props.loading(false);
    });
  }

  renderContent(nodeModel: any, node: EtcdNodeBo, store: any) {

    // debug('nodeModel');
    // debug(nodeModel);
    // debug('data');
    // debug(node);
    // debug('store');
    // debug(store);

    return (
      <>
        <span>
          <span>{node.label}</span>
        </span>
        <span style={{float: 'right', marginRight: '20px'}}>
          <Button size="mini" onClick={ () => this.append(store, node) }>添加</Button>
          {
            EtcdUtils.isNotRoot(node) &&
            <Button size="mini" onClick={ () => this.remove(store, node) }>删除</Button>
          }
        </span>
      </>
    );
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    return (
      <div style={this.props.style}>
        <div>
          <Input placeholder="输入关键字进行过滤"
            onChange={ text => this.tree && this.tree.filter(text) }
          />
          <Tree
            style={{
              overflowY: 'auto'
              , maxHeight: 'calc(100vh - 13rem)'
            }}
            ref={e => this.tree = e}
            data={ this.state.nodes }
            options={ this.options }

            nodeKey="key"

            // 只展开一个
            accordion = { true }

            // 不默认展开所有
            defaultExpandAll={ false }

            // 高亮选中节点
            highlightCurrent={ true }

            // 默认展开的 key,Restful
            defaultExpandedKeys = { this.state.expandKeys }

            filterNodeMethod={(value, data) => {
              if(!value) return true;
              return data.key.indexOf(value) !== -1;
            }}

            lazy={ true }
            load={ this.loadNode.bind(this) }

            onNodeClicked={ this.showNode.bind(this) }
            renderContent={ this.renderContent.bind(this) }
          />
        </div>
      </div>
    );
  }
}
