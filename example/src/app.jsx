import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {TreeViewer, DAGViewer} from 'tree-viewer'

// Sample network data in Cytoscape.js JSON format
const data = require('./tree3.json');
const dag = require('./dag3.json');

// HTML section to be used for rendering component
const TAG = 'viewer';


const width = document.body.clientWidth

const style = {
  width: width,
  height: 500
}
const style2 = {
  width: width,
  height: 1200,
  background: 'black'
}

ReactDOM.render(
  <div>
    {/*<TreeViewer*/}
      {/*data={data}*/}
      {/*label="long_name"*/}
      {/*style={style}*/}
    {/*/>*/}
    <DAGViewer
      data={dag}
      label="name"
      style={style2}
    />
  </div>,
  document.getElementById(TAG)
);
