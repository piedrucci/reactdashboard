import React, { Component } from 'react'
import api from './../../shared/api'
import Branch from './../branch'
import utils from './../../shared/utilities'
import ChartContainer from './../chart'
import { types, position } from './../chart/chart'
import Progress from './../progress'
import moment from 'moment'
import locale_es from 'moment/locale/es'
import {color} from './../../shared/styles'
// import DateTimePicker from 'react-datetimepicker-bootstrap'
import * as Datetime from 'react-datetime'

const alasql = window.alasql;

let toggleButtonDate = false

const chartOptions1 = {
  displayTitle: true,
  titleSize: 16,
  displayLegend: true,
  legendPosition: position.bottom,
  maintainAspectRatio: false,
  size: {
    width: 0,
    height: 400
  }
}

const chartOptions2 = {
  displayTitle: true,
  titleSize: 16,
  displayLegend: false,
  legendPosition: position.right,
  maintainAspectRatio: false,
  size: {
    width: 0,
    height: 400
  }
}

const filter = {
  day: 'day',
  week: 'week',
  month: 'month',
  date: 'date'
}

class Statistic extends Component {

  constructor() {
    super()
    this.state = {
      // parametros necesarios para conectarse a la API
      params: '',

      dataList: [],

      // total de sucursales
      totalBranchs: 0,

      // informacion consolidada para enviarla al componente Branch
      branchsData: [],

      // info para enviar al componente que muestra el grafico
      chartData: {
        title: '',

        labels:[],
        datasets:[{
          label: '',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1
        }]
      },

      isLoadingData: true,
      showRefreshIcon: true,
      chartFilter: filter.day,

      fullDateStr: moment().format("LL"),
      iconDateButton: <i className="fa fa-arrow-down" aria-hidden="true"></i>,
      pickerDate: ''
    }

    this.setFilterType = this.setFilterType.bind(this)
    this.toggleIconButtonDate = this.toggleIconButtonDate.bind(this)
    this.executeCalc = this.executeCalc.bind(this)

  }


  componentDidMount() {
    moment.locale('es')
    this.loadSessionParams()
    this.setFilterType(filter.day)

    // console.log(this.props.location.pathname)
  }

  async loadSessionParams() {
    let _params = await utils.getSessionParams()

    // en caso de que no existan datos, usar por defecto
    if ( _params === null ){
      await utils.initializeParams()
      _params = await utils.getSessionParams()
    }
    api.setEndPoint(_params.API)
    this.setState({params: _params })
  }

  async setFilterType(f) {
    // mostrar el PROGRESSBAR mientras se cargan los datos
    this.setState({
      isLoadingData:true,
      showRefreshIcon:true,
      chartFilter: f
    })

    // obtener la fecha actual
    const today = moment().format(utils.getDateFormat())
    let todayEpoch = utils.getEpochDate(today)
    let strDates = {}
    // const dayOfMonth = moment().format('D')
    // const getCurrentMonth = (Math.trunc(dayOfMonth / 7)) > 0
    switch (f) {
      case filter.day:
        // preparar el mensaje a mostrar de las fechas ..
        strDates = {
          from: '',
          to: moment().format(utils.getDateFormat()),
        }
        this.setState({fullDateStr:`Estadisticas para el ${moment(strDates.to).format("LL")}`})
        // console.log(todayEpoch)

        await this.loadLocalData(f)
        await this.getSalesSummary({
          // inicio: 1503273600,
          // fin: 1503359999
          inicio: todayEpoch[0],
          fin: todayEpoch[1]
        }, f)
        break;
      case filter.date:
        // preparar el mensaje a mostrar de las fechas ..
        strDates = {
          from: '',
          to: this.state.pickerDate,
        }
        // this.setState({fullDateStr:`Estadisticas para el ${this.state.pickerDate}`})
        todayEpoch = utils.getEpochDate(this.state.pickerDate)
        this.setState({fullDateStr:`Estadisticas para el ${moment(strDates.to).format("LL")}`})

        await this.loadLocalData(f)
        await this.getSalesSummary({
          inicio: todayEpoch[0],
          fin: todayEpoch[1]
        }, f)
        break;
      case filter.week:
        // obtener la fecha del inicio de la semana actual
        // const inicioSemana = moment().day(1).format(utils.getDateFormat())
        // const inicioSemanaEpoch = utils.getEpochDate(inicioSemana)
        const lastWeek = moment().subtract(7, 'day');
        const lastWeekEpoch = utils.getEpochDate(lastWeek.format(utils.getDateFormat()))

        // preparar el mensaje a mostrar de las fechas ..
        strDates = {
          from: moment.unix(lastWeekEpoch[0]).add(5,'hour').format('LL'),
          to: moment.unix(todayEpoch[1]).add(5,'hour').format('LL'),
        }
        this.setState({fullDateStr:`Estadisticas desde ${strDates.from} al ${strDates.to}`})


        await this.loadLocalData(f)
        await this.getSalesSummary({
          inicio: lastWeekEpoch[0],
          fin: todayEpoch[1]
        }, f)
        break;
      case filter.month:
        const currentMonth = moment().month() + 1
        const currentYear = moment().year()
        // const strDate = currentMonth+'/1/'+currentYear
        const strDate = currentYear+'-'+currentMonth+'-1'
        // const startingMonthDate = moment(strDate, utils.getDateFormat())
        const startingMonthDateEPOCH = utils.getEpochDate(strDate)

        // preparar el mensaje a mostrar de las fechas ..
        strDates = {
          from: moment.unix(startingMonthDateEPOCH[0]).add(5,'hour').format('LL'),
          to: moment.unix(todayEpoch[1]).add(5,'hour').format('LL'),
        }
        this.setState({fullDateStr:`Estadisticas desde ${strDates.from} al ${strDates.to}`})


        await this.loadLocalData(f)
        await this.getSalesSummary({
          inicio: startingMonthDateEPOCH[0],
          fin: todayEpoch[1]
        }, f)
        break;
      default:
      break;
    }
    this.setState({showRefreshIcon:false})
  }

  // OBTENER TODOS TOTALES ACUMULADOS (FIN-DEL-DIA) POR CADA SUCURSAL
  async getSalesSummary(dates, filterType) {
    try{
      //  CREAR UN ARRAY AUX DE TODAS LAS SUCURSALES
      let branchs = this.state.dataList
      if (this.state.dataList.length === 0){
        await this.fetchData()
        branchs = this.state.branchsData
      }

      // ESPERAR QUE TERMINE DE ITERAR EL ARRAY DE SUCURSALES, LUEGO IMPRIMIR LOS GRAFICOS
      let auxBranchsData = []
      await Promise.all (branchs.map(
        async (item, index) => {
          // console.log(item);
          //  OBTIENE EL RESUMEN DE VENTAS DEL DIA
          const res = await api.getFinDiaFechas(dates, item.APIKEY)
          const data = await res.json()

          const branchElement = {
            name: item.negocio,
            numOrders: data.totales.num_cuentas,
            avgOrders: data.totales.ticket_prom.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
            shortName: ( item.negocio.trim().length > 13 ) ? item.negocio.trim().substr(14, item.negocio.length) : item.negocio.trim().substr(0, item.negocio.trim().length),
            salesformatted: data.totales.total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
            sales: data.totales.total.toFixed(2)
          }

          // console.log(`${this.state.dataList[index].negocio} - ${branchElement.name}`)
          //  agregar info por cada sucursal
          auxBranchsData.push(branchElement)
          return null
        }
      )
    )

    auxBranchsData.sort( (a, b) => a.name.localeCompare(b.name) )

    // ACTUALIZAR EL ESTADO ... ARRAY CON RESUMEN POR SUCURSALES
    this.setState({branchsData: auxBranchsData})
    localStorage.setItem(`${filterType}BranchsData`, JSON.stringify(auxBranchsData))
    //  this.setState({branchsData: [...this.state.branchsData, branchElement]})

    this.showStats(filterType)
  }catch(err){
    alert(err)
  }

}

  // OBTENER TODAS LAS SUCURSALES
  async fetchData() {
    try{
      const res = await api.getBrachs(this.state.params.APIKEY)
      const data = await res.json()

      const totalBranchs = data.franquicias.length

      if ( totalBranchs < 1 ) {
        alert('NO hay suscursales para mostrar...')
      }

      this.setState({
        dataList: data.franquicias.sort( (a, b) => a.negocio.localeCompare(b.negocio) ),
        branchsData: data.franquicias,
        totalBranchs: totalBranchs
      })
    }catch(err){
      console.error(err)
    }
  }


// CARGA LOS DATOS Y LOS PREPARA PARA SER ENVIADOS AL COMPONENTE CHARTCONTAINER
showStats(filterType) {
  const data = this.state.branchsData
  let labels = []
  let datasetsLabel= 'Ventas'
  let datasetsData = []
  let datasetsBgColor = []
  let datasetsBdColor = []

  let rgba = null
  let trimLabel = null
  data.map( (item, index) => {
    // trimLabel = ( item.name.trim().length > 13 ) ? item.name.trim().substr(14, item.name.length) : item.name.trim().substr(0, item.name.trim().length)
    trimLabel = item.name
    labels.push(trimLabel)
    datasetsData.push(item.sales)

    rgba = utils.generateRGBA()
    datasetsBgColor.push( 'rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+', 0.4)' )
    datasetsBdColor.push( 'rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+', 1)' )
    return null
  } )

  const chartData = {
    title: 'Resumen de Ventas',
    labels: labels,
    datasets:[{
      label: datasetsLabel,
      data: datasetsData,
      backgroundColor: datasetsBgColor,
      borderColor: datasetsBdColor,
      borderWidth: 1
    }]
  }

  // cachear los datos en localStorage
  switch (filterType) {
    case filter.day:
      localStorage.setItem(filterType, JSON.stringify(chartData))
      break;
    case filter.date:
      localStorage.setItem(filterType, JSON.stringify(chartData))
      break;
    case filter.week:
      localStorage.setItem(filterType, JSON.stringify(chartData))
      break;
    case filter.month:
      localStorage.setItem(filterType, JSON.stringify(chartData))
      break;
    default:
      break;
  }
  console.log('finalizacion de la carga en segundo plano...')
  this.setState({
    chartData:chartData,
    isLoadingData:false
  })
}


// carga las estadisticas en cache....
  async loadLocalData(filterType) {
    const cachedData = await localStorage.getItem(filterType)
    const cachedBranchsData = await localStorage.getItem(`${filterType}BranchsData`)

    if (cachedData) {
      this.setState({
        chartData:JSON.parse(cachedData),
        branchsData: JSON.parse(cachedBranchsData),
        isLoadingData:false,
      })
      // return true
    }

  }


// metodo para exportar los datos estadisticos de las graficas...
  exportData = () => {
    try{
      // const data1 = [{Sucursal:1,Ventas:10},{Sucursal:2,Ventas:20}];
      let data1 = []
      this.state.branchsData.map( (item, index) => data1.push(item) )
      const opts = [
        {
          sheetid:'Data',
          header:true
        }
      ];
      alasql('SELECT * INTO XLSX("summary.xlsx",?) FROM ?', [opts,[data1]]);
    }catch(err) {
      alert(err)
      console.log(err)
    }
  }


  toggleIconButtonDate = () => {
    let _iconButton = <i className="fa fa-arrow-down" aria-hidden="true"></i>
    if (!toggleButtonDate){
      _iconButton = <i className="fa fa-arrow-up" aria-hidden="true"></i>
    }
    toggleButtonDate = !toggleButtonDate
    this.setState({iconDateButton:_iconButton})
  }

  executeCalc = async(d) => {
    await this.setState({pickerDate:d,showRefreshIcon:true})
    this.setFilterType(filter.date)
  }

  render() {

    // para mostrar el icono del spinner mientras hace la carga en segundo plano...
    const refreshingData = (this.state.showRefreshIcon)?<i className="fa fa-refresh fa-spin" style={styles.fontSpinner}></i>:null

    return (
      <div className="container-fluid">

        {/* BARRA SUPERIOR */}
        {/* <div className="row" >
          <div className="col-sm-12">
            <div className="alert " style={styles.titleContainer} ><span style={styles.title}>Little Caesars</span></div>
          </div>
        </div> */}

        {/* SECCION DE IMPRESION DE LOS TOTALES VENDIDOS POR CADA SUCURSAL */}
        <div className="row">
          <div className="col-sm-2">

            <div className="btn-group-vertical btn-block " data-toggle="buttons">
              <button
                type="button"
                className={`btn btn-light ${(this.state.chartFilter===filter.day) ? 'active' : ''}`}
                data-toggle="buttons"
                aria-pressed="true"
                autoComplete="off"
                onClick={()=>this.setFilterType(filter.day)}
                >
                  Dia &nbsp;&nbsp;&nbsp;
                  { (this.state.chartFilter===filter.day)?refreshingData:null}
              </button>
              <button
                type="button"
                className={`btn btn-light ${(this.state.chartFilter===filter.week) ? 'active' : ''}`}
                data-toggle="buttons"
                aria-pressed="false"
                autoComplete="off"
                onClick={()=>this.setFilterType(filter.week)}
                >
                  Semana &nbsp;
                  { (this.state.chartFilter===filter.week)?refreshingData:null}
                </button>
              <button
                type="button"
                className={`btn btn-light ${(this.state.chartFilter===filter.month) ? 'active' : ''}`}
                data-toggle="buttons"
                aria-pressed="false"
                autoComplete="off"
                onClick={()=>this.setFilterType(filter.month)}
                >Mes &nbsp;
                { (this.state.chartFilter===filter.month)?refreshingData:null}</button>
            </div>

            <button type='button' className="btn btn-outline-info btn-block" onClick={()=>this.exportData()}>
              <i className="fa fa-file-excel-o" aria-hidden="true"></i> &nbsp;&nbsp;&nbsp;
              Export
            </button>

            <br />


            <button className="btn btn-outline-info btn-block" type="button" data-toggle="collapse"
              data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
              onClick={this.toggleIconButtonDate}
              >
              <i className="fa fa-calendar" aria-hidden="true"></i>&nbsp;&nbsp;
              Cambiar Dia&nbsp;&nbsp;
              {this.state.iconDateButton}
            </button>

            {/* mostrar widget del calendario ... */}
            <div className="collapse" id="collapseExample">
              <div className="card card-body">
                <Datetime
                  style={{marginTop:30}}
                  dateFormat={utils.getDateFormat()}
                  timeFormat={false}
                  defaultValue={new Date()}
                  closeOnSelect={true}
                  onChange={ (d) => {
                    // console.log(moment(d).toDate())
                    // por defecto el Datetime devuelve un moment object, hay que formatearlo al formato que se esta usando
                    const fe1=moment(d).format(utils.getDateFormat())
                    // metodo async para actualizar cambiar el dia del resumen
                    this.executeCalc(fe1)
                  }}
                />
              </div>
            </div>


          </div>
          <div className="col-sm-10">
            {
              this.state.isLoadingData
              ? <Progress visible={true} />
              : <div>


                {/* =========  T A B S   ========  */}
              {/* <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" href="#profile" role="tab" data-toggle="tab">profile</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#buzz" role="tab" data-toggle="tab">buzz</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#references" role="tab" data-toggle="tab">references</a>
                </li>
              </ul>

              <div className="tab-content">
                <div role="tabpanel" className="tab-pane fade in active" id="profile">...</div>
                <div role="tabpanel" className="tab-pane fade" id="buzz">bbb</div>
                <div role="tabpanel" className="tab-pane fade" id="references">ccc</div>
              </div> */}


                <i className="fa fa-calendar" aria-hidden="true"></i><span style={{color: '#888888'}}>&nbsp;&nbsp;{this.state.fullDateStr}&nbsp;&nbsp;</span>

                <Branch data={this.state.branchsData} />
              </div>
            }
          </div>
        </div>



        {/* SECCION PARA MOSTRAR LOS GRAFICOS */}
        {/* <div className="row" style={{display: (this.state.isLoadingData)?'none':'block'}}> */}
        <div className="row" >
          <div className="col-sm-4">
            <ChartContainer
              chartType={types.pie}
              chartData={this.state.chartData}
              chartOptions={chartOptions1}
            />
          </div>
          <div className="col-sm-8">
            <ChartContainer
              chartType={types.bar}
              chartData={this.state.chartData}
              chartOptions={chartOptions2}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Statistic

const styles = {
  title: {
    fontWeight: 'bold',
    fontSize: '2em'
  },
  titleContainer: {
    backgroundColor: color.primary,
    color: '#ffffff'
  },
  fontSpinner: {
    fontSize: 18
  }
}
