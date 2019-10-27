import React from "react";

import {
  Button
  , Dialog
  , Form
  , Input
  , Notification, Select, Switch
} from "element-react";

import {
  Tools
  ,debug
} from '@c332030/common-utils-ts'

import {
  KeyValueEnum
} from '@c332030/common-constant-ts'

import {
  ReactUtils
} from '@c332030/common-react-ts'
import ValueView from "./ValueView";




/**
 * Prop 类型
 */
interface PropTypes {

  isJson: boolean

  setThis: Function
  onAdd: Function
}

/**
 * State 类型
 */
interface StateTypes {

  /**
   * 是否可见
   */
  visible: boolean

  /**
   * 是否为目录
   */
  isDir?: boolean

  /**
   * 是否为 Json
   */
  isJson: boolean

  /**
   * 键
   */
  key: string

  /**
   * 值
   */
  value?: string

  /**
   * 更新值
   */
  updateValue?: Function
}

/**
 * 值视图接口
 */
export interface IAddView {
  display: Function
}

/**
 * <p>
 *   Description: AddView
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-8-5 17:04
 */
class AddView extends React.Component <PropTypes, StateTypes> {

  constructor(props: PropTypes){
    super(props);

    this.props.setThis({
      display: this.display.bind(this)
    });

    this.state = {

      visible: false

      ,key: ''

      ,isJson: false
    }
  }

  display(visible: boolean, isDir?: boolean) {
    this.setState({
      visible: visible
      ,isDir: isDir
    });
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {
      visible
      ,isDir

      ,key
      ,value
    } = this.state;

    return (
      <>
        <Dialog
          title="新增"
          size={'tiny'}
          visible={ visible }
          onCancel={ () => this.display.call(this, false) }
        >
          <Dialog.Body>
            {
              !this.state.isDir &&
              <Switch
                value={this.state.isJson}
                onColor={"#13ce66"}
                offColor={"#ff4949"}
                onText={'JSON'}
                offText={'字符串'}
                width={75}
                style={{
                  margin: '0 1rem'
                }}
                onChange={isJson => {
                  this.setState({

                    isJson: !!isJson
                  }, () => {

                    if(value && value !== '{}') {
                      return;
                    }

                    this.state.updateValue && this.state.updateValue(isJson ? '{}' : '');
                  });
                }}
              />
            }
            <Form >
              <Form.Item label={ Tools.get(KeyValueEnum, 'key', '键') }>
                <Input
                  value={key}
                  onChange={(value) => {
                    this.setState({
                      key: ReactUtils.getString(value)
                    })
                  }}
                />
              </Form.Item>
              {
                !isDir &&
                <ValueView
                  value={value}
                  needFormatJson={this.props.isJson}

                  setUpdate={(fun: Function) => {
                    this.setState({
                      updateValue: fun
                    });
                  }}
                  onChange={(value: string) =>{
                    this.setState({
                      value: value
                    });
                  }}
                />
              }
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ () => this.display.call(this, false) }>取 消</Button>
            <Button type="primary" onClick={ () => {

              const {isDir, key, value} = this.state;

              if(!key) {
                Notification.error(`请输入${Tools.get(KeyValueEnum, 'key', '键')}`);
                return;
              }

              if(!isDir && !value) {
                Notification.error(`请输入${Tools.get(KeyValueEnum, 'value', '值')}`);
                return;
              }

              this.props.onAdd(key, value, isDir);
              this.display.call(this, false)
            }}>确 定</Button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  }
}

export default AddView;
