import React, { Component } from 'react'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'

export const types = {
  bar: 'bar',
  pie: 'pie',
  line: 'line',
  doughnut: 'doughnut'
}

class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartType: props.chartType,
      chartData: props.chartData,
      chartOptions: props.charOptions
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      chartType:nextProps.chartType,
      chartData:nextProps.chartData
    })
  }

  static defaultProps = {
    chartOptions: {
      displayTitle: true,
      displayLegend: true,
      legendPosition: 'right',
    },
    chartType: types.line,
    chartData: null
  }


  render() {

    let renderChart = null
    if (this.state.chartType===types.bar){
      renderChart = <Bar
          data={this.state.chartData}
          // width={100}
          // height={50}
          options={{
            // maintainAspectRatio: false,
            title: {
              display: true,
              text: 'Ventas Por Franquicia',
              fontSize:25
            },
            legend:{
              display: this.props.displayLegend,
              // position: 'right'
            }
          }}
        />
    }
    if (this.state.chartType===types.pie){
      renderChart = <Pie
          data={this.state.chartData}
          // width={100}
          // height={50}
          options={{
            // maintainAspectRatio: false,
            title: {
              display: true,
              text: 'Ventas Por Franquicia',
              fontSize:25
            },
            legend:{
              display: this.props.displayLegend,
              // position: 'right'
            }
          }}
        />
    }
    if (this.state.chartType===types.line){
      renderChart = <Line
          data={this.state.chartData}
          width={800}
          height={600}
          options={{
            // maintainAspectRatio: false,
            title: {
              display: true,
              text: 'Ventas Por Franquicia',
              fontSize:25
            },
            legend:{
              display: true,
              // position: 'right'
            }
          }}
        />
    }
    if (this.state.chartType===types.doughnut){
      renderChart = <Doughnut
          data={this.state.chartData}
          width={800}
          height={600}
          options={{
            // maintainAspectRatio: false,
            title: {
              display: true,
              text: 'Ventas Por Franquicia',
              fontSize:25
            },
            legend:{
              display: true,
              // position: 'right'
            }
          }}
        />
    }

// console.log(this.state.chartData.labels.length)
    return (

      <div>
        {this.state.chartData.labels.length ? renderChart : null}
        {/* {renderChart} */}
      </div>

    )

  }

}

export default Chart
