import React from "react";

/*
const Component: React.FC = () => {
  return (
    <>
    </>
  );
};
*/

/**
 * Prop 类型
 */
export interface ComponentPropTypes {
  style?: any

  setThis: Function
}

/**
 * State 类型
 */
export interface ComponentStateTypes {

}

/**
 * <p>
 *   Description: Component
 * </p>
 * @author c332030
 * @version 1.0
 * @date 2019-11-3 18:12
 */
export class Component<ComponentPropTypes, ComponentStateTypes> extends React.Component<ComponentPropTypes, ComponentStateTypes> {}
