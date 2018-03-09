import React, { Component, PropTypes } from 'react'
import Shape from './Shape'
import RoundRect from './RoundRect'

const DEF_EVENT_HANDLERS = {
  nodeSelected: selectedNode => {
    console.log('Node Selected:')
    console.log(selectedNode)
  }
}

class Node extends Component {
  constructor(props) {
    super(props)

    const annotations = [
      {
        note: {
          label:
            'Basic settings with subject position(x,y) and a note offset(dx, dy)',
          title: 'd3.annotationLabel'
        },
        x: props.position.x,
        y: props.position.y,
        dy: 137,
        dx: 162
      }
    ]

    this.state = {
      showTooltip: false,
      selected: false,
      annotations
    }
  }

  onClick = event => {
    console.log('----------- CLICK!!!!!!!!! --------------')
    this.setState({ selected: !this.state.selected })
    this.props.eventHandlers.nodeSelected(this.props.id)
  }

  onMouseEnter = event => {
    console.log(this.props)
    this.setState({ showTooltip: true })
  }

  onMouseLeave = event => {
    this.setState({ showTooltip: false })
  }

  getAnnotation = props => {

    if (!this.state.showTooltip) {
      return <text />
    }

    const container = []

    container.push(<RoundRect
      x={this.getX() + 30}
      y={this.getY() + 30}
    />)

    return container
  }

  getAnnotationText = props => {

    if (!this.state.showTooltip) {
      return <text />
    }

    const text = props.id + " = " + props.data['score']

    const annotationStyle = {
      textAnchor: 'start',
      fill: '#444444',
      fontFamily: 'SansSerif',
      fontSize: 14,
      fontWeight: 500,
    }

    return (
      <text
        key={String(Math.random())}
        x={this.getX() + 35}
        dy={this.getY() + 53}
        style={annotationStyle}
      >
        {text}
      </text>
    )
  }

  render() {
    const textElement = this.getTextElement(this.props.data)

    const annotation = this.getAnnotation(this.props)
    const annotationText = this.getAnnotationText(this.props)

    const style = Object.assign({}, this.props.shapeStyle)

    if (this.state.selected) {
      // style.stroke = '#7a7a7a'
      // style.strokeWidth = '6'
    } else {
      if (this.state.showTooltip) {
        style.fill = 'yellow'
      } else {
        style.fill = this.props.shapeStyle.fill
      }
    }

    let shapeName = this.props.shapeName

    return (
      <g
        className={this.props.nodeType}
        transform={this.getTransform(this.props.position)}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Shape
          size={this.props.nodeSize}
          position={this.props.position}
          style={style}
          shapeName={shapeName}
          data={this.props.data}
        />

        {textElement}

        {annotation}
        {annotationText}
      </g>
    )
  }

  getTransform = position => {
    return 'translate(' + position.y + ',' + position.x + ')'
  }

  getX = () => {
    const disp = this.props.nodeSize + 8
    if (this.props.isRoot) {
      return 0
    }
    return this.props.isLeaf ? -disp : -disp
  }

  getY = () => {
    return this.props.isLeaf
      ? this.props.nodeSize / 2
      : this.props.nodeSize + 17
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

    if (text.length < maxCharLength) {
      return [
        <text
          key={String(Math.random())}
          dy={this.getY()}
          x={this.getX()}
          style={this.getStyle()}
        >
          {text}
        </text>
      ]
    }

    // Split the full name into words
    const words = text.split(/\s+/)
    const lines = []

    let lineCount = 0
    let currentLine = ''

    for (let i = 0; i < words.length; i++) {
      currentLine = currentLine + words[i] + ' '

      if (currentLine.length > maxCharLength) {
        lines.push({
          value: currentLine,
          dy: this.getY() + this.props.labelFontSize * 1.2 * lineCount
        })

        currentLine = ''
        lineCount++
      }
    }

    if (currentLine !== '') {
      lines.push({
        value: currentLine,
        dy: this.getY() + this.props.labelFontSize * 1.2 * lineCount
      })
    }

    return lines.map(line => {
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
  }

  getStyle = () => {
    return {
      textAnchor: this.getAnchor(),
      fill: this.props.labelColor,
      fontFamily: 'SansSerif',
      fontSize: this.props.labelFontSize,
      fontWeight: 700,
      fontStyle: 'italic'
    }
  }

  getAnchor = () => {
    // Special case: Root
    if (this.props.isRoot) {
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
}

Node.defaultProps = {
  nodeType: 'node',
  isLeaf: false,
  isRoot: false,
  labelKey: 'name',
  nodeSize: 25,
  position: { x: 0, y: 0 },
  eventHandlers: DEF_EVENT_HANDLERS,
  showLabel: true,
  labelFontSize: 15,
  labelColor: '#333333'
}

export default Node
