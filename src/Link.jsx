import React, {Component, PropTypes} from 'react'


class Link extends Component {

  render() {
    return(
      <path
        key={this.props.node.data.name}
        className='link'
        style={this.props.style}
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


Link.propTypes = {
  style: PropTypes.object
};


Link.defaultProps = {
  style: {
    fill: 'none',
    stroke: '#777777',
    strokeOpacity: 0.5,
    strokeWidth: '0.1em'
  }
};


export default Link