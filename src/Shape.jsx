import React, {Component, PropTypes} from 'react'


export const CIRCLE = 'circle'
export const NEURON = 'neuron'


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
      fill: 'none',
      stroke: '#EFEFEF',
      strokeWidth: 1.0
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


    const r = 8
    const d = 2*r

    const h = d * numNeurons + (pad/2.0 * (numNeurons-1)) + pad
    const w = d + pad
    const dx = w
    const dy = h/2.0

    let origin = (numNeurons/2) * d + d
    if(numNeurons%2 === 0) {
      origin = (numNeurons/2) * d + 2*d + pad/2
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
      start = start + dx + pad/2

      return(
        <circle
          key={i}
          r={r}
          style={this.props.style}
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
    strokeWidth: 2
  },
  size: 10,
  shapeName: CIRCLE
};

export default Shape