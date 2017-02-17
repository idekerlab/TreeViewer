import React, {Component, PropTypes} from 'react'
import * as d3Interpolate from 'd3-interpolate'


const colorMapper = d3Interpolate.interpolateHcl("white", "orange")

export const NEURON = 'neuron'


/*
    Custom shape for neurons
 */
class Neuron extends Component {

  render() {

    // Grab neuron data array
    let neurons = this.props.data.neurons
    if(neurons === undefined ||  neurons === null) {
      neurons = []
    }

    // Style object for the border line
    const borderStyle = this.props.borderStyle

    // Space between circles
    const pad = this.props.pad

    const size = this.props.size

    // Create fake neurons
    const numNeurons = neurons.length

    const r = size/2.0
    const d = size
    const h = numNeurons === 0 ? size * 1.5 : d * numNeurons + pad
    const w = d + pad
    const dx = w
    const dy = h/2.0

    let isOdd = true
    if(numNeurons%2 === 0) {
      isOdd = false
    }

    const half = Math.floor(numNeurons/2)

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
}

Neuron.propTypes = {
  borderStyle: PropTypes.object,
  pad: PropTypes.number,
  backgroundColor: PropTypes.string,

  // Size of the neuron (circles)
  size: PropTypes.number,
  data: PropTypes.object
};

Neuron.defaultProps = {

  data: {},
  borderStyle: {
    fill: '#FFFFFF',
    stroke: '#555555',
    strokeWidth: 1
  },
  size: 6.0,
  backgroundColor: 'orange',
  pad: 3.0
};

export default Neuron

