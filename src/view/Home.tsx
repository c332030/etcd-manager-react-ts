import React from 'react';

import {
  Card, Layout,
  Loading
} from 'element-react'

import 'element-theme-default';

import {
  TopView
  , LeftView
  , CenterView
} from './layout';

import {EtcdNode} from "../entity";

import {
  debug
} from '@c332030/common-utils-ts'
import { ViewComponentStateTypes} from "../component";

/**
 * Props 类型定义
 */
interface PropsTypes {

}

/**
 * State 类型定义
 */
interface StateTypes extends ViewComponentStateTypes{
  loading?: boolean

  top?: TopView
  left?: LeftView
  center?: CenterView
}

class Home extends React.Component<PropsTypes, StateTypes> {

  state: StateTypes = {
    loading: false
  };

  /**
   * 全屏加载页面
   * @param loading
   */
  loading(loading: boolean) {
    this.setState({
      loading: loading
    });
  }

  setTop(_this: TopView) {
    this.setState({
      top: _this
    });
  }

  setLeft(_this: LeftView) {
    this.setState({
      left: _this
    });
  }

  setCenter(_this: CenterView) {
    this.setState({
      center: _this
    });
  }

  listKey(url: string) {
    // console.log(`是吧 url= ${url}`);

    let left: LeftView | undefined = this.state.left;
    left && left.listKey(url);
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    return (
      <div>
        {this.state.loading && <Loading fullscreen={true}/>}
        <div
          style={{
            verticalAlign: 'top'
            // , width: '90%'
            // , height: '90vh'
            , margin: '2.5rem 2rem 1rem 2rem'
          }}
        >
          <TopView
            style = {{
              padding: '20px'
              , width: '50rem'
              // , margin: '0 auto'
            }}
            setThis={this.setTop.bind(this)}
            loading={this.loading.bind(this)}
            listKey={this.listKey.bind(this)}
          />
          <Card
            style={{
              display: 'block'
              , height: '90%'
              , marginBottom: '1rem'
            }}
          >
            <LeftView
              style={{
                display: 'inline-block'
                , margin: '1rem 1rem'
                , width: '400px'
              }}
              setThis={this.setLeft.bind(this)}
              center={ this.state.center }
              loading={this.loading.bind(this)}
            />
            <CenterView
              style={{
                verticalAlign: 'top'
                , display: 'inline-block'
                , margin: '1rem 1rem'
                , minWidth: '800px'
                , width: 'calc(100vw - 580px)'
              }}
              setThis={this.setCenter.bind(this)}
              left={ this.state.left }
              loading={this.loading.bind(this)}
              reload={() => {
                this.state.top && this.state.top.listKey();
              }}
              reloadNode={(node: EtcdNode) => {
                // this.state.view.left && this.state.view.left.showNode(node);
              }}
            />
          </Card>
        </div>
      </div>
    );
  }
}

export default Home;

/*
<Layout.Row>
  <Layout.Col span={"8"} offset={'8'}>
    <TopView listKey={ this.listKey.bind(this) } loading={ this.loading.bind(this) } />
  </Layout.Col>
</Layout.Row>
<Layout.Row>
  <Layout.Col span={"6"} offset={'2'}>
    <LeftView setThis={this.setLeft.bind(this)} center={ this.state.view.center } loading={ this.loading.bind(this) } />
  </Layout.Col>
  <Layout.Col span={"8"}>
    <CenterView setThis={ this.setCenter.bind(this) } loading={ this.loading.bind(this) } />
  </Layout.Col>
</Layout.Row>
*/
