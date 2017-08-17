import React from 'react'

const ArrowHead = props => (

  <marker
    id={props.id}
    markerWidth={props.markerWidth}
    markerHeight={props.markerHeight}
    refX={props.refX}
    refY={props.refY}
    orient={props.orient}
  >

    <path
      d={"M2,2 L2,11 L10,6 L2,2"}
      style={{fill: '#777777'}}
    />
  </marker>
)


ArrowHead.defaultProps = {
  id: 'markerArrow',
  markerWidth: '8',
  markerHeight: '8',
  refX: '2',
  refY: '6',
  orient: 'auto'
};

export default ArrowHead
