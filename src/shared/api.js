
// const endPoint = 'https://testing.invucorp.com/invuApiPos/index.php?r='
const endPoint = 'https://api.invupos.com/invuApiPos/index.php?r='

var api =
{
  getBrachs(apiKey) {
    // console.log(endPoint + 'configuraciones/Franquicias');
    const response = fetch( endPoint + 'configuraciones/Franquicias',
                                  { headers: { 'APIKEY': apiKey } })
    return response
  },

  getFinDiaFechas(fechas, apiKey) {
// https://testing.invucorp.com/invuApiPos/index.php?r=citas/TotalPorFecha/fini/1502755200/ffin/1502841599
    const response = fetch( endPoint + 'citas/TotalPorFecha/fini/' + fechas.inicio + '/ffin/' + fechas.fin,
                                  { headers: { 'APIKEY': apiKey } })
    return response
  },

  async getItemsVendidosFechas(fechas, apiKey) {
    const fullPath = endPoint + 'citas/TotalesItemsVendidosFechas/fini/' + fechas.inicio + '/ffin/' + fechas.fin
    const response = await fetch( fullPath, { headers: { 'APIKEY': apiKey } })
    return response
  }

}

export default api
