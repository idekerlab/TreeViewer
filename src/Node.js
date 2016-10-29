import React, {Component} from 'react'
import Shape from './Shape'


class Node extends Component {

  render() {
    return(
      <g
        key={this.props.count + this.props.node.data.name}
        className={this.getClass(this.props.node)}
        onClick={this.props.onClick}
        transform={this.getTransform(this.props.node)}
      >
        <Shape
          size={this.props.nodeSize}
        />
        <text
          dy={this.props.nodeSize / 2}
          x={this.getX(this.props.node)}
          style={this.getStyle(this.props.node)}
        >
          {this.props.node.data.name}
        </text>
      </g>
    )
  }

  getClass = d => {
    return "node" + (d.children ? " node--internal" : " node--leaf");
  }

  getTransform = d => {
    return "translate(" + d.y + "," + d.x + ")";
  }

  getX = d => {
    const disp = this.props.nodeSize * 1.3;
    return d.children ? -disp: disp;
  }

  getStyle = d => {
    return {
      fontSize: this.props.fontSize,
      textAnchor: this.getAnchor(d)
    }
  }

  getAnchor = d => {
    return d.children ? "end" : "start";
  }
}

export default Node