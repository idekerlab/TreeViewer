import React, {Component, PropTypes} from 'react'

class Shape extends Component {


  render() {
    return(
      <circle
        r={this.props.size}
        style={this.props.style}
      />
    )
  }

  getRoundRect = () => {
    return (<rect
      rx="6"
      ry="6"
      width={this.props.size * 2}
      height={this.props.size}
    />)
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