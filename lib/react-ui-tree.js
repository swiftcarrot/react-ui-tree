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
        index: null,
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
    var draggingDom = null;

    if(dragging.index) {
      var dragging = this.state.dragging;
      draggingDom = (
        <div className="m-draggable" style={{
          top: dragging.y,
          left: dragging.x,
          width: dragging.w
        }}>
          <Node tree={tree} index={dragging.index}/>
        </div>
      );
    }

    return (
      <div className="m-layout">
        <div className="m-tree">
          {draggingDom}
          <div className="m-root">
            <Node tree={tree} index={tree.getIndex(1)} key={1}
              paddingLeft={this.props.paddingLeft}
              onDragStart={this.dragStart}
              onCollapse={this.toggleCollapse}
              dragging={dragging.index && dragging.index.id}/>
          </div>
        </div>
      </div>
    );
  },

  dragStart(id, dom, e) {
    var index = this.state.tree.getIndex(id);
    var dragging = {
      index: index,
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
    var index = dragging.index;

    dragging.x = pos.x;
    dragging.y = pos.y;

    var diffX = dragging.x - paddingLeft/2 - (index.left-2) * paddingLeft;
    var diffY = dragging.y - dragging.h/2 - (index.top-2) * dragging.h;

    if(diffX < 0) { // left
      if(!index.next) {
        tree.move(index.id, index.parentId, 'after');
      }
    } else if(diffX > paddingLeft) { // right
      if(index.prev && !tree.getIndex(index.prev).collapsed) {
        tree.move(index.id, index.prev, 'append');
      }
    }

    if(diffY < 0) { // up
      var above = tree.getNodeByTop(index.top-1);
      tree.move(index.id, above.id, 'before');
    } else if(diffY > dragging.h) { // down
      if(index.next) {
        var below = tree.getIndex(index.next);
        if(below.children && below.children.length && !below.collapsed) {
          tree.move(index.id, index.next, 'prepend');
        } else {
          tree.move(index.id, index.next, 'after');
        }
      } else {
        var below = tree.getNodeByTop(index.top+1);
        if(below && below.parentId !== index.id) {
          if(below.children && below.children.length) {
            tree.move(index.id, below.id, 'prepend');
          } else {
            tree.move(index.id, below.id, 'after');
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
    var index = tree.getIndex(nodeId);
    index.collapsed = !index.collapsed;
    tree.updateNodesPosition();

    this.setState({
      tree: tree
    });
  }
});