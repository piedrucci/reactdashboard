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

  static defaultProps = {
    displayTitle: true,
    displayLegend: true,
    legendPosition: 'right',
    chartType: types.line,
  }

  render() {

    return (

      <div>

        {this.state.chartType==='bar' ?
        <Bar
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
        : null }

        {this.state.chartType==='pie' ?
        <Pie
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
        : null }


        {this.state.chartType==='line' ?
        <Line
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
        : null }

      </div>


    )

  }

}

export default Chart
