var assign = require('object-assign');
var React = require('react');
var Tree = require('./tree');
var Node = require('./node');

module.exports = React.createClass({
  displayName: 'UITree',

  propTypes: {
    tree: React.PropTypes.object,
    paddingLeft: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      paddingLeft: 20
    };
  },

  getInitialState() {
    var tree = new Tree(this.props.tree);
    tree.updateNodesPosition();

    return {
      tree: tree,
      currentNodeId: 1,
      dragging: {
        id: null,
        x: null,
        y: null,
        w: null,
        h: null
      }
    };
  },

  render() {
    var tree = this.state.tree;
    var current = this.state.currentNodeId;
    var dragging = this.state.dragging;

    var layout = tree.root;
    var draggingNode = null;
    var draggingDom = null;

    if(dragging.id) {
      draggingNode = tree.get(dragging.id);
    }

    if(draggingNode) {
      var dragging = this.state.dragging;
      var styles = {
        top: dragging.y,
        left: dragging.x,
        width: dragging.w
      };
      draggingDom = (
        <div className="m-draggable" style={styles}>
          <Node node={draggingNode}/>
        </div>
      );
    }

    return (
      <div className="m-layout">
        <div className="m-tree">
          {draggingDom}
          <div className="m-root">
            {layout && <Node node={layout} current={current}
            paddingLeft={this.props.paddingLeft}
            onDragStart={this.dragStart}
            onCollapse={this.toggleCollapse}
            dragging={draggingNode && draggingNode.id}/>}
          </div>
        </div>
      </div>
    );
  },

  dragStart(nodeId, dom, e) {
    var dragging = {
      id: nodeId,
      w: dom.offsetWidth,
      h: dom.offsetHeight,
      x: dom.offsetLeft,
      y: dom.offsetTop
    };

    this._startX = dom.offsetLeft;
    this._startY = dom.offsetTop;
    this._offsetX = e.clientX;
    this._offsetY = e.clientY;

    window.addEventListener('mousemove', this.drag);
    window.addEventListener('mouseup', this.dragEnd);

    this.setState({
      dragging: dragging
    });
  },

  drag(e) {
    var tree = this.state.tree;
    var dragging = this.state.dragging;
    var paddingLeft = this.props.paddingLeft;

    var _startX = this._startX;
    var _startY = this._startY;
    var _offsetX = this._offsetX;
    var _offsetY = this._offsetY;

    var pos = {
      x: _startX + e.clientX - _offsetX,
      y: _startY + e.clientY - _offsetY
    };
    var node = tree.get(dragging.id);

    dragging.x = pos.x;
    dragging.y = pos.y;

    var diffX = dragging.x - paddingLeft/2 - (node.left-2) * paddingLeft;
    var diffY = dragging.y - dragging.h/2 - (node.top-2) * dragging.h;

    if(diffX < 0) { // left
      if(!node.next) {
        tree.move2(node.id, node.parentId, 'after');
      }
    } else if(diffX > paddingLeft) { // right
      if(node.prev && !tree.get(node.prev).collapsed) {
        tree.move2(node.id, node.prev, 'append');
      }
    }

    if(diffY < 0) { // up
      var above = tree.getNodeByTop(node.top-1);
      tree.move2(node.id, above.id, 'before');
    } else if(diffY > dragging.h) { // down
      if(node.next) {
        var below = tree.get(node.next);
        if(below.children.length && !below.collapsed) {
          tree.move2(node.id, node.next, 'prepend');
        } else {
          tree.move2(node.id, node.next, 'after');
        }
      } else {
        var below = tree.getNodeByTop(node.top+1);
        if(below && below.parentId !== node.id) {
          if(below.children.length) {
            tree.move2(node.id, below.id, 'prepend');
          } else {
            tree.move2(node.id, below.id, 'after');
          }
        }
      }
    }

    this.setState({
      tree: tree,
      dragging: dragging
    });
  },

  dragEnd() {
    this.setState({
      dragging: {
        id: null,
        x: null,
        y: null,
        w: null,
        h: null
      }
    });

    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.dragEnd);
  },

  toggleCollapse: function(nodeId) {
    var tree = this.state.tree;
    var node = tree.get(nodeId);
    node.collapsed = !node.collapsed;
    tree.updateNodesPosition();

    this.setState({
      tree: tree
    });
  }
});