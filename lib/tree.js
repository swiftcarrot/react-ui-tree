var Tree = require('../tree-index');
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

  var obj = this.remove(fromId);
  var index = null;

  if(placement === 'before') index = this.insertBefore(obj, toId);
  else if(placement === 'after') index = this.insertAfter(obj, toId);
  else if(placement === 'prepend') index = this.prepend(obj, toId);
  else if(placement === 'append') index = this.append(obj, toId);

  // todo: perf
  this.updateNodesPosition();
  return index;
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