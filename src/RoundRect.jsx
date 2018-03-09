import React, { PropTypes } from 'react'

export const ROUND_RECT = 'round-rect'

const RoundRect = props => {
  return (
    <rect
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      rx={3}
      ry={3}
      style={props.style}
    />
  )
}

RoundRect.propTypes = {
  style: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number
}

RoundRect.defaultProps = {
  style: {
    fill: '#FFFFFF',
    stroke: 'teal',
    strokeWidth: 2
  },
  width: 300,
  height: 35
}

export default RoundRect
