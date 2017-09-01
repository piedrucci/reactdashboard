import moment from 'moment'

// var dateFormat = "M/D/YYYY"
// var dateFormat = "DD/MM/YYYY"
var dateFormat = "YYYY-MM-DD"
const alasql = window.alasql;

var utils =
{
  generateRGBA() {
    const color1 = Math.trunc( Math.random() * (255 - 0) + 0 )
    const color2 = Math.trunc( Math.random() * (255 - 0) + 0 )
    const color3 = Math.trunc( Math.random() * (255 - 0) + 0 )

    return [color1, color2, color3]
  },

  getDateFormat() {
    return dateFormat
  },

// DEVUELVE ARRAY CON LAS FECHAS DE INICIO Y FIN EN FORMATO EPOCH(UNIX)
  getEpochDate(date) {
    let epochStartingDate = moment(date + " 00:00:00 +0000", dateFormat + " HH:mm:ss Z").valueOf();
    let epochEndingDate   = moment(date + " 23:59:59 +0000", dateFormat + " HH:mm:ss Z").valueOf();
    return [
      (epochStartingDate / 1000),
      (epochEndingDate / 1000)
    ]
  },

// obtiene los parametros desde SESSION-STORAGE para hacer las peticiones a la API
  getSessionParams() {
    const params = sessionStorage.getItem('json')
    return JSON.parse(params)
    // return params
  },

  initializeParams() {
    sessionStorage.setItem('json', JSON.stringify({
        APIKEY:'bd_lcaesarscentral',
        API: 'https://api.invupos.com/invuApiPos/index.php?r=',
        NOMBREF: 'Little Caesars'
      })
    )
  },

  formatNumber(value) {
    return value.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  },



  // metodo para exportar los datos estadisticos de las graficas...
    exportData(data) {
      try{
        // const data1 = [{Sucursal:1,Ventas:10},{Sucursal:2,Ventas:20}];
        let data1 = []
        data.map( (item, index) => data1.push(item) )
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
    },
}

export default utils
