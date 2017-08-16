import React, {Component} from 'react'

import DateTimePicker from 'react-datetimepicker-bootstrap'

import ChartContainer from './../chart'

import moment from 'moment'

import api from './../../shared/api'

import utils from './../../shared/utilities'

const dateFormat = "M/D/YYYY"

const chartView = {
  itemsVendidos: 'Items Vendidos',
}

class Franchise extends Component {
  constructor() {
    super()
    this.state = {
      totalBranchs: 0,
      dataList: [],
      date1: {
        value: moment().format(dateFormat),
        epoch: null,
        maxDate: [moment().format(dateFormat)]
      },
      date2: {
        value: moment().format(dateFormat),
        epoch: null,
        maxDate: [moment().format(dateFormat)]
      },
      chartType: 'line',
      month: 'agosto',

      chartData: {
        labels:[],
        datasets:[{
          label: '',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1
        }]
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.getStats = this.getStats.bind(this);
  }

  componentDidMount() {
    moment.locale('es')
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

// OBTIENE LAS ESTADISTICAS PARA EL RANGO DE FECHAS SELECCIONADAS
  getStats() {
    const fechas = {
      inicio: this.state.date1.epoch,
      fin: this.state.date2.epoch
    }
    const res = api.getItemsVendidosFechas(fechas)
    res
      .then(response => response.json())
      .then(json => {
        if (json.encontro) {
          this.showStats(json.data)
        }
      });
  }

// CARGA LOS DATOS Y LOS PREPARA PARA SER ENVIADOS AL COMPONENTE CHARTCONTAINER
  showStats(data) {
    // console.log(data)
    let labels = []
    let datasetsLabel= chartView.itemsVendidos
    let datasetsData = []
    let datasetsBgColor = []
    let datasetsBdColor = []

    data.map( (item, index) => {
      labels.push(item.item.nombre)
      datasetsData.push(item.item.total_vendido)

      const rgba = utils.generateRGBA()
      datasetsBgColor.push( 'rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+', 0.6)' )
      datasetsBdColor.push( 'rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+', 1)' )
    } )

    const chartData = {
      labels: labels,
      datasets:[{
        label: datasetsLabel,
        data: datasetsData,
        backgroundColor: datasetsBgColor,
        borderColor: datasetsBdColor,
        borderWidth: 1
      }]
    }
    this.setState({chartData:chartData})
  }


// PREPARA LAS FECHAS EN FORMATO EPOCH ... AL SER SELECCIONADAS EN EL PICKER
  setDate(value, tipoFecha) {
    let inicio = null
    let fin = null

    if ( tipoFecha === 'inicio' ) {
      // CONVIERTE A FORMATO EPOCH (UNIX)
      inicio = moment(value + " 00:00:00 +0000", "M/D/YYYY HH:mm:ss Z").valueOf();
      inicio = (inicio / 1000)

      this.setState({date1:{value:value, epoch: inicio} })
      console.log(`inicio: ${inicio}`)
    } else if ( tipoFecha === 'fin' ) {
      // CONVIERTE A FORMATO EPOCH (UNIX)
      fin = moment(value + " 23:59:59 +0000", "M/D/YYYY HH:mm:ss Z").valueOf();
      fin = (fin / 1000)

      this.setState({date2:{value:value, epoch: fin} })
      console.log(`fin: ${fin}`)
    }

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
                <a role="button" style={{color:'white'}} className="list-group-item active">
                  Totales
                </a>
                <a role="button" className="list-group-item list-group-item-action">Total del Dia</a>
                <a role="button" className="list-group-item list-group-item-action">Morbi leo risus</a>
                <a role="button" className="list-group-item list-group-item-action">Porta ac consectetur ac</a>
                <a role="button" className="list-group-item list-group-item-action ">Vestibulum at eros</a>
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
                  className="form-control form-control-lg"
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

          <div className="col-sm-4">
            <DateTimePicker
              id="date1"
              format={dateFormat}
              placeholder="Fecha Inicio"
              getValue={(v)=>this.setDate(v, 'inicio')}
            />

            <DateTimePicker
              id="date2"
              format={dateFormat}
              placeholder="Fecha Fin"
              getValue={(v)=>this.setDate(v, 'fin')}
            />
            <button
              className="btn btn-primary"
              onClick={this.getStats}
              >Cargar Info</button>
          </div>

        </div>

        <div className="row">
          <div className="col-sm-12">
            <ChartContainer
              chartType={this.state.chartType}
              chartData={this.state.chartData}
            />
          </div>
        </div>

        <button onClick={() => this.boton()}>Ver data</button>

      </div>
    // https://codesandbox.io/s/vVoQVk78
    )

  }

}

export default Franchise

const styleButton = {
  color: 'yellow',
  // backgroundImage: 'url(' + imgUrl + ')',
};

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
