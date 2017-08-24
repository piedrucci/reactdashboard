import React, { Component } from 'react'
import { color } from './../../shared/styles'

class Header extends Component{
  render() {
    return (
      <div className="container" style={styles.navBar}>
        <nav className="navbar navbar-expand-lg navbar-light " style={{backgroundColor:color.primary}}>
          <a className="navbar-brand" href="#"><span style={styles.titleContainer}>Little Caesars</span></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="#">Resumen <span className="sr-only">(current)</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>
              
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
  titleContainer: {
    backgroundColor: color.primary,
    color: '#ffffff'
  },
}

export default Header
