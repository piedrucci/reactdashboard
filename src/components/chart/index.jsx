import React, {Component} from 'react'

import Chart, {types} from './chart'

class ChartContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartType: types.line,
      chartData: props.chartData
    }

  }

  // componentWillMount() {
  //   this.setState({
  //     chartData: {
  //       labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //       datasets: [{
  //           label: '# of Votes',
  //           data: [12, 19, 3, 5, 2, 3],
  //           backgroundColor: [
  //               'rgba(255, 99, 132, 0.6)',
  //               'rgba(54, 162, 235, 0.6)',
  //               'rgba(255, 206, 86, 0.6)',
  //               'rgba(75, 192, 192, 0.6)',
  //               'rgba(153, 102, 255, 0.6)',
  //               'rgba(255, 159, 64, 0.6)'
  //           ],
  //           borderColor: [
  //               'rgba(255,99,132,1)',
  //               'rgba(54, 162, 235, 1)',
  //               'rgba(255, 206, 86, 1)',
  //               'rgba(75, 192, 192, 1)',
  //               'rgba(153, 102, 255, 1)',
  //               'rgba(255, 159, 64, 1)'
  //           ],
  //           borderWidth: 1
  //       }]
  //   }
  //   })
  // }

  componentWillReceiveProps(nextProps) {
    this.setState({
      chartType:nextProps.chartType,
      chartData:nextProps.chartData,
    })
  }

  render() {
    return (
      <div>
        <Chart chartData={this.state.chartData} chartType={this.state.chartType}/>
      </div>
    )
  }
}

export default ChartContainer
