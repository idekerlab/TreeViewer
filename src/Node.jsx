import React, {Component, PropTypes} from 'react'
import Shape from './Shape'


const DEF_EVENT_HANDLERS = {
  nodeSelected: selectedNode => {
    console.log("Node Selected:")
    console.log(selectedNode)
  }
}


class Node extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false,
      selected: false
    }
  }

  onClick = (event) => {
    console.log("----------- CLICK!!!!!!!!! --------------")
    this.setState({selected: !this.state.selected})
    this.props.eventHandlers.nodeSelected(this.props.id)
  }


  render() {

    const textElement = this.getTextElement(this.props.data)
    const style = Object.assign({}, this.props.shapeStyle)

    if(this.state.selected) {
      style.stroke = "#7a7a7a"
      style.strokeWidth = "6"
    } else {
      style.fill = this.props.shapeStyle.fill
    }

    let shapeName = this.props.shapeName

    return (
      <g
        className={this.props.nodeType}
        transform={this.getTransform(this.props.position)}
        onClick={this.onClick}
      >
        <Shape
          size={this.props.nodeSize}
          position={this.props.position}
          style={style}
          shapeName={shapeName}
          data={this.props.data}
        />

        {textElement}

      </g>
    )
  }


  getTransform = position => {
    return "translate(" + position.y + "," + position.x + ")";
  }

  getX = () => {
    const disp = this.props.nodeSize + 8;
    if(this.props.isRoot) {
      return disp
    }
    return this.props.isLeaf ? -disp : -(disp);
  }

  getY = () => {
    return this.props.isLeaf ? this.props.nodeSize/2 : (this.props.nodeSize + 17);
  }


  getTextElement = data => {
    const key = this.props.labelKey
    let text = data[key]
    if (text === undefined || text === '') {
      text = this.props.id
    }

    const areaWidth = this.props.areaWidth
    const fontSize = this.props.labelFontSize

    const maxCharLength = Math.floor((areaWidth - 10) / fontSize)

    if(text.length < maxCharLength) {
      return (
        [
          <text
            key={String(Math.random())}
            dy={this.getY()}
            x={this.getX()}
            style={this.getStyle()}
          >
            {text}
          </text>
        ]
      )
    }

    // Split the full name into words
    const words = text.split(/\s+/)
    const lines = []

    let lineCount = 0
    let currentLine = ''

    for(let i = 0; i<words.length; i++) {

      currentLine = currentLine + words[i] + ' '

      if(currentLine.length > maxCharLength) {

        lines.push({
          value: currentLine,
          dy: this.getY() + this.props.labelFontSize * 1.2 * lineCount
        })

        currentLine = ''
        lineCount++
      }

    }

    if(currentLine !== '') {
      lines.push({
        value: currentLine,
        dy: this.getY() + this.props.labelFontSize * 1.2 * lineCount
      })

    }

    return(
      lines.map(line => {
        return (
        <text
          key={String(Math.random())}
          dy={line.dy}
          x={this.getX()}
          style={this.getStyle()}
        >
          {line.value}
        </text>
        )
      })
    )
  }

  getStyle = () => {
    return {
      textAnchor: this.getAnchor(),
      fill: this.props.labelColor,
      fontFamily: "SansSerif",
      fontSize: this.props.labelFontSize,
      fontWeight: 700
    }
  }

  getAnchor = () => {
    // Special case: Root
    if(this.props.isRoot) {
      return 'middle'
    }

    return this.props.isLeaf ? 'end' : 'start'
  }

}


Node.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLeaf: PropTypes.bool,
  isRoot: PropTypes.bool,
  labelKey: PropTypes.string,
  nodeType: PropTypes.string,
  position: PropTypes.object,
  nodeSize: PropTypes.number,
  eventHandlers: PropTypes.object,
  showLabel: PropTypes.bool,
  areaWidth: PropTypes.number,
  areaHeight: PropTypes.number,
  labelFontSize: PropTypes.number,
  labelColor: PropTypes.string
};

Node.defaultProps = {
  nodeType: 'node',
  isLeaf: false,
  isRoot: false,
  labelKey: 'name',
  nodeSize: 25,
  position: {x: 0, y: 0},
  eventHandlers: DEF_EVENT_HANDLERS,
  showLabel: true,
  labelFontSize: 15,
  labelColor: '#333333'

};

export default Node