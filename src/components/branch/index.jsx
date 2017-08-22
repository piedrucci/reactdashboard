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
    this.setState({branchsData:nextProps.data})
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
                <span style={styles.title}>{item.shortName}</span>
                {/* <small>3 days ago</small> */}
              </div>
            </a>
            <a role="button" className="list-group-item list-group-item-action flex-row align-items-start">
              <div className="d-flex justify-content-between" >
                <h5 className="mb-1"> <span style={styles.salesLabel}>${item.salesformatted}</span></h5>
                {/* <span className={styles.salesLabel}>$</span> */}
                {/* <small className="text-muted">3 days ago</small> */}
              </div>
            </a>

            {/* <button> */}

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
  },
  salesLabel: {
    // color: '#999999',
    color: '#888888',
    fontWeight: 'bold',
    fontSize: '2em'
  }
}
