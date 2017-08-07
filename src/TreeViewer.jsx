import React, {Component, PropTypes} from 'react'

import * as d3Hierarchy from 'd3-hierarchy'

import Link from './Link'
import Node from './Node'

import ZoomableViewer from './ZoomableViewer'


/**
 *
 * Simple tree data renderer for D3.js style tree data.
 *
 */
class TreeViewer extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }

  }

  layoutTree = subtree => {
    const {data, style} = subtree
    const width = style.width
    const height = style.height

    // Create D3 instance of the tree
    const cluster = d3Hierarchy.cluster()
      .size([height, width]);

    cluster.nodeSize([40, 260])
    const root = d3Hierarchy.hierarchy(data, d => (d.children));

    cluster(root)
    this.setState({
      root: root,
      cluster: cluster,
      y: height/2.0
    })
  }
  /**
   * Pre-render tree using D3
   */
  componentWillMount() {
    this.layoutTree(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data !== this.props.data) {
      console.log("Updating tree--------------")
      console.log(nextProps.data)
      this.layoutTree(nextProps)
    }
  }


  render() {

    console.log("{{{{{{{{{{{{{{{{{{{{ Rendering TRE }}}}}}}}}}}}}}}}}}}}}}}}}}}}}")
    const links = this.getLinks(this.state.root);
    const nodes = this.getNodes(this.state.root);

    console.log(links)
    console.log(nodes)


    return (
      <ZoomableViewer
        style={this.props.style}
        initialPosition={{
          x: 50,
          y: this.props.style.height/2.0
        }}
        >
        {links}
        {nodes}
      </ZoomableViewer>
    )
  }



  getNodes(node) {

    const children = node.children;
    let nodes = [];

    const rootStyle = {
      fill: 'white',
      stroke: '#888888',
      strokeOpacity: 1,
      strokeWidth: 2
    }

    if(children === undefined) {
      return [];
    } else {

      if(node === this.state.root) {
        nodes.push(
          <Node
            key={Math.random()}
            id={node.data.name}
            data={node.data}
            isRoot={true}
            nodeSize={15}
            position={{x: node.x, y: node.y}}
            fontSize='1.2em'
            labelKey={this.props.label}
            shapeStyle={rootStyle}
          />);
      }

      children.forEach(childNode => {
        const isLeaf = childNode.children ? true : false
        nodes.push(
          <Node
            key={Math.random()}
            id={childNode.data.name}
            data={childNode.data}
            isLeaf={isLeaf}
            position={{x: childNode.x, y: childNode.y}}
            nodeSize={10}
            fontSize='1em'
            labelKey={this.props.label}
            shapeStyle={this.getShapeStyle(childNode)}
          />);
        nodes = nodes.concat(this.getNodes(childNode));
      });

      return nodes;
    }
  }

  getSize = (node) => {

    const score = node.data.score

    if(score >= 1) {
      return 10
    }

    return score * 50

  }


  getLinks(node) {
    const children = node.children;
    let links = [];

    if(children === undefined) {
      return [];
    } else {
      children.forEach(childNode => {
        links.push(
          <Link
            key={node.data.name + '-' + childNode.data.name}
            positions={{
              source: {x: childNode.x, y: childNode.y},
              target: {x: node.x, y: node.y}
            }}
            style={this.getLinkStyle(childNode)}
          />)
        links = links.concat(this.getLinks(childNode));
      });

      return links;
    }
  }


  // This should be an injectable function
  getShapeStyle = node => {


    const namespace = node.data.namespace

    const style = {
      fill: '#aaaaaa'
    }

    if(namespace === 'biological_process') {
      style.fill = '#4393C3'
    } else if (namespace === 'cellular_component') {
      style.fill = '#F57C00'
    }

    return style
  }

  getLinkStyle = childNode => {

    const data = childNode.data
    const namespace = data.namespace

    const defStyle = {
      fill: 'none',
      stroke: '#aaaaaa',
      strokeOpacity: 0.8,
      strokeWidth: '0.1em'
    }

    if(namespace === undefined || namespace === '') {
      return defStyle
    } else if(namespace === 'biological_process') {
      defStyle.stroke = '#4393C3'
    } else if (namespace === 'cellular_component') {
      defStyle.stroke = '#F57C00'
    }

    return defStyle

  }

}


TreeViewer.propTypes = {

  // Style of the area used by the D3.js renderer
  style: PropTypes.object,

  // Tree data in D3.js tree format
  data: PropTypes.object,

  // Key property name for the label
  label: PropTypes.string,

  // Size of tree node
  nodeWidth: PropTypes.number
}

TreeViewer.defaultProps = {
  data: {},
  style: {
    width: 1500,
    height: 1000,
    background: '#FFFFFF'
  },
  label: 'name',
  nodeSize: 10
}

export default TreeViewer