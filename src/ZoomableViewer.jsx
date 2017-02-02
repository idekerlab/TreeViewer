import React, {Component, PropTypes} from 'react'

import * as d3Select from 'd3-selection'
import * as d3Zoom from 'd3-zoom'
import shortid from 'shortid'


class ZoomableViewer extends Component {

  constructor(props) {
    super(props);

    const id = shortid.generate()

    this.state = {
      rootTag: id,
      zoomAreaTag: id + 'Rect'
    }
  }


  render() {

    console.log("{{{{{{{{{{{{{{{{{{{{ Rendering BASE }}}}}}}}}}}}}}}}}}}}}}}}}}}}}")

    const areaStyle = {
      fill: 'none',
      pointerEvents: 'all'
    }

    return (
      <svg
        width={this.props.style.width}
        height={this.props.style.height}
      >
        <rect
          id={this.state.zoomAreaTag}
          width={this.props.style.width}
          height={this.props.style.height}
          style={areaStyle}
        >
        </rect>


        <g
          id={this.state.rootTag}
        >
          {this.props.children}
        </g>
      </svg>
    )
  }


  zoomed = () => {
    const treeArea = d3Select.select('#' + this.state.rootTag)
    const t = d3Select.event.transform
    treeArea.attr("transform", t);
  }

  componentDidMount() {
    const treeArea = d3Select.select('#' + this.state.rootTag)
    const zoom = d3Zoom.zoom(treeArea)
      .scaleExtent([1 / 10, 100])
      .on('zoom', this.zoomed)

    // TODO: any better way to avoid selection?
    const zoomArea = d3Select
      .select('#' + this.state.zoomAreaTag)
      .call(zoom)

    // Move to initial location
    zoomArea.call(zoom.transform,
      d3Zoom.zoomIdentity.translate(this.props.initialPosition.x, this.props.initialPosition.y))
  }
}


ZoomableViewer.propTypes = {

  // Style of the area used by the D3.js renderer
  style: PropTypes.object,

  initialPosition: PropTypes.object
}

ZoomableViewer.defaultProps = {
  style: {
    width: 1500,
    height: 1000,
    background: '#FFFFFF'
  },
  initialPosition: {
    x: 50,
    y: 0
  }
}

export default ZoomableViewer
