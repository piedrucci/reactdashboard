import React, { Component } from 'react'

import DateTimePicker from 'react-datetimepicker-bootstrap'

import ChartContainer from './../chart'

import moment  from 'moment'

import api from './../../api/api'

class Franchise extends Component {
  constructor() {
    super()
    this.state = {
      totalFranch: 0,
      dataList: [],
      date1: moment()
    }
    // this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.fetchData()
  }

  // OBTENER TODAS LAS SUCURSALES
  fetchData() {
        const res = api.getBrachs()
        res.then(response => response.json()).then(json => {
          // console.log(json);
          this.setState({
            dataList: json.franquicias,
            totalFranch: json.franquicias.length
          });
        });
  }

  // handleChange(e) {
  //   this.setState({[e.target.name]: e.target.value })
  // }

  setDate(value) {
    this.setState({date1:value})

// CONVIERTE A FORMATO EPOCH (UNIX)
    var ts = moment(this.state.date1 + " 8:00", "M/D/YYYY H:mm").valueOf();
    console.log(ts/1000)

    // var m = moment(ts);
    // var s = m.format("M/D/YYYY H:mm");
    // var m = moment.unix(ts);
    // console.log(this.state.date1)
  }

  boton() {
    alert('probando')
  }

  render() {

    // CARGAR LAS SUCURSALES
    const sucs = this.state.dataList.map( (item, index) =>
    <div key={index} className="alert alert-primary" role="alert">
      {item.negocio}
    </div>
  )


    return (
  <div className="container-fluid">

    <div className='row'>
      <div className="col-xs-4">

        <DateTimePicker
          id="date1"
          name="date1"
          placeholder="Seleccione Fecha"
          format= 'M/D/YYYY'
          getValue={(value)=> this.setDate(value) }
        />

        <button className="btn">
          Total de Franquicias: <span className="badge badge-secondary"><strong>{this.state.totalFranch}</strong></span>
        </button>

        {sucs}

      </div>

    </div>

    <div className="row">
      <ChartContainer />
    </div>

    <button onClick={()=>this.boton()}>Ver data</button>

  </div>
// https://codesandbox.io/s/vVoQVk78
    )

  }

}

export default Franchise
