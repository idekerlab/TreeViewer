/**
 * Created by kono on 2016/10/26.
 */

import React, {Component, PropTypes} from 'react'
import * as d3Hierarchy from 'd3-hierarchy'
import * as d3Selection from 'd3-selection'

class Edge extends Component {

  render() {

    return(
      <path className="link"
        d={this.props.points}
      />
    )
  }
}