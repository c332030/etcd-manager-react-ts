import React from 'react';

import {
  Loading
} from 'element-react'

import 'element-theme-default';

import {
  TopView
  , LeftView
  , CenterView
} from './layout';

// import {
//   debug
// } from 'util'
import { ViewComponentStateTypes} from "component";

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

  reloadLeft?: Function
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

    const left = this.state.left;
    left && left.listKey(url);
  }

  /**
   * 左侧页面重载
   */
  reloadLeft() {
    const reloadLeft = this.state.reloadLeft;
    reloadLeft && reloadLeft();
  }

  render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    return (
      <div>
        {this.state.loading && <Loading fullscreen={true}/>}
        <div
          style={{
            verticalAlign: 'top'
            // , width: '90%'
            , height: 'calc(100vh - 75px)'
            , margin: '1.5rem 1rem 0.5rem 1rem'
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
          <div
            style={{
              display: 'flex'
              // , flexWrap: 'wrap'
            }}
          >
            <LeftView
              style={{
                margin: '1rem 0 1rem 1rem'
                , minWidth: '380px'
                // , width: '400px'
              }}
              setThis={this.setLeft.bind(this)}
              center={ this.state.center }
              loading={this.loading.bind(this)}
              setReloadLeft={(reloadLeft: Function) => {
                this.setState({
                  reloadLeft: reloadLeft
                });
              }}
            />
            <CenterView
              style={{
                verticalAlign: 'top'
                , margin: '1rem 1rem'
                , minWidth: '750px'
                , overflowY: 'auto'
                , flexGrow: 1
              }}
              setThis={this.setCenter.bind(this)}
              left={ this.state.left }
              loading={this.loading.bind(this)}
              reload={() => {
                const top = this.state.top;
                top && top.listKey();
              }}
              reloadLeft={this.reloadLeft.bind(this)}
            />
          </div>
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
