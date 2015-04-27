var React = require('react');
var Tree = require('../lib/react-ui-tree.js');
require('!style!css!less!../lib/react-ui-tree.less');
require('!style!css!less!./app.less');

var App = React.createClass({
  getInitialState() {
    return {
      tree: {
        module: 'page',
        children: [{
          module: 'section',
          children: [{
            module: 'container',
            children: [{
              module: 'row',
              children: [{
                module: 'col',
                children: []
              }, {
                module: 'col',
                children: []
              }]
            }, {
              module: 'row',
              children: []
            }, {
              module: 'row',
              children: []
            }, {
              module: 'row',
              children: []
            }, {
              module: 'row',
              children: []
            }, {
              module: 'row',
              children: []
            }, {
              module: 'row',
              children: []
            }]
          }]
        }, {
          module: 'section',
          children: []
        }]
      }
    };
  },

  render() {
    return (
      <div className="tree">
        <Tree tree={this.state.tree} onChange={this._onChange}/>
      </div>
    );
  },

  _onChange(tree) {
    this.setState({tree: tree});
  }
});

React.render(<App/>, document.body);