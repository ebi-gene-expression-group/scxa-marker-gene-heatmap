import React from 'react'
import ReactDOM from 'react-dom'

import FetchLoader from '../src/index.js'

// K values for E-MTAB-5061
const ks = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      experimentAccession: `E-MTAB-5061`,
      // experimentAccession: `E-GEOD-99058`,
      ks: ks,
      selectedK: ks[0],
      // selectedK: 17,
    }
  }

  render() {
    return (
      <FetchLoader
        resource={`json/experiments/${this.state.experimentAccession}/marker-genes/${this.state.selectedK}`}
        host={`http://localhost:8080/gxa/sc/`}
        ks={this.state.ks}
        selectedK={this.state.selectedK}
        onSelectK={
          (k) => {
            this.setState({
              selectedK: parseInt(k)
            })
          }
        }
      />
    )
  }
}

const render = (options, target) => {
  ReactDOM.render(<Demo {...options} />, document.getElementById(target))
}

export {render}