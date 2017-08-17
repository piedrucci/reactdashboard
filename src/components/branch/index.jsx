import React, { Component } from 'react'

class Branch extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      totalBranchs: 0,
      branchsData: this.props.data
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      branchsData:nextProps.data
    })
  }

  render() {

    // CARGAR LAS SUCURSALES
    const sucs = this.state.branchsData.map(
      (item, index) =>{

        const suc =
        <div key={index} className="p-1">

          <div key={index} className="list-group d-flex">
            <a role="button" className="list-group-item list-group-item-action flex-row align-items-start active">
              <div className="d-flex justify-content-between">
                {/* <span style={styles.title}>{item.negocio}</span> */}
                <span style={styles.title}>{item.name}</span>
                {/* <small>3 days ago</small> */}
              </div>
              {/* <p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
              <small>Donec id elit non mi porta.</small> */}
            </a>
            <a role="button" className="list-group-item list-group-item-action flex-row align-items-start">
              <div className="d-flex justify-content-between">
                <h5 className="mb-1">${item.salesformatted}</h5>
                {/* <small className="text-muted">3 days ago</small> */}
              </div>
            </a>
          </div>
        </div>
      return  suc
}
    )
    return (
      <div>
        <div className="d-flex flex-row">
          {
            this.state.branchsData.length
            ? sucs
            : <div className="alert alert-info .text-center" role="alert">
                Espere .... obteniendo datos desde el servidor...
              </div>
          }
        </div>
      </div>
    )
  }

}

export default Branch

const styles = {
  title: {
    color: 'white',
    fontWeight: 'bold'
  }
}
