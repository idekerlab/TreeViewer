import React, {Component, PropTypes} from 'react'

class Shape extends Component {

  render() {
    return (
      <circle
        r={this.props.size}
        style={this.props.style}
      />
    )
  }
}

Shape.propTypes = {
  style: PropTypes.object,
  size: PropTypes.number
};

Shape.defaultProps = {
  style: {
    fill: '#aaaaaa'
  },
  size: 10
};

export default Shape