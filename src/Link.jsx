import React, {Component, PropTypes} from 'react'


class Link extends Component {

  render() {
    return(
      <path
        className='link'
        style={this.props.style}
        d={this.getPath(this.props.positions)}>
      </path>
    )
  }

  getPath = positions => (
    "M" + positions.source.y + "," + positions.source.x
      + "C" + (positions.target.y + 100) + "," + positions.source.x
      + " " + (positions.target.y + 100) + "," + positions.target.x
      + " " + positions.target.y + "," + positions.target.x
  );
}


Link.propTypes = {
  positions: PropTypes.object,
  style: PropTypes.object
};


Link.defaultProps = {

  positions: {
    source: {x: 0, y: 0},
    targets: {x: 0, y: 0}
  },

  style: {
    fill: 'none',
    stroke: 'green',
    strokeOpacity: 0.9,
    strokeWidth: '0.1em'
  }
};


export default Link