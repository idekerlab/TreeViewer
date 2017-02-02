import React, {Component, PropTypes} from 'react'


export const CIRCLE = 'circle'
export const NEURON = 'neuron'


import * as d3Scale from 'd3-scale'

const colorMapper = d3Scale.scaleLinear()
  .domain([0.0, 1.0])
  .range(["#444444", "#FFFFFF"]);


class Shape extends Component {

  // render() {
  //   return (
  //     <circle
  //       r={this.props.size}
  //       style={this.props.style}
  //     />
  //   )
  // }

  render() {
    console.log('################## SAHPE')

    const shapeName = this.props.shapeName

    return this.getShape(shapeName)
  }


  getShape = shapeName => {

    if(shapeName === CIRCLE) {
      return (
        <circle
          r={this.props.size}
          style={this.props.style}
        />
      )
    }

    const borderStyle = {
      fill: '#FFFFFF',
      stroke: '#333333',
      strokeWidth: 1
    }

    const pad = 20.0

    // Create fake neurons
    const min = 4
    const max = 9
    const numNeurons = Math.floor( (Math.random() * ( ( max + 1 ) - min ) ) + min )
    const neurons = []
    for(let i = 0; i<numNeurons; i++) {
      neurons.push(Math.random())
    }


    const r = 10
    const d = 2*r

    const h = d * numNeurons + pad

    console.log("h = " + h )

    const w = d + pad
    const dx = w
    const dy = h/2.0

    console.log("Num neuron: " + numNeurons)
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
        fill: d3Scale.interpolateCool(n),
        stroke: 'none',
      }

      return(
        <circle
          key={i}
          r={r-3}
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