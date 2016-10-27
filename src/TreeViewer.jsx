import React, {Component, PropTypes} from 'react'
import * as d3Hierarchy from 'd3-hierarchy'
import * as d3Selection from 'd3-selection'


class TreeViewer extends Component {

  componentDidMount() {
    this.renderTree(this.props.data)
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }


  renderTree = data => {
    const g = d3Selection.select("#root");
    const width = this.props.width;
    const height = this.props.height;

    const tree = d3Hierarchy.tree()
      .size([height - 400, width - 160]);
    const root = d3Hierarchy.hierarchy(data, function(d) {
      return d.children;
    });

    const result = tree(root);
    console.log(result)

    this.renderLinks(g, root);
    this.renderNodes(g, root);
  }

  renderLinks = (g, root) => {
    g.selectAll(".link")
      .data(root.descendants().slice(1))
      .enter().append("path")
      .attr("class", "link")
      .attr("d", this.diagonal);
  };

  renderNodes = (g, root) => {
    var node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", d => { return "node" + (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", d => { return "translate(" + d.y + "," + d.x + ")"; });

    node.append("circle").attr("r", 12.5);

    node.append("text")
      .style('font', '0.3em sans-serif')
      .attr("dy", 3)
      .attr("x", d => { return d.children ? -8 : 8; })
      .style("text-anchor", d => { return d.children ? "end" : "start"; })
      .text(d => (d.data.name));
  };

  diagonal = d => {
    return "M" + d.y + "," + d.x
      + "C" + (d.parent.y + 100) + "," + d.x
      + " " + (d.parent.y + 100) + "," + d.parent.x
      + " " + d.parent.y + "," + d.parent.x;
  };

  render() {

    return (
        <svg
          width={this.props.width}
          height={this.props.height}>
          <g id="root" transform="translate(40,0)"></g>
        </svg>
    )
  }
}


TreeViewer.propTypes = {

  // Style of the area used by the renderer
  style: PropTypes.object,

  // Tree data
  data: PropTypes.object,

  width: PropTypes.string,
  height: PropTypes.string
};

/**
 * Default values
 */
TreeViewer.defaultProps = {
  data: {},
  width: '1000',
  height: '1400'
};

export default TreeViewer