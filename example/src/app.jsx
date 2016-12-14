import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import TreeViewer from 'tree-viewer'

// Sample network data in Cytoscape.js JSON format
const data = require('./tree3.json');

// HTML section to be used for rendering component
const TAG = 'viewer';


const width = document.body.clientWidth

console.log(width)

ReactDOM.render(
  <TreeViewer
    data={data}
    label="long_name"
    width={width}
    height={1000}
  />,
  document.getElementById(TAG)
);
