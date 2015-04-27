var Tree = require('@adjusted/tree');
var proto = Tree.prototype;

proto.updateNodesPosition = function() {
  var top = 1;
  var left = 1;
  var root = this.root;

  root.top = top++;
  root.left = left++;
  walk(root.children, left, root.collapsed);

  function walk(children, left, collapsed) {
    children.forEach(function(node) {
      if(collapsed) {
        node.top = null;
        node.left = null;
      } else {
        node.top = top++;
        node.left = left;
      }

      if(node.children && node.children.length) {
        walk(node.children, left+1, collapsed || node.collapsed);
      }
    });
  }
};

proto.move2 = function(fromId, toId, placement) {
  // console.log("move2", fromId, toId, placement);
  this.move(fromId, toId, placement);
  // todo: update can be more efficient
  this.updateNodesPosition();
};

proto.getNodeByTop = function(top) {
  var nodes = this.nodes;
  for(var id in nodes) {
    if(nodes.hasOwnProperty(id)) {
      if(nodes[id].top === top) return nodes[id];
    }
  }
};

module.exports = Tree;