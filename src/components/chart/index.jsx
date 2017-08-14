import React, { Component } from 'react'

import Chart, {types} from './chart'

class ChartContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartType: types.pie,
      chartData: {}
    }

    this.getChartData = this.getChartData.bind(this)
    this.setChartType = this.setChartType.bind(this)
  }

  componentWillMount() {
    this.setState({
      chartData : {
      labels:['franquicia 1', 'franquicia 2', 'franquicia 3'],
      datasets:
        [ {
          label: 'ventas',
          data: [617594,181045,153060]
        } ],
      backgroundColor:
      [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
      ]
    }
  })
  }

  getChartData() {
    alert('fetching chart data....')
    this.setState({chartType:'pie'})
  }

  setChartType(e) {
    this.setState({chartType:e.target.value})
    console.log(e.target.value)
  }

  render() {
    return (
      <div>
        <button
          onClick={this.getChartData}
          >
            Refrescar
          </button>

        <select id='selectChartType' onChange={this.setChartType}>
          <option value='pie'  >Pie</option>
          <option value='line'  >Line</option>
          <option value='bar'  >Bar</option>
        </select>

          <Chart chartData={this.state.chartData} chartType={this.state.chartType} />

      </div>
    )
  }
}

export default ChartContainer
