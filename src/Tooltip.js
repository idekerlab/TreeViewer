import React, {Component, PropTypes} from 'react'


class Tooltip extends Component {

  render() {

    const style = {
      width: '10em',
      height: '20em',
      borderRadius: '1em',
      color: 'red',
      background: 'rgba(255,255,255,0.5)',
      padding: '1em',
      marginLeft: '5em',
      zIndex: 1000
  }


    return (
      <div style={style}>
        {this.props.text}
      </div>
    )
  }
}

export default Tooltip
