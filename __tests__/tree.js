import Tree from '../lib/tree';

describe('tree', () => {
  const tree = new Tree({
    module: 'root',
    collapsed: false,
    children: [
      {
        module: 'a',
        collapsed: false,
        children: [
          {
            module: 'c',
            collapsed: false
          }
        ]
      },
      {
        module: 'b',
        collapsed: false
      }
    ]
  });

  it('updateNodesPosition()', () => {
    tree.updateNodesPosition();
    expect(tree.getIndex(1).top).toEqual(1);
    expect(tree.getIndex(1).left).toEqual(1);
    expect(tree.getIndex(2).top).toEqual(2);
    expect(tree.getIndex(2).left).toEqual(2);
    expect(tree.getIndex(3).top).toEqual(3);
    expect(tree.getIndex(3).left).toEqual(3);
    expect(tree.getIndex(4).top).toEqual(4);
    expect(tree.getIndex(4).left).toEqual(2);
  });

  it('move()', () => {
    tree.move();
  });

  it('getNodeByTop()', () => {
    expect(tree.getNodeByTop(1).id).toEqual(1);
    expect(tree.getNodeByTop(2).id).toEqual(2);
    expect(tree.getNodeByTop(3).id).toEqual(3);
    expect(tree.getNodeByTop(4).id).toEqual(4);
  });
});
