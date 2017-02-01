import React, {Component, PropTypes} from 'react'

import Link from './Link'
import Node from './Node'

import * as dagre from 'dagre'

import ZoomableViewer from './ZoomableViewer'

/**
 *
 * Simple DAG renderer for D3.js style tree data.
 *
 */
class DAGViewer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dagNodes: [],
      dagEdges: [],
    }
  }


  createDag = () => {

    console.log("Generating DAG 2")

    const jsnodes = this.props.data.elements.nodes
    const jsedges = this.props.data.elements.edges

    const g = new dagre.graphlib.Graph();

    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}))

    jsnodes.forEach(n => {
      console.log(n)


      const keys = Object.keys(n.data)

      const minimalData = {
        label: n.data.name,
        width: 70,
        height: 70
      }

      const dataFields = keys.map(key => {
        return minimalData[key] = n.data[key]
      })

      g.setNode(n.data.id, minimalData);

    })

    const edgeMap = {}

    jsedges.forEach(e => {
      g.setEdge(e.data.source, e.data.target);
      edgeMap[e.data.source+e.data.target] = e.data.in_tree
    })

    console.log(edgeMap)

    // Layout using the library
    dagre.layout(g);

    g.nodes().forEach(v => {
      console.log('NODE:')
      console.log(v)

      const n = g.node(v)
      const x = n.x
      const y = n.y

      g.node(v).x = x * 2.5
      g.node(v).y = y * 4
    })

    const nodes = this.getNodes(g)
    const links = this.getLinks(g, edgeMap)

    this.setState({
      dagNodes: nodes,
      dagLinks: links
    })
  }


  getNodes = g => {

    const vs = g.nodes()
    const nodes = []

    vs.forEach(v => {

      const style = {
        fill: 'none',
        strokeWidth: 3,
        stroke: '#FFFFFF'
      }

      const node = g.node(v)

      const dType = node.type
      let isLeaf = false

      let score = node.score

      if(score === undefined || score === NaN) {
        score = 1.0
      }

      let nodeSize = Math.log(score * 100) * 2 + 3

      let shapeName = 'neuron'


      let nodeType = 'node'
      if(dType === 'gene') {
        isLeaf = true
        nodeSize = 13
        shapeName='circle'
        style.fill = 'orange'
        style.stroke = 'none'
      } else if(dType === 'origin') {

        console.log('------------------------ !!!!!!!!!!!!! ORG!')
        nodeSize = 20
        nodeType = 'origin'
      }

      nodes.push(
        <Node
          key={Math.random()}
          nodeType={nodeType}
          id={node.label}
          data={{name: node.label}}
          position={{x: node.x, y: node.y}}
          isLeaf={isLeaf}
          nodeSize={nodeSize}
          fontSize='2em'
          labelKey="name"
          shapeStyle={style}
          shapeName={shapeName}
        />);

    })

    return nodes
  }

  getLinks = (g, edgeMap) => {

    const es = g.edges()
    const links = []

    es.forEach(e => {

      let style = {
        fill: 'none',
        stroke: '#FFFFFF',
        strokeOpacity: 0.6,
        strokeWidth: 1
      }

      const target = g.node(e.v)
      const source = g.node(e.w)

      const eType = edgeMap[e.v+e.w]

      if(eType === 'TREE') {
        style = {
          fill: 'none',
          stroke: '#0099CC',
          strokeOpacity: 0.7,
          strokeWidth: 1
        }
      }

      links.push(
        <Link
          key={target.label + '-' + source.label}
          positions={{
            source: {x: source.x, y: source.y},
            target: {x: target.x, y: target.y}
          }}
          style={style}
        />)
    })

    return links
  }



  /**
   * Pre-render tree using D3
   */
  componentWillMount() {
    this.createDag()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data !== this.props.data) {
      console.log("Updating tree--------------")
      this.createDag()
    }
  }


  render() {

    console.log("{{{{{{{{{{{{{{{{{{{{ Rendering DAG Wrapper }}}}}}}}}}}}}}}}}}}}}}}}}}}}}")


    return (
      <ZoomableViewer
        style={this.props.style}
      >
          {this.state.dagLinks}
          {this.state.dagNodes}
      </ZoomableViewer>
    )
  }
}


DAGViewer.propTypes = {

  // Style of the area used by the D3.js renderer
  style: PropTypes.object,

  // DAG data in CX
  data: PropTypes.object,

  // Key property name for node label
  label: PropTypes.string,

  // Size of tree node
  nodeWidth: PropTypes.number

}

DAGViewer.defaultProps = {
  data: {},
  style: {
    width: 1500,
    height: 1000,
    background: '#FFFFFF'
  },
  label: 'name',
  nodeSize: 10
}

export default DAGViewer