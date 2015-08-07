var cx = require('classnames');
var React = require('react');
var Tree = require('../lib/react-ui-tree.js');
require('../lib/react-ui-tree.less');
require('./theme.less');
require('./app.less');

var App = React.createClass({
  getInitialState() {
    return {
      active: null,

      tree: {
        module: 'react-ui-tree',
        children: [{
          module: 'dist',
          collapsed: true,
          children: [{
            module: 'node.js'
          }, {
            module: 'react-ui-tree.css'
          }, {
            module: 'react-ui-tree.js'
          }, {
            module: 'tree.js'
          }]
        }, {
          module: 'example',
          children: [{
            module: 'app.js'
          }, {
            module: 'app.less'
          }, {
            module: 'index.html'
          }]
        }, {
          module: 'lib',
          children: [{
            module: 'node.js'
          }, {
            module: 'react-ui-tree.js'
          }, {
            module: 'react-ui-tree.less'
          }, {
            module: 'tree.js'
          }]
        }, {
          module: '.gitiignore'
        }, {
          module: 'index.js'
        }, {
          module: 'LICENSE'
        }, {
          module: 'Makefile'
        }, {
          module: 'package.json'
        }, {
          module: 'README.md'
        }, {
          module: 'webpack.config.js'
        }]
      }
    };
  },

  renderNode(node) {
    return (
      <span className={cx('node', {
        'is-active': node === this.state.active
        })} onClick={this.onClickNode.bind(null, node)}>
        {node.module}
      </span>
    );
  },

  onClickNode(node) {
    this.setState({
      active: node
    });
  },

  render() {
    return (
      <div className="app">
        <div className="tree">
          <Tree
            paddingLeft={20}
            tree={this.state.tree}
            onChange={this.handleChange}
            isNodeCollapsed={this.isNodeCollapsed}
            renderNode={this.renderNode}
          />
        </div>
        <div className="inspector">
          <button onClick={this.updateTree}>update tree</button>
          <pre>
          {JSON.stringify(this.state.tree, null, '  ')}
          </pre>
         </div>
      </div>
    );
  },

  handleChange(tree) {
    this.setState({
      tree: tree
    });
  },

  updateTree() {
    var tree = this.state.tree;
    tree.children.push({module: 'test'});
    this.setState({
      tree: tree
    });
  }
});

React.render(<App/>, document.getElementById('app'));
