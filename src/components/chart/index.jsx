import React, {Component} from 'react'

import Chart, {types} from './chart'

class ChartContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartType: types.line,
      chartData: {}
    }

  }

  componentWillMount() {
    this.setState({
      chartData: {
        labels: [
          'franquicia 1', 'franquicia 2', 'franquicia 3'
        ],
        datasets: [
          {
            label: 'ventas',
            data: [617594, 181045, 153060]
          }
        ],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)']
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({chartType:nextProps.chartType})
  }

  render() {
    return (
      <div>
      {this.state.xwer}
        <Chart chartData={this.state.chartData} chartType={this.state.chartType}/>
      </div>
    )
  }
}

export default ChartContainer
