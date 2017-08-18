import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {TreeViewer, DAGViewer} from 'tree-viewer'

// Sample network data in Cytoscape.js JSON format
const data = require('./tree3.json');
const dag = require('./dag3.json');

// HTML section to be used for rendering component
const TAG = 'viewer';


const width = document.body.clientWidth
const height = window.innerHeight

const style = {
  width: width,
  height: height,
  background: 'black'
}

ReactDOM.render(
  <div>
    <DAGViewer
      data={dag}
      label="name"
      style={style}
    />
  </div>,
  document.getElementById(TAG)
);
