import React, {Component, PropTypes} from 'react'

import Ellipse from './Ellipse'
import Neuron from './Neuron'

export const CIRCLE = 'circle'
export const NEURON = 'neuron'



class Shape extends Component {


  render() {
    const shapeName = this.props.shapeName

    if(shapeName === CIRCLE) {
      return (
        <Ellipse
          width={this.props.size}
          height={this.props.size}
          style={this.props.style}
        />
      )
    } else {
      return (
        <Neuron
          data={this.props.data}
          size={10.0}
        />
      )

    }

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
  size: 10,
  shapeName: CIRCLE
};

export default Shape