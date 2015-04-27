'use strict';

var cx = require('classnames');
var React = require('react');

var Node = React.createClass({
  displayName: 'Node',

  render: function render() {
    var _this = this;

    var node = this.props.node;
    var current = this.props.current;
    var dragging = this.props.dragging;
    var classes = {
      active: current === node.id,
      'm-node': true,
      placeholder: node.id === dragging
    };
    var level = node.level;
    var styles = {};
    var children = null;
    var childrenStyles = {};

    if (node.children) {
      children = node.children.map(function (child) {
        return React.createElement(Node, { node: child, current: current, dragging: dragging,
          onDragStart: _this.props.onDragStart });
      });
    }

    if (node.collapsed) childrenStyles.display = 'none';
    childrenStyles.paddingLeft = 20 + 'px'; // todo: no hardcoded

    return React.createElement(
      'div',
      { className: cx(classes), style: styles },
      React.createElement(
        'div',
        { className: 'inner', ref: 'inner', onClick: this._onClick },
        node.children.length ? React.createElement('span', { className: cx({
            collapse: true,
            fa: true,
            'fa-caret-right': node.collapsed,
            'fa-caret-down': !node.collapsed
          }), onClick: this._onCollapse }) : null,
        React.createElement(
          'span',
          { className: 'name' },
          node.module
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
  },

  _onMouseDown: function _onMouseDown(e) {
    var nodeId = this.props.node.id;
    var dom = this.refs.inner.getDOMNode();

    if (this.props.onDragStart) {
      this.props.onDragStart(nodeId, dom, e);
    }
  }
});

module.exports = Node;