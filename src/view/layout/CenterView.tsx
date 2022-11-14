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
  , Notification
  , Switch
  , Table
} from "element-react";

import {
  FileUtils
  , DateUtils
  // , debug
} from '../../util'

import {
  EtcdNode
} from 'entity'

import {
  handleError,
} from "../../util";

import {EtcdService} from "service";

import AddView, {IAddView} from "./component/AddView";
import {EtcdNodeBo} from "entity/bo/EtcdNodeBo";
import {UpdateView} from "./component";
import {LeftView} from "./LeftView";
import {ViewComponentPropTypes} from "component";
import {ImportView} from "./component/ImportView";

/**
 * Prop 类型
 */
interface PropTypes extends ViewComponentPropTypes {
  left?: LeftView

  reloadLeft: ()=>void
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

  /**
   * 导入页面是否显示
   */
  importViewVisible: boolean
}

/**
 * 表格配置
 */
export class CenterView extends React.Component<PropTypes, StateTypes> {

  state: StateTypes = {
    node: {}
    , needFormatJson: true

    ,view: {}
    , importViewVisible: false
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
        , width: '280'
      }
      , {
        label: '值'
        , prop: 'value'
        , minWidth: '350'
      }
      , {
        label: '操作'
        , value: 'key'
        , align: 'center'
        , width: '80'
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

    const left = this.props.left;
    if(!left) {
      throw Error('leftView is not exist');
    }

    this.show();

    left.loadNode({
      data: node
    });
  }

  reloadLeft() {
    this.show();
    this.props.reloadLeft();
  }

  /**
   * 添加目录或节点
   * @param isDir
   */
  add(isDir: boolean = true) {
    this.state.view.addView && this.state.view.addView.display(true, isDir);
  }

  /**
   * 导入
   */
  import() {
    this.setState({
      importViewVisible: true
    });
  }

  /**
   * 导出
   */
  export() {
    const node = this.state.node;

    if(!node) {
      Notification.info('无效节点');
      return;
    }

    this.props.loading(true);

    EtcdService.export(node).then((data) => {

      let name = node.label;
      if(name) {
        name.replace('/', '\\');
      } else {
        name = 'etcd'
      }

      FileUtils.str2txt(
        JSON.stringify(data, null, 2)
        , `${name}-${DateUtils.DateTimeFormat(new Date())}.json`
      );
    }).catch(handleError).finally(() => {
      this.props.loading(false);
    });
  }

  render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

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
          setThis={ this.setAddView.bind(this) }
          onAdd={(key: string, value: string) => {
            EtcdService.add(this.state.node, key, value, false).then(() => {

              this.reload.call(this, this.state.node);
              Notification.success(`新增值成功：${key}`);
            }).catch(handleError);
          }}
        />
        <ImportView
          visible={this.state.importViewVisible}
          node={ this.state.node }

          loading={this.props.loading}
          reload={this.reloadLeft.bind(this)}
          hide={ () => {
            this.setState({
              importViewVisible: false
            });
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

                <Button onClick={() => {
                  this.import.call(this)
                }}>导入</Button>

                <Button onClick={() => {
                  this.export()
                }}>导出</Button>

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
