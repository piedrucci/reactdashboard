
const endPoint = 'https://testing.invucorp.com/invuApiPos/index.php?r='

const APIKEY = 'bd_pos'

var api =
{
  async getBrachs() {

    const response = await fetch( endPoint + 'configuraciones/Franquicias',
                                  { headers: { 'APIKEY': APIKEY } })
    return response
  },

  async getFinDiaFechas(fechas) {

    const response = await fetch( endPoint + 'citas/TotalPorFecha/fini/' + fechas.inicio + '/ffin/' + fechas.fin,
                                  { headers: { 'APIKEY': APIKEY } })
    return response
  }

}

export default api
