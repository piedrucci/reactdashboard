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
  }
}

export default utils
