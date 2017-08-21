import React, { Component } from 'react'
import api from './../../shared/api'
import Branch from './../branch'
import utils from './../../shared/utilities'
import ChartContainer from './../chart'
import { types, position } from './../chart/chart'
import moment from 'moment'
// console.log(moment.locale('es')); // es

const apiKey = 'bd_pos'

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
  displayLegend: true,
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
  month: 'month'
}

class Statistic extends Component {

  constructor() {
    super()
    this.state = {
      dataList: [],
      totalBranchs: 0,
      branchsData: [],

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

    }

    this.setFilterType = this.setFilterType.bind(this)

  }

    componentDidMount() {
      this.fetchData()
    }

    // OBTENER TODAS LAS SUCURSALES
    async fetchData() {
      try{
        const res = await api.getBrachs(apiKey)
        const data = await res.json()

        this.setState({dataList: data.franquicias, totalBranchs: data.franquicias.length})
        this.getSalesSummary(null)
      }catch(err){
        console.error(err)
      }
    }

    // OBTENER TODOS LOS FIN DEL DIA POR CADA SUCURSAL
    async getSalesSummary(dates) {
       try{
        //  console.log(dates);
         const dateRange = (dates===null) ?
        //  FECHAS DEL DIA ANTERIOR (15-AGO)
         {
           inicio: 1502755200,
           fin: 1502841599,
         }
         : dates

        //  CREAR UN ARRAY AUX DE TODAS LAS SUCURSALES
         const branchs = this.state.dataList

         // ESPERAR QUE TERMINE DE ITERAR EL ARRAY DE SUCURSALES....
        //  LUEGO IMPRIMIR LOS GRAFICOS
        let auxBranchsData = []
         await Promise.all (branchs.map(
           async (item, index) => {
            //  OBTIENE EL RESUMEN DE VENTAS DEL DIA (FECHAS=15-AGO)
             const res = await api.getFinDiaFechas(dateRange, item.APIKEY)
             const data = await res.json()

             const branchElement = {
               name: item.negocio,
               numOrders: item.num_cuentas,
              //  avgOrder: item.ticket_prom.tofixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
               shortName: item.negocio.substr(14, item.negocio.length),
               salesformatted: data.totales.total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
               sales: data.totales.total.toFixed(2)
             }

            //  agregar info por cada sucursal
             auxBranchsData.push(branchElement)
             return null
           }
          )
         )

         // ACTUALIZAR EL ESTADO ... ARRAY CON RESUMEN POR SUCURSALES
         this.setState({branchsData: auxBranchsData})
         //  this.setState({branchsData: [...this.state.branchsData, branchElement]})

         this.showStats()
       }catch(err){
         alert(err)
       }

    }


    // CARGA LOS DATOS Y LOS PREPARA PARA SER ENVIADOS AL COMPONENTE CHARTCONTAINER
      showStats() {
        const data = this.state.branchsData
        let labels = []
        let datasetsLabel= 'Ventas'
        let datasetsData = []
        let datasetsBgColor = []
        let datasetsBdColor = []

        let rgba = null
        let trimLabel = null
        data.map( (item, index) => {
          trimLabel = ( item.name.trim().length > 13 ) ? item.name.trim().substr(14, item.name.length) : item.name.trim().substr(0, item.name.trim().length)
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
        this.setState({chartData:chartData})
      }


      setFilterType(f) {
        // obtener la fecha actual
        const today = moment().format(utils.getDateFormat())
        const todayEpoch = utils.getEpochDate(today)

        // const dayOfMonth = moment().format('D')
        // const showMonth = (Math.trunc(dayOfMonth / 7)) > 0


        switch (f) {
          case filter.day:
            this.getSalesSummary(null)
            break;
          case filter.week:
            // obtener la fecha del inicio de la semana actual
            const inicioSemana = moment().day(1).format(utils.getDateFormat())
            const inicioSemanaEpoch = utils.getEpochDate(inicioSemana)

            this.getSalesSummary({
              inicio: inicioSemanaEpoch[0],
              fin: todayEpoch[1]
            })

            break;
          case filter.month:
            console.log('resumen del MES')
            break;
          default:
            break;
        }
      }


  render() {

    return (
      <div className="container">
        {/* <div className="row justify-content-md-center"> */}

        {/* BARRA SUPERIOR */}
        <div className="row" >
          <div className="col-sm-12">
            <div className="alert alert-info" ><span style={styles.title}>Little Caesars</span></div>
          </div>
        </div>

        {/* SECCION DE IMPRESION DE LOS TOTALES VENDIDOS POR CADA SUCURSAL */}
        <div className="row">
          <div className="col-sm-2">
            <div className="btn-group-vertical" data-toggle="buttons">
              <button
                type="button"
                className="btn btn-info btn-lg btn-block"
                data-toggle="buttons"
                aria-pressed="false"
                autoComplete="off"
                onClick={()=>this.setFilterType(filter.day)}
                >Dia</button>
              <button
                type="button"
                className="btn btn-info btn-lg btn-block"
                data-toggle="buttons"
                aria-pressed="false"
                autoComplete="off"
                onClick={()=>this.setFilterType(filter.week)}
                >Semana</button>
              <button
                type="button"
                className="btn btn-info btn-lg btn-block"
                data-toggle="buttons"
                aria-pressed="false"
                autoComplete="off"
                onClick={()=>this.setFilterType(filter.month)}
                >Mes</button>
            </div>
          </div>
          <div className="col-sm-10">
            <Branch data={this.state.branchsData} />
          </div>
        </div>

        {/* SECCION PARA MOSTRAR LOS GRAFICOS */}
        <div className="row">
          <div className="col-sm-4">
            <ChartContainer
              chartType={types.pie}
              chartData={this.state.chartData}
              chartOptions={chartOptions1}
            />
          </div>
          <div className="col-sm-8">
            <ChartContainer
              chartType={types.line}
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
  }
}
