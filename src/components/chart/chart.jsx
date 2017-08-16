import React, { Component } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'

export const types = {
  bar: 'bar',
  pie: 'pie',
  line: 'line',
}

class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartType: props.chartType,
      chartData: props.chartData
    }

  }

  componentWillReceiveProps(nextProps) {
    this.setState({chartType:nextProps.chartType})
  }

  static defaultProps = {
    displayTitle: true,
    displayLegend: true,
    legendPosition: 'right',
    chartType: types.line,
  }


  render() {
    let renderChart = null
    if (this.state.chartType==='bar'){
      renderChart = <Bar
          data={this.state.chartData}
          // width={100}
          // height={50}
          options={{
            maintainAspectRatio: false,
            title: {
              display: this.props.displayTitle,
              text: 'Ventas Por Franquicia',
              fontSize:25
            },
            legend:{
              display: this.props.displayLegend,
              position: 'right'
            }
          }}
        />
    }
    if (this.state.chartType==='pie'){
      renderChart = <Pie
          data={this.state.chartData}
          // width={100}
          // height={50}
          options={{
            maintainAspectRatio: false,
            title: {
              display: this.props.displayTitle,
              text: 'Ventas Por Franquicia',
              fontSize:25
            },
            legend:{
              display: this.props.displayLegend,
              position: 'right'
            }
          }}
        />
    }
    if (this.state.chartType==='line'){
      renderChart = <Line
          data={this.state.chartData}
          // width={100}
          // height={50}
          options={{
            // maintainAspectRatio: false,
            title: {
              display: this.props.displayTitle,
              text: 'Ventas Por Franquicia',
              fontSize:25
            },
            legend:{
              display: this.props.displayLegend,
              position: 'right'
            }
          }}
        />
    }

    return (

      <div>
        {renderChart}
      </div>

    )

  }

}

export default Chart
