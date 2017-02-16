import React, {Component, PropTypes} from 'react'

import Ellipse from './Ellipse'

export const CIRCLE = 'circle'
export const NEURON = 'neuron'


import * as d3Interpolate from 'd3-interpolate'

const colorMapper = d3Interpolate.interpolateHcl("white", "orange")


class Shape extends Component {


  render() {
    const shapeName = this.props.shapeName
    return this.getShape(shapeName)
  }


  getShape = shapeName => {

    if(shapeName === CIRCLE) {
      return (
        <Ellipse
          width={this.props.size}
          height={this.props.size}
          style={this.props.style}
        />
      )
    }

    const neurons = this.props.data.neurons

    const borderStyle = {
      fill: '#FFFFFF',
      stroke: '#333333',
      strokeWidth: 1
    }

    const pad = 3.0

    // Create fake neurons
    const numNeurons = neurons.length

    const r = 5
    const d = 2*r

    const h = d * numNeurons + pad

    const w = d + pad
    const dx = w
    const dy = h/2.0

    let isOdd = true
    if(numNeurons%2 === 0) {
      isOdd = false
    }
    console.log(isOdd)

    const half = Math.floor(numNeurons/2)
    console.log(half)

    let origin = 0
    if(isOdd) {
      origin = (half * d)  + d
    } else {
      origin = (half * d) + r
    }

    return (
      <g id={'neuron' + Math.random()}>
        <rect
          rx={3}
          ry={3}
          width={w}
          height={h}
          style={borderStyle}
          transform={"translate(" + (-dx) + "," + (-dy) + ")"}
        />

        {this.getNeurons(neurons, r, origin, pad)}
      </g>
    )
  }


  getNeurons = (neurons, r, origin, pad) => {


    const hDisp = -(r + pad/2)

    let start = -origin
    const dx = 2*r
    let i = 1

    return neurons.map(n => {

      i = i + 1
      start = start + dx

      const circleStyle = {
        fill: colorMapper(n),
        stroke: 'none',
      }

      return(
        <circle
          key={i}
          r={r-1}
          style={circleStyle}
          transform={"translate(" + hDisp + "," + start + ")"}
        />
      )
    })
  }

  getPosition = (position, ordinal, r, h) => {
    const x = position.x + (r * ordinal)
    const y = position.y

    return "translate(" + y + "," + x + ")"
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