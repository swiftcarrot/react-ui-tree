var cx = require('classnames');
var React = require('react');

var Node = React.createClass({
  displayName: 'Node',

  render() {
    var node = this.props.node;
    var current = this.props.current;
    var dragging = this.props.dragging;
    var classes = {
      'active': current === node.id,
      'm-node': true,
      'placeholder': node.id === dragging
    };
    var level = node.level;
    var styles = {};
    var children = null;
    var childrenStyles = {};

    if(node.children) {
      children = node.children.map((child) => {
        return (
          <Node node={child} current={current} dragging={dragging}
            onDragStart={this.props.onDragStart}/>
        );
      });
    }

    if(node.collapsed) childrenStyles.display = 'none';
    childrenStyles['paddingLeft'] = 20 + 'px'; // todo: no hardcoded

    return (
      <div className={cx(classes)} style={styles}>
        <div className="inner" ref="inner" onClick={this._onClick}>
          {node.children.length ?
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
  },

  _onMouseDown: function(e) {
    var nodeId = this.props.node.id;
    var dom = this.refs.inner.getDOMNode();

    if(this.props.onDragStart) {
      this.props.onDragStart(nodeId, dom, e);
    }
  }
});

module.exports = Node;