import React, {Component, PropTypes} from 'react'
import Shape from './Shape'


const DEF_EVENT_HANDLERS = {
  nodeSelected: selectedNode => {
    console.log("Node Selected:")
    console.log(selectedNode)
  }
}


class Node extends Component {

  onClick = (event) => {
    console.log(event)
    console.log(this.props.node)
    this.props.eventHandlers.nodeSelected(this.props.node)
  }

  render() {
    const textElement = this.getTextElement(this.props.node)


    return (
      <g
        key={this.props.count + this.props.node.data.name}
        className={this.getClass(this.props.node)}
        onClick={this.onClick}
        transform={this.getTransform(this.props.node)}
      >
        <Shape
          size={this.props.nodeSize}
          style={this.props.shapeStyle}
        />

        {textElement.map( tElem => (tElem))}
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
    const disp = this.props.nodeSize + 5;
    return d.children ? -disp : disp;
  }

  getY = d => (d.children ? this.props.nodeSize : this.props.nodeSize / 2)


  getTextElement = node => {

    let text = node.data[this.props.label]
    if (text === undefined || text === '') {
      text = node.data.name
    }

    console.log(text)

    if(text.length < 35) {
      return (
        [
          <text
            dy={this.getY(node)}
            x={this.getX(node)}
            style={this.getStyle(node)}
          >
            {text}
          </text>
        ]
      )
    }

    // text = text.substring(0,40) + '...'

    const words = text.split(/\s+/)
    let line1 = ''
    let line2 = ''

    let i = 0
    for(i; i<words.length; i++) {
      if(line1.length < 30) {
        line1 = line1 + words[i] + ' ';
      } else {
        line2 = line2 + words[i] + ' '
      }

      if(line2.length >= 30) {
        if(words.length >i) {
          line2 = line2 + '...'
        }
        break;
      }
    }


    return [
      <text
        dy={this.getY(node)}
        x={this.getX(node)}
        style={this.getStyle(node)}
      >
        {line1}
      </text>,
      <text
        dy={this.getY(node) + 12}
        x={this.getX(node)}
        style={this.getStyle(node)}
      >
        {line2}
      </text>
    ]


  }

  getStyle = d => {
    return {
      // fontSize: this.props.fontSize,
      textAnchor: this.getAnchor(d)
    }
  }

  getAnchor = d => {
    // Special case: Root
    if(d.parent === undefined || d.parent === null) {
      return 'start'
    }

    return d.children ? "end" : "start";
  }

}


Node.propTypes = {
  node: PropTypes.object,
  eventHandlers: PropTypes.object
};

Node.defaultProps = {
  eventHandlers: DEF_EVENT_HANDLERS
};

export default Node