import React, {Component} from 'react'

import DateTimePicker from 'react-datetimepicker-bootstrap'

import ChartContainer from './../chart'

import moment from 'moment'

import api from './../../api/api'

class Franchise extends Component {
  constructor() {
    super()
    this.state = {
      totalBranchs: 0,
      dataList: [],
      date1: moment(),
      chartType: 'line',
      month: 'agosto'
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.fetchData()
  }

  // OBTENER TODAS LAS SUCURSALES
  fetchData() {
    const res = api.getBrachs()
    res
      .then(response => response.json())
      .then(json => {
        this.setState({dataList: json.franquicias, totalBranchs: json.franquicias.length});
        // console.log(json);
      });
  }

  setDate(value) {
    this.setState({date1: value})

    // CONVIERTE A FORMATO EPOCH (UNIX)
    var ts = moment(this.state.date1 + " 8:00", "M/D/YYYY H:mm").valueOf();
    ts = (ts / 1000)

    // var m = moment(ts); var s = m.format("M/D/YYYY H:mm"); var m =
    // moment.unix(ts); console.log(this.state.date1)
  }


  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  boton() {
    alert('probando')
  }

  render() {

    // CARGAR LAS SUCURSALES
    const sucs = this.state.dataList.map((item, index) => 
      <button key={index} type="button" onClick={ () => this.setState({wer:'ojooo'}) } className="list-group-item list-group-item-action">{item.negocio}</button>)

    return (
      <div className="container">
      


        <div className="row">
          <div className="col-sm-12 alert alert-info" role="alert">
            <div className="col-sm-8" >
              <h1 >POS Pineapple</h1>
              <p >This is a simple hero unit, a simple jumbotron-style
                component for calling extra attention to featured content or information.</p>
              <hr className="my-4"/>
              {/*<p>It uses utility classes for typography and spacing to space content out
                within the larger container.</p>
              <p className="lead"></p>*/}
            </div>
            <div className="col-sm-4">
              <div className="list-group">
                <a href="#" className="list-group-item active">
                  Totales
                </a>
                <a href="#" className="list-group-item list-group-item-action">Total del Dia</a>
                <a href="#" className="list-group-item list-group-item-action">Morbi leo risus</a>
                <a href="#" className="list-group-item list-group-item-action">Porta ac consectetur ac</a>
                <a href="#" className="list-group-item list-group-item-action ">Vestibulum at eros</a>
              </div>
            </div>
          </div>
        </div>

        <div className='row'>

          <div className="col-sm-4">
            <div className="list-group">
              <button type="button" className="list-group-item list-group-item-action active">Sucursales
                <span className="badge badge-secondary">
                  <strong>{this.state.totalBranchs}</strong>
                </span>
              </button>
              {sucs}
            </div>
          </div>

          <div className="col-sm-4">
            <form>
              <div className="form-group">
                <select
                  name="chartType"
                  value={this.state.chartType} onChange={this.handleChange}
                  className="custom-select mb-2 mr-sm-2 mb-sm-0" 
                  id="selectChart"
                  >
                  <option value="bar">Bar</option>
                  <option value="pie">Pie</option>
                  <option value="line">Line</option>
                </select>

              </div>
              <div className="form-group">
                <select
                  name="month"
                  value={this.state.month} onChange={this.handleChange}
                  // className="form-control form-control-lg" 
                  id="seleMonth"
                  >
                    <option value="enero">Enero</option>
                    <option value="febrero">Febrero</option>
                    <option value="marzo">Marzo</option>
                    <option value="abril">Abril</option>
                    <option value="mayo">Mayo</option>
                    <option value="junio">Junio</option>
                    <option value="julio">Julio</option>
                    <option value="agosto">Agosto</option>
                </select>
              </div>
            </form>
            
          </div>

        </div>

        <div className="row">
          <div className="col-sm-12">
            <ChartContainer wwww={this.state.wer} chartType={this.state.chartType}/>
          </div>
        </div>

        <button onClick={() => this.boton()}>Ver data</button>

      </div>
    // https://codesandbox.io/s/vVoQVk78
    )

  }

}

export default Franchise

// 1 enero 5pm 1483290000         1 julio 1498896000
// 31 enero 1485882000            31 julio 1501520400

// 1 febrero 1485936000           1 de agosto 1501574400
// 28 febrero 1488301200          31 agosto 1504198800

// 1 marzo 1488355200
// 31 marzo 1490947200

// 1 abril 1491033600
// 30 abril 1493571600

// 1 mayo 1493625600
// 31 mayo 1496217600

// 1 junio 1496304000
// 30 junio 1498842000
