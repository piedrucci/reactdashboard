import React, {Component} from 'react'
import Chart, {types} from './chart'

class ChartContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartType: types.line,
      chartData: props.chartData,
      chartOptions: props.chartOptions
    }

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      chartType:nextProps.chartType,
      chartData:nextProps.chartData,
      chartOptions:nextProps.chartOptions,
    })
  }

  render() {
    return (
      <div>
        <Chart
          chartData={this.state.chartData}
          chartType={this.state.chartType}
          chartOptions={this.state.chartOptions}
        />
      </div>
    )
  }
}

export default ChartContainer
