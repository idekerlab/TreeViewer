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

    const jsnodes = this.props.data.elements.nodes
    const jsedges = this.props.data.elements.edges

    const g = new dagre.graphlib.Graph();

    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}))

    jsnodes.forEach(n => {
      const keys = Object.keys(n.data)
      const minimalData = {
        label: n.data.name,
        width: this.props.areaHeight,
        height: this.props.areaWidth
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


    let scaling = 1.0

    if(this.props.expand) {
      scaling = 5.0
    }

    g.nodes().forEach(v => {
      const n = g.node(v)
      const x = n.x
      const y = n.y

      g.node(v).x = x * scaling
      g.node(v).y = y
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

      const node = g.node(v)

      const dType = node.type
      let name = node.label

      let isLeaf = false

      let score = node.score
      let phenotype = node.phenotype
      let neurons = node.neurons

      if(score === undefined || score === NaN) {
        score = 0
      }

      // let nodeSize = Math.log(score * 1000 + 1) * 5 + 5
      // if(nodeSize <= 0.0 || nodeSize === NaN) {
      //   nodeSize = 5
      // }

      let nodeSize = 10
      let labelFontSize = 8

      let fillColor = '#26C6DA'
      let labelColor = '#333333'

      if(score === -1) {
        nodeSize = 2
        fillColor = '#CCCCCC'
        labelFontSize = 1
        labelColor = '#BBBBBB'
      }

      let shapeName = 'circle'

      if(this.props.expand) {
        shapeName = 'neuron'
      }


      let nodeType = 'node'

      const style = {
        fill: fillColor,
        stroke: 'none',
        shapeName: shapeName
      }

      if(dType === 'gene') {
        isLeaf = true
        nodeSize = 10
        shapeName='circle'
        style.fill = 'orange'
        style.stroke = 'none'
        labelFontSize = 25
        neurons = []

      } else if(name === 'GO:00SUPER') {

        console.log(node)
        nodeSize = 10

        if(nodeSize === undefined || nodeSize <= 0.0 || nodeSize === NaN) {
          nodeSize = 5
        }
        nodeType = 'origin'
        shapeName='circle'
        style.fill = '#f44336'
        style.stroke = 'none'
        labelFontSize = 15

        if(phenotype === -1) {
          name = 'N/A'
        } else {
          name = 'Growth Rate = ' + (Number(phenotype.toFixed(6)).toExponential()).toString()
        }
      }

      nodes.push(
        <Node
          key={Math.random()}
          nodeType={nodeType}
          id={node.id}
          data={{
            name: name,
            neurons: neurons
          }}
          position={{x: node.x, y: node.y}}
          isLeaf={isLeaf}
          nodeSize={nodeSize}
          fontSize='2em'
          labelKey="name"
          shapeStyle={style}
          shapeName={shapeName}

          eventHandlers={
            {
              nodeSelected: this.props.nodeSelected
            }
          }
          areaWidth={this.props.areaWidth}
          areaHeight={this.props.areaHeight}

          labelFontSize={labelFontSize}
          labelColor={labelColor}

          expand={this.props.expand}
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
        stroke: '#777777',
        strokeOpacity: 0.4,
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

  // Style data for nodes and edges
  dagStyle: PropTypes.object,

  // Key property name for node label
  label: PropTypes.string,


  nodeSelected: PropTypes.func,

  // Size of tree node
  areaWidth: PropTypes.number,
  areaHeight: PropTypes.number

}

DAGViewer.defaultProps = {
  data: {},
  style: {
    width: 1500,
    height: 1000,
    background: '#FFFFFF'
  },
  dagStyle: {

  },
  label: 'name',
  nodeSize: 10,

  nodeSelected: function(selectedNode) {
    console.log('# Node Selected: ')
    console.log(selectedNode)
  },

  areaWidth: 130,
  areaHeight: 15


}

export default DAGViewer