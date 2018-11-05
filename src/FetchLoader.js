import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'
import MarkerGeneHeatmap from './MarkerGeneHeatmap'
import PlotSettingsDropdown from './PlotSettingsDropdown'
import LoadingOverlay from './LoadingOverlay'

const CalloutAlert = ({error}) =>
  <div className={`row column`}>
    <div className={`callout alert small`}>
      <h5>Oops!</h5>
      <p>
        {error.description}<br/>
        If the error persists, in order to help us debug the issue, please copy the URL and this message and
        send it to us via <a href={`https://www.ebi.ac.uk/support/gxasc`}>the EBI Support & Feedback system</a>:
      </p>
      <code>{`${error.name}: ${error.message}`}</code>
    </div>
  </div>

CalloutAlert.propTypes = {
  error: PropTypes.shape({
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  })
}

class FetchLoader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: null,
      isLoading: true,
      hasError: null
    }
  }

  async _fetchAndSetState({resource, host}) {
    this.setState({
      isLoading: true
    })

    const url = URI(resource, host).toString()

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`${url} => ${response.status}`)
      }

      this.setState({
        data: await response.json(),
        isLoading: false,
        hasError: null
      })
    } catch(e) {
      this.setState({
        data: null,
        isLoading: false,
        hasError: {
          description: `There was a problem communicating with the server. Please try again later.`,
          name: e.name,
          message: e.message
        }
      })
    }
  }

  componentDidMount() {
    this._fetchAndSetState(this.props)
  }

  componentDidUpdate(previousProps) {
    if (previousProps.resource !== this.props.resource) {
      this._fetchAndSetState(this.props)
    }
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: {
        description: `There was a problem rendering this component.`,
        name: error.name,
        message: `${error.message} – ${info}`
      }
    })
  }

  render() {
    const { data, isLoading, hasError } = this.state

    const { host, ks, selectedK, onSelectK } = this.props

    const kOptions = ks.sort((a, b) => a-b).map((k) => ({
      value: k.toString(),
      label: `k = ${k}`
    }))


    return (
      hasError ?
        <CalloutAlert error={hasError}/> :
        [
          <PlotSettingsDropdown
            key={`selectK`}
            labelText={`View marker genes for:`}
            options={kOptions}
            onSelect={(selectedOption) => {onSelectK(selectedOption.value)}}
            defaultValue={{value: selectedK, label: selectedK}}
          />,
          isLoading ?
            <LoadingOverlay
              show={isLoading}
            /> :
            <MarkerGeneHeatmap
              key={`heatmap`}
              data={data}
              chartHeight={`800px`}
            />
        ]
    )
  }
}

FetchLoader.propTypes = {
  host: PropTypes.string,
  resource: PropTypes.string,
  ks: PropTypes.array,
  selectedK: PropTypes.number,
  onSelectK: PropTypes.func
}

export default FetchLoader
