/**
 * <p>
 *   Description: TopView
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-16 15:33
 */


import React from "react";
import {AutoComplete, Button, Input, Select} from "element-react";

import {
  isArrEmpty
  , debug
  , Tools
} from '@c332030/common-utils-ts'

import {
  HttpSchemeEnum
  , UrlConfig
  , UrlUtils
} from '@c332030/common-http-ts'

import {ViewComponentPropTypes} from "../../component";
import {EtcdConstants} from "../../model/constant";

interface StateTypes {
  url?: UrlConfig
  urlMap: Map<string, UrlConfig>
}

interface PropTypes extends ViewComponentPropTypes{
  listKey: Function
}

/**
 * 支持的 url 协议
 */
const SCHEMES = [
  HttpSchemeEnum.HTTP
  , HttpSchemeEnum.HTTPS
];

/**
 * host AutoCompile 填充包装接口
 */
export interface UrlFetchSuggest {

  /**
   * 展示的文字
   */
  value: string

  /**
   * 链接信息
   */
  url: UrlConfig
}

export class TopView extends React.Component<PropTypes, StateTypes> {

  state = {

    url: {
      scheme: HttpSchemeEnum.HTTP
      , host: 'localhost'
      , port: 2379
      , path: 'v2/keys'
    }

    , urlMap: new Map<string, UrlConfig>()
  };

  constructor(props: PropTypes) {
    super(props);

    this.listKey.bind(this);
    this.addUrlHistory.bind(this);

    this.props.setThis(this);

    // debug(CookieUtils.list());

    // const urlsJsonStr = CookieUtils.get(EtcdConstants.ETCD_URLS);
    const urlsJsonStr = localStorage.getItem(EtcdConstants.ETCD_URLS);

    if(!urlsJsonStr) {
      return;
    }

    const urlArr = JSON.parse(urlsJsonStr);
    if(isArrEmpty(urlArr)) {
      return;
    }
    debug('urlArr');
    debug(urlArr);

    urlArr.forEach((url: UrlConfig) => {
      this.state.urlMap.set(UrlUtils.getUrl(url), url);
    });

    const lastUrl: UrlConfig = urlArr[urlArr.length - 1];

    debug(`lastUrl= ${UrlUtils.getUrl(lastUrl)}`);

    const thisUrl = this.state.url;
    let url;

    if(lastUrl) {
      url = lastUrl;
    } else {
      return;
    }

    if(url) {
      const {
        scheme
        , host
        , port
        , path
      } = url;

      if(scheme) {
        thisUrl.scheme = scheme;
      }
      if(host) {
        thisUrl.host = host;
      }
      if(port) {
        thisUrl.port = port;
      }
      if(path) {
        thisUrl.path = path;
      }
    }
  }

  public listKey() {
    this.props.listKey(UrlUtils.getUrl(this.state.url));
  }

  /**
   * 添加输入历史
   */
  addUrlHistory() {

    const {
      url
      , urlMap
    } = this.state;
    const urlStr = UrlUtils.getUrl(url);

    debug(`urlStr: ${urlStr}`);

    urlMap.delete(urlStr);
    urlMap.set(urlStr, Tools.clone(url));

    let urlArr: UrlConfig[] = [];

    urlMap.forEach((url) => {
      urlArr.push(url);
    });

    localStorage.setItem(EtcdConstants.ETCD_URLS, JSON.stringify(urlArr));
    // CookieUtils.set(EtcdConstants.ETCD_URLS, JSON.stringify(urlArr));
  }

  querySearch(host?: string, resolve?: Function) {

    this.setState({
      url: Object.assign(this.state.url, {
        host: host
      })
    });

    if(!resolve) {
      return;
    }

    const {
      urlMap
    } = this.state;
    const entries = urlMap.entries();

    const arr: UrlFetchSuggest[] = [];

    let urlTemp;
    while ((urlTemp = entries.next().value)) {

      let [url, urlConfig] = urlTemp;

      if(!host || url.indexOf(host) > 0) {
        arr.push({
          value: url
          , url: urlConfig
        });
      }
    }

    resolve(arr.reverse());
  }

  render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div style={ this.props.style }>
        <AutoComplete
          placeholder="请输入内容"
          value={ this.state.url.host }
          style={{
            width: '20rem'
          }}
          prepend={
            <Select value={ this.state.url.scheme }
              style={{ width: '5rem' }}
              onChange={
                scheme => this.setState({
                  url: Object.assign(this.state.url, {
                    scheme: scheme
                  })
                })
              }
            >
              {
                SCHEMES.map((scheme, index) =>
                  <Select.Option key={index} label={scheme} value={scheme} />
                )
              }
            </Select>
          }
          fetchSuggestions={ this.querySearch.bind(this) }
          onSelect={(host: UrlFetchSuggest) => {
            this.setState({
              url: Tools.clone((host as UrlFetchSuggest).url)
            });
          }}
        />
        <span> : </span>
        <Input
          style={{
            width: '4rem'
          }}
          value={ this.state.url.port }
          onChange={ port => this.setState({
            url: Object.assign(this.state.url, {
              port: port
            })
          }) }
        />
        <span> / </span>
        <Input
          style={{
            width: '6rem'
          }}
          value={ this.state.url.path }
          onChange={ path => this.setState({
            url: Object.assign(this.state.url, {
              path: path
            })
          }) }
        />
        <span> </span>
        <Button type="primary" icon="search"
          onClick={ () => {
            this.listKey();
            this.addUrlHistory();
          }}
        >查询</Button>
      </div>
    );
  }
}
