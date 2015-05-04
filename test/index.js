var assert = require('assert');
var Tree = require('../lib/tree');

describe('tree', function() {
  var tree = new Tree({
    module: 'root',
    collapsed: false,
    children: [{
      module: 'a',
      collapsed: false,
      children: [{
        module: 'c',
        collapsed: false
      }]
    }, {
      module: 'b',
      collapsed: false
    }]
  });

  it('updateNodesPosition()', function() {
    tree.updateNodesPosition();
    assert.deepEqual(tree.obj, {
      module: 'root',
      collapsed: false,
      top: 1,
      left: 1,
      children: [{
        module: 'a',
        top: 2,
        left: 2,
        collapsed: false,
        children: [{
          top: 3,
          left: 3,
          module: 'c',
          collapsed: false
        }]
      }, {
        top: 4,
        left: 2,
        module: 'b',
        collapsed: false
      }]
    })
  });

  it('move()', function() {
    tree.move();
  });

  it('getNodeByTop()', function() {
    tree.getNodeByTop();
  });
});