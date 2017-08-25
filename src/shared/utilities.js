import moment from 'moment'

var dateFormat = "M/D/YYYY"
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
    let epochStartingDate = moment(date + " 00:00:00 +0000", "M/D/YYYY HH:mm:ss Z").valueOf();
    let epochEndingDate   = moment(date + " 23:59:59 +0000", "M/D/YYYY HH:mm:ss Z").valueOf();
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
}

export default utils
