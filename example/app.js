var cx = require('classnames');
var React = require('react');
var Tree = require('../lib/react-ui-tree.js');
require('../lib/react-ui-tree.less');
require('./theme.less');
require('./app.less');

var App = React.createClass({
  getInitialState() {
    return {
      tree: {
        module: 'react-ui-tree',
        children: [{
          module: 'dist',
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
      },
      active: null
    };
  },

  renderNode(node) {
    return <span className={cx({
      'node': true,
      'is-active': node === this.state.active
    })} onClick={this.onClickNode.bind(null, node)}>{node.module}</span>;
  },

  onClickNode(node) {
    console.log('click', node);
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
            onChange={this._onChange}
            renderNode={this.renderNode}/>
        </div>
        <div className="inspector">
           <pre>
           {JSON.stringify(this.state.tree, null, '  ')}
           </pre>
         </div>
      </div>
    );
  },

  _onChange(tree) {
    this.setState({tree: tree});
  }
});

React.render(<App/>, document.getElementById('app'));
