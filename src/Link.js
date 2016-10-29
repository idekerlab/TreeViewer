import React, {Component} from 'react'

class Link extends Component {

  render() {
    return(
      <path
        key={this.props.node.data.name}
        className='link'
        d={Link.diagonal(this.props.node)}>
      </path>
    )
  }

  static diagonal = d => (
    "M" + d.y + "," + d.x
      + "C" + (d.parent.y + 100) + "," + d.x
      + " " + (d.parent.y + 100) + "," + d.parent.x
      + " " + d.parent.y + "," + d.parent.x
  );
}
export default Link