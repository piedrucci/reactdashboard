import React, { Component } from 'react'
import api from './../../shared/api'
import DaySummary from './../daySummary'
import utils from './../../shared/utilities'
// import ChartContainer from './../chart'
// import { types, position } from './../chart/chart'
import Progress from './../progress'
import moment from 'moment'
import locale_es from 'moment/locale/es'
import {color} from './../../shared/styles'
// import DateTimePicker from 'react-datetimepicker-bootstrap'
import * as Datetime from 'react-datetime'

let toggleButtonDate = false

const filter = {
  day: 'day',
  week: 'week',
  month: 'month',
  date: 'date'
}

class PaymentStats extends Component {

  constructor() {
    super()
    this.state = {
      // parametros necesarios para conectarse a la API
      params: '',

      // lista de sucursales que luego se usara para actualizar DATALIST
      branchsData: [],

      // datos consolidados procesados por franquicias para mostrarlos
      dataList: [],
      // fullDataList: [],

      //  aca estan todos los totales por sucursal (para ser usado al momento de filtrar 1 suc)
      paymentsData: [],

      isLoadingData: true,
      showRefreshIcon: true,
      chartFilter: filter.day,

      fullDateStr: moment().format("LL"),
      iconDateButton: <i className="fa fa-arrow-down" aria-hidden="true"></i>,
      pickerDate: '',
      activeBranch: '',
    }

    this.setFilterType = this.setFilterType.bind(this)
    this.toggleIconButtonDate = this.toggleIconButtonDate.bind(this)
    this.executeCalc = this.executeCalc.bind(this)
    this.updateDataFromBranch = this.updateDataFromBranch.bind(this)
  }


  async componentDidMount() {
    moment.locale('es')
    await this.loadSessionParams()
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
      chartFilter: f,
      // activeBranch: '',
    })

    // obtener la fecha actual
    const today = moment().format(utils.getDateFormat())
    let todayEpoch = utils.getEpochDate(today)
    let strDates = {}

    switch (f) {
      case filter.day:
        // preparar el mensaje a mostrar de las fechas ..
        strDates = {
          from: '',
          to: moment().format(utils.getDateFormat()),
        }
        this.setState({fullDateStr:`Estadisticas para el ${moment(strDates.to).format("LL")}`})
        // await this.loadLocalData(f)
        await this.getSalesSummary({
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

      let branchs = ( this.state.branchsData < 1 ) ? await this.fetchData() : null
      branchs = this.state.branchsData

      let auxPaymentsData = []
      let branchSummaryElement = {}

      let res = null    // aca se almacena un Promise devuelto del Request a la API
      let branchSummary = null  // Promise convertido a formato JSON

      // iniciar el ciclo de procesamiento de estadisticas para cada sucursal ...
      await Promise.all (branchs.map(
        async (branch, index) => {

          //  OBTIENE EL RESUMEN DE VENTAS DEL DIA
          res = await api.getFinDiaFechas(dates, branch.APIKEY)
          branchSummary = await res.json()

          branchSummaryElement = {
            name: branch.negocio,

            orders: branchSummary.totales.num_cuentas,
            subtotal: branchSummary.totales.subtotal,
            itemDiscount: branchSummary.totales.item_dis,
            checkDiscount: branchSummary.totales.check_disc,
            tax: branchSummary.totales.tax,
            total: branchSummary.totales.total,
            cashPaid: branchSummary.totales.cash_paid,
            cardPaid: branchSummary.totales.card_paid,
            otherPaid: branchSummary.totales.other_paid,
            partialCreditNoteCount: branchSummary.totales.cant_nota_cred_parc,
            partialCreditNote: branchSummary.totales.nota_cred_parciales,
            creditNoteCount: branchSummary.totales.cant_nota_cred,
            creditNote: branchSummary.totales.nota_cred,
            cashIncome: branchSummary.totales.ingreso_caja,
            cashOut: branchSummary.totales.retiro_caja,
            openedOrdersCount: branchSummary.totales.cant_ord_abiertas,
            deletedOrdersCount: branchSummary.totales.cant_ord_eliminadas,

          }

          auxPaymentsData.push(branchSummaryElement)
              // return null
        } )
      )
      this.setState({paymentsData: auxPaymentsData})
      this.totalesAcumulados(auxPaymentsData, filterType);
  }catch(err){
    alert(err)
  }

}

  // OBTENER TODAS LAS SUCURSALES
  async fetchData() {
    try{
      const res = await api.getBrachs(this.state.params.APIKEY)
      const data = await res.json()

      if ( data.franquicias.length < 1 ) {
        alert('NO hay suscursales para mostrar...')
      }

      this.setState({
        dataList: data.franquicias.sort( (a, b) => a.negocio.localeCompare(b.negocio) ),
        branchsData: data.franquicias.sort( (a, b) => a.negocio.localeCompare(b.negocio) ),
      })
    }catch(err){
      console.error(err)
    }
  }


// carga las estadisticas en cache....
  async loadLocalData(filterType) {
    const cachedData = await localStorage.getItem(filterType)
    const cachedBranchsData = await localStorage.getItem(`${filterType}PaymentsData`)

    if (cachedData) {
      this.setState({
        // chartData:JSON.parse(cachedData),
        dataList: JSON.parse(cachedBranchsData),
        isLoadingData:false,
      })
      // return true
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


  totalesAcumulados = (data, filterType)=>{

    const orders = data.reduce( (acum, current) => { return acum + current.orders },0 )
    const subtotal = data.reduce( (acum, current) => { return acum + current.subtotal },0 )
    const itemDiscount = data.reduce( (acum, current) => { return acum + current.itemDiscount },0 )
    const checkDiscount = data.reduce( (acum, current) => { return acum + current.checkDiscount },0 )
    const tax = data.reduce( (acum, current) => { return acum + current.tax },0 )
    const total = data.reduce( (acum, current) => { return acum + current.total },0 )
    const cashPaid = data.reduce( (acum, current) => { return acum + current.cashPaid },0 )
    const cardPaid = data.reduce( (acum, current) => { return acum + current.cardPaid },0 )
    const otherPaid = data.reduce( (acum, current) => { return acum + current.otherPaid },0 )
    const partialCreditNoteCount = data.reduce( (acum, current) => { return acum + current.partialCreditNoteCount },0 )
    const partialCreditNote = data.reduce( (acum, current) => { return acum + current.partialCreditNote },0 )
    const creditNoteCount = data.reduce( (acum, current) => { return acum + current.creditNoteCount },0 )
    const creditNote = data.reduce( (acum, current) => { return acum + current.creditNote },0 )
    const cashIncome = data.reduce( (acum, current) => { return acum + current.cashIncome },0 )
    const cashOut = data.reduce( (acum, current) => { return acum + current.cashOut },0 )
    const openedOrdersCount = data.reduce( (acum, current) => { return acum + current.openedOrdersCount },0 )
    const deletedOrdersCount = data.reduce( (acum, current) => { return acum + current.deletedOrdersCount },0 )

    const auxArray = [
      {name: 'Ordenes', amount: orders, isCurrency: false},
      {name: 'Subtotal', amount: subtotal, isCurrency: true},
      {name: 'Descuento Items', amount: itemDiscount, isCurrency: true},
      {name: 'Descuento Orden', amount: checkDiscount, isCurrency: true},
      {name: 'Impuestos', amount: tax, isCurrency: true},
      {name: 'Total', amount: total, isCurrency: true},
      {name: 'Efectivo', amount: cashPaid, isCurrency: true},
      {name: 'Tarjeta', amount: cardPaid, isCurrency: true},
      {name: 'Otro', amount: otherPaid, isCurrency: true},
      {name: 'N. Cred. Parcial', amount: partialCreditNoteCount, isCurrency: false},
      {name: 'Nota Credito Parc', amount: partialCreditNote, isCurrency: true},
      {name: 'N. Credito', amount: creditNoteCount, isCurrency: false},
      {name: 'Nota Credito', amount: creditNote, isCurrency: true},
      {name: 'Ingreso Caja', amount: cashIncome, isCurrency: true},
      {name: 'Retiro Caja', amount: cashOut, isCurrency: true},
      {name: 'Ordenes Abiertas', amount: openedOrdersCount, isCurrency: false},
      {name: 'Ords Eliminadas', amount: deletedOrdersCount, isCurrency: false},
    ]

    // ACTUALIZAR EL ESTADO ... ARRAY CON RESUMEN POR SUCURSALES
    // this.setState({branchsData: auxArray})
    this.setState({dataList: auxArray, isLoadingData: false})
    localStorage.setItem(`${filterType}PaymentsData`, JSON.stringify(auxArray))
    // this.showStats(filterType)
  }


  updateDataFromBranch = (e) => {
    const selectedBranch = e.target.value
    this.setState({activeBranch: selectedBranch})

    if ( selectedBranch!=='' ) {
      const branchData = this.state.paymentsData.filter((branch)=> branch.name.toLowerCase()===selectedBranch)

      const auxArray = [
        {name: 'Ordenes', amount: branchData[0].orders, isCurrency: false},
        {name: 'Subtotal', amount: branchData[0].subtotal, isCurrency: true},
        {name: 'Descuento Items', amount: branchData[0].itemDiscount, isCurrency: true},
        {name: 'Descuento Orden', amount: branchData[0].checkDiscount, isCurrency: true},
        {name: 'Impuestos', amount: branchData[0].tax, isCurrency: true},
        {name: 'Total', amount: branchData[0].total, isCurrency: true},
        {name: 'Efectivo', amount: branchData[0].cashPaid, isCurrency: true},
        {name: 'Tarjeta', amount: branchData[0].cardPaid, isCurrency: true},
        {name: 'Otro', amount: branchData[0].otherPaid, isCurrency: true},
        {name: 'N. Cred. Parcial', amount: branchData[0].partialCreditNoteCount, isCurrency: false},
        {name: 'Nota Credito Parc', amount: branchData[0].partialCreditNote, isCurrency: true},
        {name: 'N. Credito', amount: branchData[0].creditNoteCount, isCurrency: false},
        {name: 'Nota Credito', amount: branchData[0].creditNote, isCurrency: true},
        {name: 'Ingreso Caja', amount: branchData[0].cashIncome, isCurrency: true},
        {name: 'Retiro Caja', amount: branchData[0].cashOut, isCurrency: true},
        {name: 'Ordenes Abiertas', amount: branchData[0].openedOrdersCount, isCurrency: false},
        {name: 'Ords Eliminadas', amount: branchData[0].deletedOrdersCount, isCurrency: false},
      ]
      this.setState({dataList: auxArray})
    }else{
      this.totalesAcumulados(this.state.paymentsData, filter.day)
    }
  }


  render() {

    // para mostrar el icono del spinner mientras hace la carga en segundo plano...
    const refreshingData = (this.state.showRefreshIcon)?<i className="fa fa-refresh fa-spin" style={styles.fontSpinner}></i>:null

    return (
      <div className="container-fluid">

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



            {/* <div className="list-group" id="list-tab" role="tablist">
              <a className="list-group-item list-group-item-action active" id="list-home-list" data-toggle="list" href="#list-home" role="tab" aria-controls="home">Home</a>
              <a className="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-profile" role="tab" aria-controls="profile">Profile</a>
              <a className="list-group-item list-group-item-action" id="list-messages-list" data-toggle="list" href="#list-messages" role="tab" aria-controls="messages">Messages</a>
              <a className="list-group-item list-group-item-action" id="list-settings-list" data-toggle="list" href="#list-settings" role="tab" aria-controls="settings">Settings</a>
            </div> */}

            <br /><br />
            {(this.state.branchsData)
            ?
            <select
              className="form-control btn-outline-info"
              id="exampleFormControlSelect2"
              value={this.state.activeBranch.toLowerCase()}
              onChange={(val)=>this.updateDataFromBranch(val)}
              >

              <option value=''>---Todas---</option>
              {this.state.branchsData.map((branch, index)=> <option key={index} value={branch.negocio.toLowerCase()}>{branch.negocio}</option>)}
            </select>
            : null }

            <br /><br />
            {/* <button type='button' className="btn btn-outline-info btn-block" onClick={()=>this.exportData()}> */}
            <button type='button' className="btn btn-outline-info btn-block" onClick={()=>utils.exportData(this.state.branchsData)}>
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
              :
              <div>

                <i className="fa fa-calendar" aria-hidden="true"></i><span style={{color: '#888888'}}>
                  &nbsp;&nbsp;{this.state.fullDateStr}&nbsp;
                  {(this.state.activeBranch!=='')?`(${this.state.activeBranch})`:''}
                </span>

                <DaySummary data={this.state.dataList} />
              </div>
            }
          </div>
        </div>

      </div>
    )
  }
}

export default PaymentStats

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
