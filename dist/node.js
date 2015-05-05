'use strict';

var cx = require('classnames');
var React = require('react');

var Node = React.createClass({
  displayName: 'Node',

  render: function render() {
    var _this = this;

    var tree = this.props.tree;
    var index = this.props.index;
    var dragging = this.props.dragging;
    var node = index.node;
    var styles = {};
    var children = null;
    var childrenStyles = {};

    if (index.children && index.children.length) {
      children = index.children.map(function (child) {
        var childIndex = tree.getIndex(child);
        return React.createElement(Node, { tree: tree, index: childIndex, key: childIndex.id,
          dragging: dragging,
          paddingLeft: _this.props.paddingLeft,
          onCollapse: _this.props.onCollapse,
          onDragStart: _this.props.onDragStart });
      });
    }

    if (index.collapsed) childrenStyles.display = 'none';
    childrenStyles.paddingLeft = this.props.paddingLeft + 'px';

    return React.createElement(
      'div',
      { className: cx({
          'm-node': true,
          placeholder: index.id === dragging
        }), style: styles },
      React.createElement(
        'div',
        { className: 'inner', ref: 'inner', onClick: this._onClick },
        index.children && index.children.length ? React.createElement('span', { className: cx({
            collapse: true,
            fa: true,
            'fa-caret-right': index.collapsed,
            'fa-caret-down': !index.collapsed
          }), onClick: this._onCollapse }) : null,
        React.createElement(
          'span',
          { className: 'name' },
          '' + index.id + ' ' + node.module
        ),
        React.createElement(
          'span',
          { className: 'action' },
          React.createElement('span', { className: 'move fa fa-arrows', ref: 'move',
            onMouseDown: this._onMouseDown })
        )
      ),
      React.createElement(
        'div',
        { className: 'children', style: childrenStyles },
        children
      )
    );
  },

  _onCollapse: function _onCollapse(e) {
    e.stopPropagation();
    var nodeId = this.props.index.id;
    if (this.props.onCollapse) this.props.onCollapse(nodeId);
  },

  _onMouseDown: function _onMouseDown(e) {
    var nodeId = this.props.index.id;
    var dom = this.refs.inner.getDOMNode();

    if (this.props.onDragStart) {
      this.props.onDragStart(nodeId, dom, e);
    }
  }
});

module.exports = Node;