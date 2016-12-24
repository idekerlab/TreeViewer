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
      dagEdges: []
    }
  }

  createDag = dag => {


    console.log("Generating DAG 2")

    const jsnodes = this.props.data.elements.nodes
    const jsedges = this.props.data.elements.edges

    const g = new dagre.graphlib.Graph();

    g.setGraph({});

    g.setDefaultEdgeLabel(function() { return {}; });

    jsnodes.forEach(n => {
      g.setNode(n.data.id, { label: n.data.name,  width: 100, height: 100 });

    })

    jsedges.forEach(e => {
      g.setEdge(e.data.source, e.data.target);

    })

    // g.setNode("kspacey",    { label: "Kevin Spacey",  width: 144, height: 100 });
    // g.setNode("swilliams",  { label: "Saul Williams", width: 160, height: 100 });
    // g.setNode("bpitt",      { label: "Brad Pitt",     width: 108, height: 100 });
    // g.setNode("hford",      { label: "Harrison Ford", width: 168, height: 100 });
    // g.setNode("lwilson",    { label: "Luke Wilson",   width: 144, height: 100 });
    // g.setNode("kbacon",     { label: "Kevin Bacon",   width: 121, height: 100 });
    //
    // g.setNode("foo",     { label: "foo",   width: 121, height: 100 });
    // g.setNode("bar",     { label: "bar",   width: 121, height: 100 });
    // g.setNode("baz",     { label: "baz",   width: 121, height: 100 });

// Add edges to the graph.
//     g.setEdge("kspacey",   "swilliams");
//     g.setEdge("swilliams", "kbacon");
//     g.setEdge("bpitt",     "kbacon");
//     g.setEdge("hford",     "lwilson");
//     g.setEdge("lwilson",   "kbacon");
//
//     g.setEdge("kbacon", "foo");
//     g.setEdge("kbacon", "bar");
//     g.setEdge("kbacon", "baz");

    dagre.layout(g);


    const graph = {}
    g.nodes().forEach(v => {
      const n = g.node(v)
      const x = n.x
      const y = n.y

      g.node(v).x = x
      g.node(v).y = y * 3
    })

    const nodes = this.getNodes(g)
    const links = this.getLinks(g)

    this.setState({dagNodes: nodes})
    this.setState({dagLinks: links})
  }


  getNodes = g => {
    const style = {
      fill: 'blue',
      stroke: '#888888',
      strokeOpacity: 1,
      strokeWidth: 2
    }

    const vs = g.nodes()
    const nodes = []

    vs.forEach(v => {
      const node = g.node(v)

      console.log(node)
      nodes.push(
        <Node
          key={Math.random()}
          id={node.label}
          data={{name: node.label}}
          position={{x: node.x, y: node.y}}
          nodeSize={20}
          fontSize='1em'
          labelKey="name"
          shapeStyle={style}
        />);

    })

    return nodes
  }

  getLinks = g => {
    const style = {
      fill: 'none',
      stroke: '#aaaaaa',
      strokeOpacity: 0.8,
      strokeWidth: '0.1em'
    }
    const es = g.edges()

    const links = []

    es.forEach(e => {
      const target = g.node(e.v)
      const source = g.node(e.w)

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