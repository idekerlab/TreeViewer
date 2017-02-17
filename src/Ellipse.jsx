import React, {Component, PropTypes} from 'react'

export const ELLIPSE = 'ellipse'


const Ellipse = props => {

  let w = props.width
  let h = props.height
  if(w <= 0.0) {
    w = 5
  }

  if(h <= 0.0) {
    h = 5
  }

  return(
    <ellipse
      rx={w}
      ry={h}
      style={props.style}
    />
  )
}


Ellipse.propTypes = {
  style: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number
}


Ellipse.defaultProps = {

  style: {
    fill: 'teal',
    stroke: '#EEEEEE',
    strokeWidth: 1
  },

  width: 10,
  height: 10
}


export default Ellipse
