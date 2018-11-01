import { Component } from 'react';

export interface UITreeProps {
  tree: Object;
  paddingLeft: number;
  renderNode: Function;
  onChange: Function;
}

export default class UITree extends Component<UITreeProps, void> {}
