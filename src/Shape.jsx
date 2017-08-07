import React, {Component, PropTypes} from 'react'
import Ellipse from './Ellipse'

export const CIRCLE = 'circle'


class Shape extends Component {

  render() {
    return (
      <Ellipse
        width={this.props.size}
        height={this.props.size}
        style={this.props.style}
      />
    )
  }
}

Shape.propTypes = {
  style: PropTypes.object,
  size: PropTypes.number
};

Shape.defaultProps = {
  style: {
    fill: 'none',
    stroke: 'green',
    strokeWidth: 1
  },
  size: 25,
  shapeName: CIRCLE
};

export default Shape