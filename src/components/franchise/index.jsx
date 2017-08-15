import React, { Component } from 'react'

import DateTimePicker from 'react-datetimepicker-bootstrap'

import ChartContainer from './../chart'

import api from './../../api/api'

class Franchise extends Component {
  constructor() {
    super()
    this.state = {
      totalFranch: 0,
      dataList: [],
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  // OBTENER TODAS LAS SUCURSALES
  fetchData() {
        const res = api.getBrachs()
        res.then(response => response.json()).then(json => {
          console.log(json);
          this.setState({
            dataList: json.franquicias,
            totalFranch: json.franquicias.length
          });
        });
  }

  boton() {
    console.log(DateTimePicker.getValue())
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
          id="datetimepicker"
          placeholder="Seleccione Fecha"
          format= 'MM/DD/YYYY'
          getValue={(v)=>console.log(v)}
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
