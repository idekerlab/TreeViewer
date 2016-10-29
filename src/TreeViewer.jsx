import React, {Component, PropTypes} from 'react'
import * as d3Hierarchy from 'd3-hierarchy'
import * as d3Trans from 'd3-transition'
import * as d3Select from 'd3-selection'

import Link from './Link'
import Node from './Node'


class TreeViewer extends Component {

  /**
   * Pre-render tree using D3
   */
  componentWillMount() {
    const {data, width, height} = this.props;
    const tree = d3Hierarchy.tree();
    tree.size([height, width* 0.8]);

    const cluster = d3Hierarchy.cluster().size([height, width* 0.9]);
    const root = d3Hierarchy.hierarchy(data, d => (d.children));

    tree(root);

    this.setState({
      root: root,
      tree: tree,
      cluster: cluster,
      isTree: true
    })
  }

  render() {
    const links = this.getLinks(this.state.root);
    const nodes = this.getNodes(this.state.root);

    const displacement = this.props.width * 0.06;
    const transform = 'translate(' + displacement + ',0)';

    return (
      <svg
        onClick={this.animate}
        width={this.props.width}
        height={this.props.height}>
        <g id="root"
           transform={transform}
        >
          {links}
          {nodes}
        </g>
      </svg>
    )
  }

  getNodes(node) {
    const children = node.children;
    let nodes = [];

    if(children === undefined) {
      return [];
    } else {
      if(node === this.state.root) {
        nodes.push(
          <Node
            node={node}
            nodeSize="24"
            fontSize='1.2em'
          />);
      }

      children.forEach(childNode => {
        nodes.push(
          <Node
            node={childNode}
            nodeSize='8'
            fontSize='1em'
          />);
        nodes = nodes.concat(this.getNodes(childNode));
      });

      return nodes;
    }
  }

  getLinks(node) {
    const children = node.children;
    let links = [];

    if(children === undefined) {
      return [];
    } else {
      children.forEach(childNode => {
        links.push(<Link node={childNode} />)
        links = links.concat(this.getLinks(childNode));
      });

      return links;
    }
  }

  animate = () => {
    console.log('######## click!!!!!');


    this.state.cluster(this.state.root)

    const t = d3Trans.transition().duration(2500);
    console.log(t);

    this.state.nodes.transition(t)
      .attr("transform", d =>("translate(" + d.y + "," + d.x + ")"))
      .select('circle').style("fill", d =>('teal'));
    this.state.links.transition(t).attr("d", Link.diagonal);
  }

  componentDidMount() {
    const rt = this.state.root;
    const g = d3Select.select("#root");
    console.log(g)

    const nodeSelection = g.selectAll(".node");
    console.log(nodeSelection);

    const nodes = nodeSelection.data(rt.descendants());
    console.log(nodes);

    const links = g.selectAll(".link")
      .data(rt.descendants().slice(1));

    this.setState({
      nodes: nodes,
      links: links
    })
  }


}


TreeViewer.propTypes = {

  // Style of the area used by the renderer
  style: PropTypes.object,

  // Tree data
  data: PropTypes.object,

  width: PropTypes.number,
  height: PropTypes.number,
  nodeSize: PropTypes.number
};

/**
 * Default values
 */
TreeViewer.defaultProps = {
  data: {},
  width: 1200,
  height: 3500,
  nodeSize: 10
};

export default TreeViewer