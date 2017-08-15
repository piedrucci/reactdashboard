
var api =
{
  async getBrachs() {

    const response = await fetch('https://testing.invucorp.com/invuApiPos/index.php?r=configuraciones/Franquicias',{
      headers: {'APIKEY': 'bd_pos'}
    })
    return response
  }
}

export default api
