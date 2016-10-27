import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import TreeViewer from 'tree-viewer'

// Sample network data in Cytoscape.js JSON format
const data = require('./tree.json');

// HTML section to be used for rendering component
const TAG = 'viewer';

ReactDOM.render(
  <TreeViewer
    data={data}
  />,
  document.getElementById(TAG)
);
