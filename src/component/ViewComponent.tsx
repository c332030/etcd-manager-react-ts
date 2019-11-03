import React from "react";
import {Component, ComponentPropTypes, ComponentStateTypes} from "./Component";

/**
 * Prop 类型
 */
export interface ViewComponentPropTypes extends ComponentPropTypes {

  loading: Function

  reload?: Function
}

/**
 * State 类型
 */
export interface ViewComponentStateTypes extends ComponentStateTypes {

}

/**
 * <p>
 *   Description: ViewComponent
 * </p>
 * @author c332030
 * @version 1.0
 * @date 2019-11-3 18:12
 */
export class ViewComponent<ViewComponentPropTypes, ViewComponentStateTypes> extends Component <ViewComponentPropTypes, ViewComponentStateTypes> {}
