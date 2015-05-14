var cx = require('classnames');
var React = require('react');

var Node = React.createClass({
  displayName: 'Node',

  render() {
    var tree = this.props.tree;
    var index = this.props.index;
    var dragging = this.props.dragging;
    var node = index.node;
    var styles = {};
    var children = null;
    var childrenStyles = {};

    if(index.children && index.children.length) {
      children = index.children.map((child) => {
        var childIndex = tree.getIndex(child);
        return (
          <Node tree={tree} index={childIndex} key={childIndex.id}
            dragging={dragging}
            paddingLeft={this.props.paddingLeft}
            onCollapse={this.props.onCollapse}
            onDragStart={this.props.onDragStart}/>
        );
      });
    }

    if(index.collapsed) childrenStyles.display = 'none';
    childrenStyles['paddingLeft'] = this.props.paddingLeft + 'px';

    return (
      <div className={cx({
        'm-node': true,
        'placeholder': index.id === dragging
      })} style={styles}>
        <div className="inner" ref="inner" onMouseDown={this._onMouseDown}>
          {index.children && index.children.length ?
          <span className={cx({
            'collapse': true,
            'caret-right': index.collapsed,
            'caret-down': !index.collapsed
          })} onMouseDown={function(e) {e.stopPropagation()}}
            onClick={this._onCollapse}></span> : null}
          {tree.renderNode(node)}
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