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

    this.props.eventHandlers.nodeSelected(this.props.data)
  }

  handleMouseEnter = (event) => {
    console.log('Enter')
    this.setState({showTooltip: true})

    setTimeout(() => {
      if(this.state.showTooltip) {
        console.log("------Tooltip --------")
      }
    }, 1000)
  }

  handleMouseLeave = (event) => {
    console.log('Leave')
    this.setState({showTooltip: false})
  }

  render() {

    const textElement = this.getTextElement(this.props.data)


    const style = Object.assign({}, this.props.shapeStyle)

    if(this.state.selected) {
      style.fill = 'red'
      style.stroke = "orange"
      style.strokeWidth = "10"
    } else {
      style.fill = this.props.shapeStyle.fill
    }

    return (
      <g
        className={this.props.nodeType}
        transform={this.getTransform(this.props.position)}
        onClick={this.onClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Shape
          size={this.props.nodeSize}
          position={this.props.position}
          style={style}
          shapeName={this.props.shapeName}
        />

        {textElement}

      </g>
    )
  }


  getTransform = position => {
    return "translate(" + position.y + "," + position.x + ")";
  }

  getX = () => {
    const disp = this.props.nodeSize + 10;
    if(this.props.isRoot) {
      return disp
    }
    return this.props.isLeaf ? -disp : disp;
  }

  getY = () => {
    return this.props.isLeaf ? this.props.nodeSize : (this.props.nodeSize / 2 + 10);
  }


  getTextElement = data => {
    const key = this.props.labelKey
    let text = data[key]
    if (text === undefined || text === '') {
      text = this.props.id
    }

    if(text.length < 35) {
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
        key={String(Math.random())}
        dy={this.getY()}
        x={this.getX()}
        style={this.getStyle()}
      >
        {line1}
      </text>,
      <text
        key={String(Math.random())}
        dy={this.getY() + 20}
        x={this.getX()}
        style={this.getStyle()}
      >
        {line2}
      </text>
    ]


  }

  getStyle = () => {
    return {
      textAnchor: this.getAnchor(),
      fill: '#444444'
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
  eventHandlers: PropTypes.object
};

Node.defaultProps = {
  nodeType: 'node',
  isLeaf: false,
  isRoot: false,
  labelKey: 'name',
  nodeSize: 10,
  position: {x: 0, y: 0},
  eventHandlers: DEF_EVENT_HANDLERS
};

export default Node