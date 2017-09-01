
// const endPoint = 'https://testing.invucorp.com/invuApiPos/index.php?r='
// let endPoint = 'https://api.invupos.com/invuApiPos/index.php?r='
let endPoint = ''

var api =
{
  getBrachs(apiKey) {
    const response = fetch( endPoint + 'configuraciones/Franquicias',
                                  { headers: { 'APIKEY': apiKey } })
    return response
  },

  getFinDiaFechas(fechas, apiKey) {
    const response = fetch( endPoint + 'citas/TotalPorFecha/fini/' + fechas.inicio + '/ffin/' + fechas.fin,
                                  { headers: { 'APIKEY': apiKey } })
    return response
  },

  getItemsVendidosFechas(fechas, apiKey) {
    const fullPath = endPoint + 'citas/TotalesItemsVendidosFechas/fini/' + fechas.inicio + '/ffin/' + fechas.fin
    const response = fetch( fullPath, { headers: { 'APIKEY': apiKey } })
    return response
  },

  setEndPoint(uri) {
    endPoint = uri
  },

}

export default api
