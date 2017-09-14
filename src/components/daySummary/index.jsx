import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {color} from './../../shared/styles'
import utils from './../../shared/utilities'

class DaySummary extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      data: this.props.data || []
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
      // if ( this.state.data.length ){
        let amount = 0
        elements = this.state.data.map(
          (item, index) =>{
            amount = ( typeof item.amount === 'undefined' ) ? 0 : item.amount

            const element =
            <div key={index} className="p-1" style={{width: 190}}>


              <div className="card">
                <div className="card-header">
                  <span style={styles.title}>{item.name}</span>
                </div>
                <div className="card-body">
                  {/* <h4 className="card-title"></h4> */}
                  <p className="card-text"><span style={styles.salesLabel}>{item.isCurrency?`$ ${utils.formatNumber(amount.toFixed(2))}`:`${amount}`}</span></p>
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
      // }
    }catch(err) {
      console.log(err);
      alert('fill data\n'+err)
    }

    return (
      <div>
        <div className="d-flex p-2 flex-row flex-wrap">
          {
            (this.state.data.length > 0)
            ?
            elements
            : <div className="alert text-center" style={styles.loadingMessage} role="alert">
                Espere .... obteniendo datos desde el servidor...
              </div>
          }
        </div>
      </div>
    )
  }

}

DaySummary.propTypes = {
  data: PropTypes.array
}

DaySummary.defaultProps = {
  data: []
}

export default DaySummary

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
    fontSize: '1.4em',
    textAlign: 'right'
  },

  footerText: {
    fontSize: '0.8em'
  }
}
