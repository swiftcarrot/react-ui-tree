'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var jsTree = _interopDefault(require('js-tree'));
var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/inheritsLoose'));
var cx = _interopDefault(require('classnames'));
var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));

var proto = jsTree.prototype;

proto.updateNodesPosition = function () {
  var top = 1;
  var left = 1;
  var root = this.getIndex(1);
  var self = this;
  root.top = top++;
  root.left = left++;

  if (root.children && root.children.length) {
    walk(root.children, root, left, root.node.collapsed);
  }

  function walk(children, parent, left, collapsed) {
    var height = 1;
    children.forEach(function (id) {
      var node = self.getIndex(id);

      if (collapsed) {
        node.top = null;
        node.left = null;
      } else {
        node.top = top++;
        node.left = left;
      }

      if (node.children && node.children.length) {
        height += walk(node.children, node, left + 1, collapsed || node.node.collapsed);
      } else {
        node.height = 1;
        height += 1;
      }
    });
    if (parent.node.collapsed) parent.height = 1;else parent.height = height;
    return parent.height;
  }
};

proto.move = function (fromId, toId, placement) {
  if (fromId === toId || toId === 1) return;
  var obj = this.remove(fromId);
  var index = null;
  if (placement === 'before') index = this.insertBefore(obj, toId);else if (placement === 'after') index = this.insertAfter(obj, toId);else if (placement === 'prepend') index = this.prepend(obj, toId);else if (placement === 'append') index = this.append(obj, toId); // todo: perf

  this.updateNodesPosition();
  return index;
};

proto.getNodeByTop = function (top) {
  var indexes = this.indexes;

  for (var id in indexes) {
    if (indexes.hasOwnProperty(id)) {
      if (indexes[id].top === top) return indexes[id];
    }
  }
};

var tree = jsTree;

var UITreeNode =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(UITreeNode, _Component);

  function UITreeNode(props) {
    var _this;

    _this = _Component.call(this, props) || this;

    _this.renderCollapse = function () {
      var index = _this.props.index;

      if (index.children && index.children.length) {
        var collapsed = index.node.collapsed;
        return React__default.createElement("span", {
          className: cx('collapse', collapsed ? 'caret-right' : 'caret-down'),
          onMouseDown: function onMouseDown(e) {
            return e.stopPropagation();
          },
          onClick: _this.handleCollapse
        });
      }

      return null;
    };

    _this.renderChildren = function () {
      var _this$props = _this.props,
          index = _this$props.index,
          tree = _this$props.tree,
          dragging = _this$props.dragging;

      if (index.children && index.children.length) {
        var childrenStyles = {
          paddingLeft: _this.props.paddingLeft
        };
        return React__default.createElement("div", {
          className: "children",
          style: childrenStyles
        }, index.children.map(function (child) {
          var childIndex = tree.getIndex(child);
          return React__default.createElement(UITreeNode, {
            tree: tree,
            index: childIndex,
            key: childIndex.id,
            dragging: dragging,
            paddingLeft: _this.props.paddingLeft,
            onCollapse: _this.props.onCollapse,
            onDragStart: _this.props.onDragStart
          });
        }));
      }

      return null;
    };

    _this.handleCollapse = function (e) {
      e.stopPropagation();
      var nodeId = _this.props.index.id;

      if (_this.props.onCollapse) {
        _this.props.onCollapse(nodeId);
      }
    };

    _this.handleMouseDown = function (e) {
      var nodeId = _this.props.index.id;
      var dom = _this.innerRef.current;

      if (_this.props.onDragStart) {
        _this.props.onDragStart(nodeId, dom, e);
      }
    };

    _this.innerRef = React__default.createRef();
    return _this;
  }

  var _proto = UITreeNode.prototype;

  _proto.render = function render() {
    var _this$props2 = this.props,
        tree = _this$props2.tree,
        index = _this$props2.index,
        dragging = _this$props2.dragging;
    var node = index.node;
    var styles = {};
    return React__default.createElement("div", {
      className: cx('m-node', {
        placeholder: index.id === dragging
      }),
      style: styles
    }, React__default.createElement("div", {
      className: "inner",
      ref: this.innerRef,
      onMouseDown: this.handleMouseDown
    }, this.renderCollapse(), tree.renderNode(node)), node.collapsed ? null : this.renderChildren());
  };

  return UITreeNode;
}(React.Component);

var UITree =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(UITree, _Component);

  function UITree(_props) {
    var _this;

    _this = _Component.call(this, _props) || this;

    _this.init = function (props) {
      var tree$$1 = new tree(props.tree);
      tree$$1.isNodeCollapsed = props.isNodeCollapsed;
      tree$$1.renderNode = props.renderNode;
      tree$$1.changeNodeCollapsed = props.changeNodeCollapsed;
      tree$$1.updateNodesPosition();
      return {
        tree: tree$$1,
        dragging: {
          id: null,
          x: null,
          y: null,
          w: null,
          h: null
        }
      };
    };

    _this.getDraggingDom = function () {
      var _this$state = _this.state,
          tree$$1 = _this$state.tree,
          dragging = _this$state.dragging;

      if (dragging && dragging.id) {
        var draggingIndex = tree$$1.getIndex(dragging.id);
        var draggingStyles = {
          top: dragging.y,
          left: dragging.x,
          width: dragging.w
        };
        return React__default.createElement("div", {
          className: "m-draggable",
          style: draggingStyles
        }, React__default.createElement(UITreeNode, {
          tree: tree$$1,
          index: draggingIndex,
          paddingLeft: _this.props.paddingLeft
        }));
      }

      return null;
    };

    _this.dragStart = function (id, dom, e) {
      if (e.button !== 0) return;
      _this.dragging = {
        id: id,
        w: dom.offsetWidth,
        h: dom.offsetHeight,
        x: dom.offsetLeft,
        y: dom.offsetTop
      };
      _this._startX = dom.offsetLeft;
      _this._startY = dom.offsetTop;
      _this._offsetX = e.clientX;
      _this._offsetY = e.clientY;
      _this._start = true;
      window.addEventListener('mousemove', _this.drag);
      window.addEventListener('mouseup', _this.dragEnd);
    };

    _this.drag = function (e) {
      if (_this._start) {
        _this.setState({
          dragging: _this.dragging
        });

        _this._start = false;
      }

      var tree$$1 = _this.state.tree;
      var dragging = _this.state.dragging;
      var paddingLeft = _this.props.paddingLeft;
      var newIndex = null;
      var index = tree$$1.getIndex(dragging.id);
      var collapsed = index.node.collapsed;
      var _startX = _this._startX;
      var _startY = _this._startY;
      var _offsetX = _this._offsetX;
      var _offsetY = _this._offsetY;
      var pos = {
        x: _startX + e.clientX - _offsetX,
        y: _startY + e.clientY - _offsetY
      };
      dragging.x = pos.x;
      dragging.y = pos.y;
      var diffX = dragging.x - paddingLeft / 2 - (index.left - 2) * paddingLeft;
      var diffY = dragging.y - dragging.h / 2 - (index.top - 2) * dragging.h;

      if (diffX < 0) {
        // left
        if (index.parent && !index.next) {
          newIndex = tree$$1.move(index.id, index.parent, 'after');
        }
      } else if (diffX > paddingLeft) {
        // right
        if (index.prev) {
          var prevNode = tree$$1.getIndex(index.prev).node;

          if (!prevNode.collapsed && !prevNode.leaf) {
            newIndex = tree$$1.move(index.id, index.prev, 'append');
          }
        }
      }

      if (newIndex) {
        index = newIndex;
        newIndex.node.collapsed = collapsed;
        dragging.id = newIndex.id;
      }

      if (diffY < 0) {
        // up
        var above = tree$$1.getNodeByTop(index.top - 1);
        newIndex = tree$$1.move(index.id, above.id, 'before');
      } else if (diffY > dragging.h) {
        // down
        if (index.next) {
          var below = tree$$1.getIndex(index.next);

          if (below.children && below.children.length && !below.node.collapsed) {
            newIndex = tree$$1.move(index.id, index.next, 'prepend');
          } else {
            newIndex = tree$$1.move(index.id, index.next, 'after');
          }
        } else {
          var _below = tree$$1.getNodeByTop(index.top + index.height);

          if (_below && _below.parent !== index.id) {
            if (_below.children && _below.children.length && !_below.node.collapsed) {
              newIndex = tree$$1.move(index.id, _below.id, 'prepend');
            } else {
              newIndex = tree$$1.move(index.id, _below.id, 'after');
            }
          }
        }
      }

      if (newIndex) {
        newIndex.node.collapsed = collapsed;
        dragging.id = newIndex.id;
      }

      _this.setState({
        tree: tree$$1,
        dragging: dragging
      });
    };

    _this.dragEnd = function () {
      _this.setState({
        dragging: {
          id: null,
          x: null,
          y: null,
          w: null,
          h: null
        }
      });

      _this.change(_this.state.tree);

      window.removeEventListener('mousemove', _this.drag);
      window.removeEventListener('mouseup', _this.dragEnd);
    };

    _this.change = function (tree$$1) {
      _this._updated = true;
      if (_this.props.onChange) _this.props.onChange(tree$$1.obj);
    };

    _this.toggleCollapse = function (nodeId) {
      var tree$$1 = _this.state.tree;
      var index = tree$$1.getIndex(nodeId);
      var node = index.node;
      node.collapsed = !node.collapsed;
      tree$$1.updateNodesPosition();

      _this.setState({
        tree: tree$$1
      });

      _this.change(tree$$1);
    };

    _this.state = _this.init(_props);
    return _this;
  }

  var _proto = UITree.prototype;

  _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (!this._updated) {
      this.setState(this.init(nextProps));
    } else {
      this._updated = false;
    }
  };

  _proto.render = function render() {
    var tree$$1 = this.state.tree;
    var dragging = this.state.dragging;
    var draggingDom = this.getDraggingDom();
    return React__default.createElement("div", {
      className: "m-tree"
    }, draggingDom, React__default.createElement(UITreeNode, {
      tree: tree$$1,
      index: tree$$1.getIndex(1),
      key: 1,
      paddingLeft: this.props.paddingLeft,
      onDragStart: this.dragStart,
      onCollapse: this.toggleCollapse,
      dragging: dragging && dragging.id
    }));
  };

  return UITree;
}(React.Component);

UITree.propTypes = {
  tree: PropTypes.object.isRequired,
  paddingLeft: PropTypes.number,
  renderNode: PropTypes.func.isRequired
};
UITree.defaultProps = {
  paddingLeft: 20
};

module.exports = UITree;
