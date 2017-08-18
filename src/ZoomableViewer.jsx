import React, {Component, PropTypes} from 'react'

import * as d3Select from 'd3-selection'
import * as d3Zoom from 'd3-zoom'
import shortid from 'shortid'

import ArrowHead from './ArrowHead'


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

    const areaStyle = {
      fill: 'none',
      pointerEvents: 'all'
    }

    return (
      <svg
        width={this.props.style.width}
        height={this.props.style.height}
      >
        <defs>
          <ArrowHead
            arrowColor={'#777777'}
          />
        </defs>

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

    const fullW = this.props.style.width
    const fullH = this.props.style.height

    // Hmm... how can I avoid select?
    const bounds = treeArea.node().getBBox()
    const width = bounds.width
    const height = bounds.height
    const midX = bounds.x + width / 2
    const midY = bounds.y + height / 2

    if (width === 0 || height === 0) {
      return
    }

    const scale = 0.98 / Math.max(width / fullW, height / fullH)
    const trans = [fullW / 2 - scale * midX, fullH / 2 - scale * midY]

    zoomArea.call(zoom.transform,
      d3Zoom.zoomIdentity
        .translate(trans[0], trans[1])
        .scale(scale))
  }
}


ZoomableViewer.propTypes = {

  // Style of the area used by the D3.js renderer
  style: PropTypes.object,
  initialPosition: PropTypes.object
}

ZoomableViewer.defaultProps = {
  style: {
    width: window.innerWidth,
    height: window.innerHeight,
    background: '#FFFFFF'
  },
  initialPosition: {
    x: 0,
    y: 0
  }
}

export default ZoomableViewer
