var Tree = require('@adjusted/tree');
var proto = Tree.prototype;

proto.updateNodesPosition = function() {
  var top = 1;
  var left = 1;
  var root = this.getIndex(1);
  var self = this;

  root.top = top++;
  root.left = left++;
  walk(root.children, left, root.collapsed);

  function walk(children, left, collapsed) {
    children.forEach(function(id) {
      var node = self.getIndex(id);
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

proto.move = function(fromId, toId, placement) {
  if(fromId === toId || toId === 1) return;

  console.log('move', fromId, toId, placement);
  var node = this.remove(fromId);

  if(placement === 'before') this.insertBefore(node, toId);
  else if(placement === 'after') this.insertAfter(node, toId);
  else if(placement === 'prepend') this.prepend(node, toId);
  else if(placement === 'append') this.append(node, toId);

  // todo: perf
  this.updateNodesPosition();
};

proto.getNodeByTop = function(top) {
  var indexes = this.indexes;
  for(var id in indexes) {
    if(indexes.hasOwnProperty(id)) {
      if(indexes[id].top === top) return indexes[id];
    }
  }
};

module.exports = Tree;