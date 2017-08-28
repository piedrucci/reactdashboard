import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { color } from './../../shared/styles'
import utils from './../../shared/utilities'

class Header extends Component{
  constructor() {
    super()
    this.state = {
      franchiseName: '',
    }
  }

  componentDidMount() {
    this.loadFranchiseData()
  }

  async loadFranchiseData() {
    try{
      const json = await utils.getSessionParams()
      this.setState({franchiseName:(null!==json)?json.NOMBREF:''})
    }catch(err){
      console.error(err)
    }
  }

  render() {
    return (
      <div className="container-fluid" style={styles.navBar}>

        <nav className="navbar navbar-expand-lg navbar-light " style={{backgroundColor:color.primary}}>
          <span style={styles.titleContainer} className="navbar-brand" ><Link to='/' style={styles.navBarItem}>{this.state.franchiseName}</Link></span>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ">
              <li className="nav-item active">
                <Link className="nav-link" to='/stats' style={styles.navBarItem}>Estadisticas</Link>
                {/* <a className="nav-link" href="#">Resumen <span className="sr-only">(current)</span></a> */}
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" to='/' style={styles.navBarItem}>Rango de Fechas</Link>
              </li> */}

            </ul>
            {/* <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form> */}
          </div>
        </nav>
      </div>
    )
  }
}


const styles = {
  navBar: {
    fontWeight: 'bold',
    color: '#ffffff'
    // fontSize: '2em'
  },
  navBarItem: {
    color: '#e8e8e8',
    fontWeight:'regular',
  },
  titleContainer: {
    backgroundColor: color.primary,
    color: '#ffffff',
    cursor:'default',
  },
}

export default Header
