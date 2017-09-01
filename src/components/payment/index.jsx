import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {color} from './../../shared/styles'
import utils from './../../shared/utilities'

class Payment extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      data: this.props.data
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data:nextProps.data})
  }

  render() {
    // this.sd()
    let elements = null
    try{
      // recorrer la info
      elements = this.state.data.map(
        (item, index) =>{

          const element =
          <div key={index} className="p-1">


            <div className="card">
              <div className="card-header">
                <span style={styles.title}>{item.name}</span>
              </div>
              <div className="card-body">
                {/* <h4 className="card-title"></h4> */}
                <p className="card-text"><span style={styles.salesLabel}>{item.isCurrency?`$ ${utils.formatNumber(item.amount.toFixed(2))}`:`${utils.formatNumber(item.amount.toFixed(2))}`}</span></p>
                {/* <span className="btn btn-primary">Go somewhere</span> */}
              </div>
              {/* <div className="card-footer text-muted">
                <span style={styles.footerText}>Tickets: {item.numOrders}, Avg: ${item.avgOrders}</span>
              </div> */}
            </div>
          </div>
          return  element
        }
      )
    }catch(err) {
      console.log(err);
    }

    return (
      <div>
        <div className="d-flex p-2 flex-row flex-wrap">
          {
            (this.state.data.length > 0)
            ? elements
            : <div className="alert text-center" style={styles.loadingMessage} role="alert">
                Espere .... obteniendo datos desde el servidor...
              </div>
          }
        </div>
      </div>
    )
  }

}

Payment.propTypes = {
  data: PropTypes.array
}

export default Payment

const styles = {
  title: {
    color: '#606060',
    fontWeight: 'bold'
  },
  loadingMessage: {
    // color: '#ffffff',
    backgroundColor: color.primary2
  },
  salesLabel: {
    // color: '#999999',
    color: '#888888',
    fontWeight: 'bold',
    fontSize: '1.6em',
    textAlign: 'right'
  },

  footerText: {
    fontSize: '0.8em'
  }
}
