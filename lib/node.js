var cx = require('classnames');
var React = require('react');

var Node = React.createClass({
  displayName: 'Node',

  render() {
    var tree = this.props.tree;
    var node = this.props.node;
    var index = this.props.index;
    var current = this.props.current;
    var dragging = this.props.dragging;

    var classes = {
      // 'active': current === index.id,
      'm-node': true,
      'placeholder': index.id === dragging
    };
    var level = node.level;
    var styles = {};
    var children = null;
    var childrenStyles = {};

    if(node.children) {
      children = node.children.map((child, i) =>
        <Node tree={tree} node={child} index={tree.getIndex(index.children[i])}
          current={current} dragging={dragging}
          paddingLeft={this.props.paddingLeft}
          onCollapse={this.props.onCollapse}
          onDragStart={this.props.onDragStart}/>
      );
    }

    if(node.collapsed) childrenStyles.display = 'none';
    childrenStyles['paddingLeft'] = this.props.paddingLeft + 'px';

    return (
      <div className={cx(classes)} style={styles}>
        <div className="inner" ref="inner" onClick={this._onClick}>
          {node.children && node.children.length ?
          <span className={cx({
            'collapse': true,
            'fa': true,
            'fa-caret-right': node.collapsed,
            'fa-caret-down': !node.collapsed
          })} onClick={this._onCollapse}></span> : null}
          <span className="name">{node.module}</span>
          <span className="action">
            <span className="move fa fa-arrows" ref="move"
              onMouseDown={this._onMouseDown}></span>
          </span>
        </div>
        <div className="children" style={childrenStyles}>{children}</div>
      </div>
    );
  },

  _onCollapse(e) {
    e.stopPropagation();
    var nodeId = this.props.index.id;
    if(this.props.onCollapse) this.props.onCollapse(nodeId);
  },

  _onMouseDown(e) {
    var nodeId = this.props.index.id;
    var dom = this.refs.inner.getDOMNode();

    if(this.props.onDragStart) {
      this.props.onDragStart(nodeId, dom, e);
    }
  }
});

module.exports = Node;