/**
 * <p>
 *   Description: CenterView
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-16 16:26
 */
import React from "react";

import {
  Button, Card
  , Form
  , Notification
  , Switch
  , Table
} from "element-react";

import {
  debug
  ,isArrEmpty
} from '@c332030/common-utils-ts'

import {
  EtcdNode
} from '../../entity'

import ValueView from "./component/ValueView";

import {
  EtcdUtils,
  handleError,
} from "../../util";
import {EtcdService} from "../../service";

import AddView, {IAddView} from "./component/AddView";
import {EtcdNodeBo} from "../../entity/bo/EtcdNodeBo";
import {UpdateView} from "./component/UpdateView";
import {LeftView} from "./LeftView";
import {ViewComponentPropTypes} from "../../component";

/**
 * Prop 类型
 */
interface PropTypes extends ViewComponentPropTypes {

  reloadNode: Function

  left?: LeftView
}

/**
 * State 类型
 */
interface StateTypes {

  /**
   * 节点
   */
  node?: EtcdNodeBo

  /**
   * 是否需要转换 JSON
   */
  needFormatJson: boolean

  /**
   * 视图
   */
  view: {
    addView?: IAddView
  }
}

/**
 * 表格配置
 */
export class CenterView extends React.Component<PropTypes, StateTypes> {

  state: StateTypes = {
    node: {}
    , needFormatJson: true

    ,view: {}
  };

  tableConfig: any = {
    columns: [
      {
        type: 'expand'
        , expandPannel: (node: EtcdNodeBo) => {

          return (
            <>
              <UpdateView
                node={node}
                needFormatJson={this.state.needFormatJson}

                onUpdate={(value: string) => {

                  node.url = this.state.node && this.state.node.url;
                  EtcdService.update(node, value).then(() => {

                    this.reload.call(this, this.state.node);
                    Notification.success(`更新成功：${node.label}`);
                  }).catch(handleError);
                }}
              />
            </>
          )
        }
      }
      // , {
      //   type: 'index'
      //   , width: '500'
      // }
      , {
        label: '键'
        , prop: 'label'
        , width: '300'
      }
      , {
        label: '值'
        , prop: 'value'
        , minWidth: '400'
      }
      , {
        label: '操作'
        , value: 'key'
        , render: (node: EtcdNodeBo) => {

          // log(node);

          return (
            <>
              <Button type="danger" size="small" onClick={() => {
                node.url = this.state.node && this.state.node.url;

                EtcdService.delete(node).then(() => {

                  this.reload.call(this, this.state.node);
                  Notification.success(`删除成功：${node.label}`);
                }).catch(handleError);
              }}>删除</Button>
            </>
          )
        }
      }
    ]
  };

  constructor(props: PropTypes) {
    super(props);

    this.props.setThis(this);

    this.show.bind(this);
  }

  /**
   * 显示节点
   * @param node
   */
  show(node?: EtcdNode) {
    this.setState({
      node: node
    });
  }

  setAddView(addView: IAddView) {
    /* eslint-disable */
    this.state.view.addView = addView;
    /* eslint-enable */
  }

  reload(node?: EtcdNodeBo) {
    // this.setState({
    //   node: undefined
    // });
    // this.props.reload();

    const left = this.props.left;
    if(!left) {
      throw Error('leftView is not exist');
    }

    left.loadNode({
      data: node
    });
  }

  /**
   * 添加目录或节点
   * @param isDir
   */
  add(isDir: boolean = true) {
    this.state.view.addView && this.state.view.addView.display(true, isDir);
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {node} = this.state;

    if (!node || !node.key) {
      return (
        <Card style={this.props.style}>
          请选择节点
        </Card>
      );
    }

    return (
      <div style={this.props.style}>
        <AddView
          isJson={this.state.needFormatJson}
          setThis={ this.setAddView.bind(this) }
          onAdd={(key: string, value: string) => {
            EtcdService.add(this.state.node, key, value, false).then(() => {

              this.reload.call(this, this.state.node);
              Notification.success(`新增值成功：${key}`);
            }).catch(handleError);
          }}
        />
        <Card
          header={
            <>
              <div>
                <div style={{
                  margin: '0 0 1.5rem 0'
                }}>
                  {node.key}
                </div>

                <Button onClick={() => {
                  this.add(false)
                }}>添加值</Button>

                <Switch
                  value={this.state.needFormatJson}
                  onColor={"#13ce66"}
                  offColor={"#ff4949"}
                  onText={'JSON'}
                  offText={'字符串'}
                  width={75}
                  style={{
                    margin: '0 1rem'
                  }}
                  onChange={value => {
                    this.setState({
                      needFormatJson: !!value
                    })
                  }}
                />
              </div>
            </>
          }
        >
          {
            node.dataNodes && node.dataNodes.length > 0 &&
            <Table
              columns={this.tableConfig.columns}
              data={node.dataNodes}
            />
          }
        </Card>
      </div>
    );
  }
}
