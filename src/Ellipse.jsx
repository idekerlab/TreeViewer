import React, {PropTypes} from 'react'

export const ELLIPSE = 'ellipse'


const Ellipse = props => {

  return(
    <ellipse
      rx={props.width}
      ry={props.height}
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

  width: 35,
  height: 35
}


export default Ellipse
