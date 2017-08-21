import React, { Component } from 'react'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'

export const types = {
  bar: 'bar',
  pie: 'pie',
  line: 'line',
  doughnut: 'doughnut'
}

export const position = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left'
}

class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartType: props.chartType,
      chartData: props.chartData,
      chartOptions: props.chartOptions
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.chartType)
    // console.log(nextProps.chartData)
    // console.log(nextProps.chartOptions)
    this.setState({
      chartType:nextProps.chartType,
      chartData:nextProps.chartData,
      chartOptions:nextProps.chartOptions
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
    // console.log(this.state.chartData.title)

    let renderChart = null
    if (this.state.chartType===types.bar){
      renderChart = <Bar
          data={this.state.chartData}
          width={this.state.chartOptions.size.width}
          height={this.state.chartOptions.size.height}
          options={{
            maintainAspectRatio: this.state.chartOptions.maintainAspectRatio,
            title: {
              display: this.state.chartOptions.displayTitle,
              text: this.state.chartData.title,
              fontSize: this.state.chartOptions.titleSize
            },
            legend:{
              display: this.state.chartOptions.displayLegend,
              position: this.state.chartOptions.legendPosition
            }
          }}
        />
    }
    if (this.state.chartType===types.pie){
      renderChart = <Pie
          data={this.state.chartData}
          width={this.state.chartOptions.size.width}
          height={this.state.chartOptions.size.height}
          options={{
            maintainAspectRatio: this.state.chartOptions.maintainAspectRatio,
            title: {
              display: this.state.chartOptions.displayTitle,
              text: this.state.chartData.title,
              fontSize: this.state.chartOptions.titleSize
            },
            legend:{
              display: this.state.chartOptions.displayLegend,
              position: this.state.chartOptions.legendPosition
            }
          }}
        />
    }
    if (this.state.chartType===types.line){
      renderChart = <Line
          data={this.state.chartData}
          width={this.state.chartOptions.size.width}
          height={this.state.chartOptions.size.height}
          options={{
            maintainAspectRatio: this.state.chartOptions.maintainAspectRatio,
            title: {
              display: this.state.chartOptions.displayTitle,
              text: this.state.chartData.title,
              fontSize: this.state.chartOptions.titleSize
            },
            legend:{
              display: this.state.chartOptions.displayLegend,
              position: this.state.chartOptions.legendPosition,
            }
          }}
        />
    }
    if (this.state.chartType===types.doughnut){
      renderChart = <Doughnut
          data={this.state.chartData}
          width={this.state.chartOptions.size.width}
          height={this.state.chartOptions.size.height}
          options={{
            maintainAspectRatio: this.state.chartOptions.maintainAspectRatio,
            title: {
              display: this.state.chartOptions.displayTitle,
              text: this.state.chartData.title,
              fontSize: this.state.chartOptions.titleSize
            },
            legend:{
              display: this.state.chartOptions.displayLegend,
              position: this.state.chartOptions.legendPosition
            }
          }}
        />
    }

// console.log(this.state.chartData.labels.length)
    return (
      <div>
        {this.state.chartData.labels.length ? renderChart : null}
      </div>
    )
  }
}

export default Chart
