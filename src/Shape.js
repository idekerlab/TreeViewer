import React, {Component} from 'react'

class Shape extends Component {


  render() {
    return(
      <circle
        r={this.props.size}
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

export default Shape