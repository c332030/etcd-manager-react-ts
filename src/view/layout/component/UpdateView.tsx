import React from "react";
import {EtcdNodeBo} from "../../../entity/bo/EtcdNodeBo";
import {Button, Form} from "element-react";
import ValueView from "./ValueView";
import {ComponentPropTypes} from "../../../component";

/**
 * Prop 类型
 */
interface UpdateViewPropTypes {

  needFormatJson: boolean

  node: EtcdNodeBo

  onUpdate: Function
}

/**
 * State 类型
 */
interface UpdateViewStateTypes {

  value?: string
}

/**
 * <p>
 *   Description: UpdateView
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-8-7 16:36
 */
export class UpdateView extends React.Component <UpdateViewPropTypes, UpdateViewStateTypes> {

  state: UpdateViewStateTypes = {};

  constructor(props: UpdateViewPropTypes){
    super(props);

    this.state = {
      value: props.node.value
    }
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {
      node
    } = this.props;

    return (
      <>
        <Form>
          <ValueView
            value={this.state.value}
            needFormatJson={this.props.needFormatJson}
            onChange={(value: string) => {
              this.setState({
                value: value
              });
            }}
          />
        </Form>
        {
          this.state.value !== node.value &&
          <Button onClick={() => {
            this.props.onUpdate(this.state.value);
          }}>更新</Button>
        }
      </>
    );
  }
}
