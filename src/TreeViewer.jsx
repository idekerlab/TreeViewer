import React, {Component, PropTypes} from 'react'

import * as d3Hierarchy from 'd3-hierarchy'
import * as d3Scale from 'd3-scale'
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
    tree.size([height, width * 0.7]);

    const cluster = d3Hierarchy.cluster().size([height, width]);
    cluster.nodeSize([40, 260])

    const root = d3Hierarchy.hierarchy(data, d => (d.children));

    // tree(root);

    cluster(root)

    this.setState({
      root: root,
      tree: tree,
      cluster: cluster,
      isTree: true,
      zoom: 1.0
    })
  }

  componentWillReceiveProps(nextProps) {
    const {data, width, height} = nextProps;
    const tree = d3Hierarchy.tree();
    tree.size([height, width * 0.7]);

    const cluster = d3Hierarchy.cluster().size([height, width]);
    cluster.nodeSize([40, 260])

    const root = d3Hierarchy.hierarchy(data, d => (d.children));

    // tree(root);

    cluster(root)

    this.setState({
      root: root,
      tree: tree,
      cluster: cluster,
      isTree: true,
      zoom: 0.71
    })

  }


  handleScroll = e => {
    console.log(e)

    const wDelta = e.wheelDelta;
    console.log(wDelta);
  }


  getZoom = () => {

  }


  render() {

    console.log('************* 222 TREE RENDERING )))))))))))))))))))))))))))))')
    console.log(this.props.data)
    console.log(this.state)
    console.log(this.state.root.descendants())

    const links = this.getLinks(this.state.root);
    const nodes = this.getNodes(this.state.root);
    console.log(links)
    console.log(nodes)

    const displacement = 40;
    const transform = 'translate(' + displacement + ',' + this.props.height/2+'), scale(' + this.state.zoom + ')'

    return (
      <svg
        width={this.props.width}
        height={this.props.height}>
        <defs>
          <marker
            id="type1"
            markerUnits="strokeWidth"
            markerWidth="12"
            markerHeight="12"
            viewBox="0 0 10 10"
            refX="12"
            refY="5"
            orient="auto">

            <polygon
              points="0,0 5,5 0,10 10,5"
              id="arrow1"
              fill="#888888"
            />
          </marker>
        </defs>
        <g id="root"
           transform={transform}

           onWheel={this.handleScroll}
        >
          {links}
          {nodes}
        </g>
      </svg>
    )
  }



  getNodes(node) {

    console.log('[[[[[[ CUR NODE ]]]]')
    console.log(node)
    const children = node.children;
    let nodes = [];

    const rootStyle = {
      fill: 'white',
      stroke: '#888888',
      strokeOpacity: 1,
      strokeWidth: 2
    }

    console.log(children)

    if(children === undefined) {
      return [];
    } else {
      if(node === this.state.root) {
        nodes.push(
          <Node
            node={node}
            nodeSize="15"
            fontSize='1.2em'
            label={this.props.label}
            shapeStyle={rootStyle}
          />);
      }

      children.forEach(childNode => {
        nodes.push(
          <Node
            node={childNode}
            nodeSize={this.getSize(childNode)}
            fontSize='1em'
            label={this.props.label}
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
            node={childNode}
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


  animate = () => {
    console.log('######## 2click!!!!!');


    const rt = this.state.root;
    this.state.cluster(rt)

    const g = d3Select.select("#root");
    console.log(g)

    const nodeSelection = g.selectAll(".node");
    console.log(nodeSelection);

    const nodes = nodeSelection.data(rt.descendants());
    console.log(nodes);

    const links = g.selectAll(".link")
      .data(rt.descendants().slice(1));


    const t = d3Trans.transition().duration(2500);
    console.log(t);

    nodes.transition(t)
      .attr("transform", d =>("translate(" + d.y + "," + d.x + ")"))
      .select('circle').style("fill", d =>('teal'));

    links.transition(t).attr("d", Link.diagonal);
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


  zoom = () => {
    // const scale = d3Scale.scale
    //   translation = d3.event.translate,
    //   tbound = -h * scale,
    //   bbound = h * scale,
    //   lbound = (-w + m[1]) * scale,
    //   rbound = (w - m[3]) * scale;
    // // limit translation to thresholds
    // translation = [
    //   Math.max(Math.min(translation[0], rbound), lbound),
    //   Math.max(Math.min(translation[1], bbound), tbound)
    // ];
    // d3.select(".drawarea")
    //   .attr("transform", "translate(" + translation + ")" +
    //     " scale(" + scale + ")");
  }


}


TreeViewer.propTypes = {

  // Style of the area used by the renderer
  style: PropTypes.object,

  // Tree data
  data: PropTypes.object,

  label: PropTypes.string,

  width: PropTypes.number,
  height: PropTypes.number,
  nodeSize: PropTypes.number
};

/**
 * Default values
 */
TreeViewer.defaultProps = {
  data: {},
  label: 'name',
  width: 1200,
  height: 3500,
  nodeSize: 10
};

export default TreeViewer