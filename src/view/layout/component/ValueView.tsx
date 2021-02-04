import React from "react";

import {
  AutoComplete
  , Form
  , Input, Notification
} from "element-react";

import {
  Tools
  , dealStrNull
  , log
  , get
  // , debug
} from '@c332030/common-utils-ts'

import {
  KeyValueEnum
} from '@c332030/common-constant-ts'

import {
  ReactUtils
} from '@c332030/common-react-ts'

import {
  EtcdValue
} from '../../../entity'

/**
 * Prop 类型
 */
interface PropTypes {

  needFormatJson: boolean

  sync?: boolean

  value?: string

  onChange: Function

  setUpdate?: Function
}

/**
 * State 类型
 */
interface StateTypes {

  value?: string

  newKey?: string
  newValue?: string
}

/**
 * <p>
 *   Description: ValueView
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-25 17:45
 */
class ValueView extends React.Component <PropTypes, StateTypes> {

  constructor(props: PropTypes) {
    super(props);

    this.state = {
      value: dealStrNull(this.props.value)
    };

    this.props.setUpdate && this.props.setUpdate(this.updateValue.bind(this));
  }

  /**
   * 更新值
   * @param value
   */
  updateValue(value: string) {
    this.setState({
      value: value
    })
  }

  onChange(value: string) {
    this.props.onChange(value);
    this.updateValue.call(this, value);
  }

  onChangeOfJson(jsonValue: EtcdValue) {

    log(`jsonValue= ${JSON.stringify(jsonValue)}`);

    this.onChange.call(this, JSON.stringify(jsonValue));
  }

  /**
   * 普通字符串值类型的页面
   * @param value
   */
  getValuePage(value?: string) {
    return (
      <>
        <Form.Item
          label={Tools.get(KeyValueEnum, 'value', '值')}
        >
          <Input value={value as string}
            onChange={e => {
              this.onChange.bind(this)(ReactUtils.getString(e));
            }}
          />
        </Form.Item>
      </>
    )
  }

  querySearch(queryString?: string, resolve?: Function) {

    this.setState({
      newKey: queryString
    });

    if(!resolve) {
      return;
    }

    const arr: any = [];
    const jsonValue = this.state.value && JSON.parse(this.state.value);

    Object.keys(KeyValueEnum).forEach((key: string) => {
      const value: string = get(KeyValueEnum, key, '');

      if(jsonValue && (Object.keys(jsonValue)).indexOf(key) >= 0){
        return
      }

      if(queryString
        && key.indexOf(queryString) === -1
        && value.indexOf(queryString) === -1
      ) {
        return;
      }

      arr.push({
        value: key
        , comment: value
      });
    });

    resolve(arr);
  }

  /**
   * json类型值的页面
   * @param jsonValue
   */
  getJsonValuePage(jsonValue: any) {

    const {
      newKey
      ,newValue
    } = this.state;

    return (
      <>
        {
          Object.keys(jsonValue).map((key: string) => {
            return (
              <Form.Item
                key={key}
                label={Tools.get(KeyValueEnum, key, key)}
              >
                <Input
                  value={jsonValue[key]}
                  onChange={(e) => {
                    jsonValue[key] = ReactUtils.getString(e);
                    this.onChangeOfJson.call(this, jsonValue);
                  }}
                  prepend={key}
                  append={
                    <i className={'el-icon-delete'} onClick={() => {
                      delete jsonValue[key];
                      this.onChangeOfJson.call(this, jsonValue);
                    }}/>
                  }
                />
              </Form.Item>
            );
          })
        }

        <Form.Item label={'新增'}>
          <Input
            placeholder="请输入值"
            value={newValue}
            onChange={(value) => {

              if(!newKey) {
                return;
              }

              this.setState({
                newValue: ReactUtils.getString(value)
              });
            }}
            prepend={
              <AutoComplete
                placeholder="请输入键"
                value={newKey}
                style={{
                  width: '10rem'
                }}
                fetchSuggestions={this.querySearch.bind(this)}
                onSelect={(e: any) => {
                  this.setState({
                    newKey: e.value
                  });
                }}
              />
            }
            append={
              <i className={'el-icon-check'}
                onClick={() => {

                  if(!newKey || !newValue) {
                    Notification.warning('请输入新值');
                    return;
                  }

                  jsonValue[newKey] = newValue;
                  this.onChangeOfJson.call(this, jsonValue);

                  this.setState({
                    newKey: ''
                    ,newValue: ''
                  })
                }}
              />
            }
          />
        </Form.Item>
      </>
    );
  }

  render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const { value } = this.state;

    let jsonData;

    try {
      if (value
        && (
          value.indexOf('{') >= 0
          || value.indexOf('[') >= 0
        )
      ) {
        jsonData = JSON.parse(value);
      }
    } catch (e) {}

    return (
      <>
        {(this.props.needFormatJson && jsonData)
          ? this.getJsonValuePage.call(this, jsonData)
          : this.getValuePage.call(this, value)
        }
      </>
    );
  }
}

export default ValueView;
