'use strict';

var React = require('react');
var Tree = require('./tree');
var Node = require('./node');

module.exports = React.createClass({
  displayName: 'UITree',

  propTypes: {
    tree: React.PropTypes.object,
    paddingLeft: React.PropTypes.number,
    renderNode: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      paddingLeft: 20
    };
  },

  getInitialState: function getInitialState() {
    var tree = new Tree(this.props.tree);
    tree.renderNode = this.props.renderNode;
    tree.updateNodesPosition();
    window.tree = tree;

    return {
      tree: tree,
      dragging: {
        id: null,
        x: null,
        y: null,
        w: null,
        h: null
      }
    };
  },

  render: function render() {
    var tree = this.state.tree;
    var dragging = this.state.dragging;
    var draggingDom = null;

    if (dragging.id) {
      var draggingIndex = tree.getIndex(dragging.id);
      var dragging = this.state.dragging;
      draggingDom = React.createElement(
        'div',
        { className: 'm-draggable', style: {
            top: dragging.y,
            left: dragging.x,
            width: dragging.w
          } },
        React.createElement(Node, { tree: tree, index: draggingIndex,
          paddingLeft: this.props.paddingLeft })
      );
    }

    return React.createElement(
      'div',
      { className: 'm-tree' },
      draggingDom,
      React.createElement(Node, { tree: tree, index: tree.getIndex(1), key: 1,
        paddingLeft: this.props.paddingLeft,
        onDragStart: this.dragStart,
        onCollapse: this.toggleCollapse,
        dragging: dragging && dragging.id })
    );
  },

  dragStart: function dragStart(id, dom, e) {
    this.dragging = {
      id: id,
      w: dom.offsetWidth,
      h: dom.offsetHeight,
      x: dom.offsetLeft,
      y: dom.offsetTop
    };

    this._startX = dom.offsetLeft;
    this._startY = dom.offsetTop;
    this._offsetX = e.clientX;
    this._offsetY = e.clientY;
    this._start = true;

    window.addEventListener('mousemove', this.drag);
    window.addEventListener('mouseup', this.dragEnd);
  },

  drag: function drag(e) {
    if (this._start) {
      this.setState({
        dragging: this.dragging
      });
      this._start = false;
    }

    var tree = this.state.tree;
    var dragging = this.state.dragging;
    var paddingLeft = this.props.paddingLeft;
    var newIndex = null;

    var _startX = this._startX;
    var _startY = this._startY;
    var _offsetX = this._offsetX;
    var _offsetY = this._offsetY;

    var pos = {
      x: _startX + e.clientX - _offsetX,
      y: _startY + e.clientY - _offsetY
    };
    var index = tree.getIndex(dragging.id);
    var collapsed = index.collapsed;
    dragging.x = pos.x;
    dragging.y = pos.y;

    var diffX = dragging.x - paddingLeft / 2 - (index.left - 2) * paddingLeft;
    var diffY = dragging.y - dragging.h / 2 - (index.top - 2) * dragging.h;
    if (diffX < 0) {
      // left
      if (!index.next) {
        newIndex = tree.move(index.id, index.parent, 'after');
      }
    } else if (diffX > paddingLeft) {
      // right
      if (index.prev && !tree.getIndex(index.prev).collapsed) {
        newIndex = tree.move(index.id, index.prev, 'append');
      }
    }

    if (diffY < 0) {
      // up
      var above = tree.getNodeByTop(index.top - 1);
      newIndex = tree.move(index.id, above.id, 'before');
    } else if (diffY > dragging.h) {
      // down
      if (index.next) {
        var below = tree.getIndex(index.next);
        if (below.children && below.children.length && !below.collapsed) {
          newIndex = tree.move(index.id, index.next, 'prepend');
        } else {
          newIndex = tree.move(index.id, index.next, 'after');
        }
      } else {
        var below = tree.getNodeByTop(index.top + index.height);
        if (below && below.parent !== index.id) {
          if (below.children && below.children.length) {
            newIndex = tree.move(index.id, below.id, 'prepend');
          } else {
            newIndex = tree.move(index.id, below.id, 'after');
          }
        }
      }
    }

    if (newIndex) {
      newIndex.collapsed = collapsed;
      dragging.id = newIndex.id;
    }

    this.setState({
      tree: tree,
      dragging: dragging
    });
  },

  dragEnd: function dragEnd() {
    this.setState({
      dragging: {
        id: null,
        x: null,
        y: null,
        w: null,
        h: null
      }
    });

    this.change(tree);
    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.dragEnd);
  },

  change: function change(tree) {
    if (this.props.onChange) this.props.onChange(tree.obj);
  },

  toggleCollapse: function toggleCollapse(nodeId) {
    var tree = this.state.tree;
    var index = tree.getIndex(nodeId);
    index.collapsed = !index.collapsed;
    tree.updateNodesPosition();

    this.setState({
      tree: tree
    });
  }
});