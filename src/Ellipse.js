import React, {Component, PropTypes} from 'react'

export const ELLIPSE = 'ellipse'


const Ellipse = props => (
  <ellipse
    rx={props.width}
    ry={props.height}
    style={props.style}
  />
)


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
