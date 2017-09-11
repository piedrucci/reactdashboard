import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import { color } from './../../shared/styles'
import utils from './../../shared/utilities'

class Header extends Component{
  constructor() {
    super()
    this.state = {
      franchiseName: '',
      opt: 1,
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
      // <div className="container-fluid" style={styles.navBar}>
      //
      //   <nav className="navbar navbar-expand-lg navbar-light " style={{backgroundColor:color.primary}}>
      //     <span style={styles.titleContainer} className="navbar-brand" ><Link to='/' style={styles.navBarItem}>{this.state.franchiseName}</Link></span>
      //     <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      //       <span className="navbar-toggler-icon"></span>
      //     </button>
      //
      //     <div className="collapse navbar-collapse" id="navbarSupportedContent">
      //       <ul className="navbar-nav ">
      //         <li className="nav-item active">
      //           <Link className="nav-link" to='/stats' style={styles.navBarItem}>Resumen</Link>
      //           {/* <a className="nav-link" href="#">Resumen <span className="sr-only">(current)</span></a> */}
      //         </li>
      //       </ul>
      //     </div>
      //   </nav>
      // </div>


      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <span className="navbar-brand" >{this.state.franchiseName}</span>
          {/* <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item active"> */}
              {/* <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> */}
              {/* <Link className="nav-link" to='/stats' >Resumen</Link>
            </li>
          </ul> */}
          <ul className="nav nav-pills">
            <li className="nav-item">
              {/* <a className="nav-link active" href="#">Active</a> */}
              {/* <Link className="nav-link active" to='/stats' >Resumen</Link> */}
              <Link className={`nav-link ${(this.state.opt===1) ? 'active' : ''}`} onClick={()=>this.setState({opt:1})} to='/stats' >Resumen</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${(this.state.opt===2) ? 'active' : ''}`} onClick={()=>this.setState({opt:2})} to='/daysumary' >Fin de Dia</Link>
            </li>

          </ul>

        </div>
      </nav>

    )
  }
}


// const styles = {
//   navBar: {
//     fontWeight: 'bold',
//     color: '#ffffff'
//     // fontSize: '2em'
//   },
//   navBarItem: {
//     color: '#e8e8e8',
//     fontWeight:'regular',
//   },
//   titleContainer: {
//     backgroundColor: color.primary,
//     color: '#ffffff',
//     cursor:'default',
//   },
// }

export default Header
