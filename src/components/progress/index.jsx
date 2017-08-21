import React, { Component } from 'react'

class Progress extends Component{
  constructor(props){
    super(props)
    this.state = {
      visible: props.visible
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({visible:nextProps.visible})
  }

  render() {
    return (
      <div className="row justify-content-center">
        {
          this.state.visible
          ?<div className="col-sm-6 justify-items-center">
              <p>Obteniendo datos desde el servidor ...</p>
              <div className="progress">
                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={styles.progressBar} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          : null
        }
      </div>
    )
  }
}


const styles = {
  progressBar: {
    width: 800
  }
}


export default Progress
