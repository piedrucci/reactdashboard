import React, { Component } from 'react';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import axios from 'axios'

import './login.css'

class Login extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value })
    // console.log(this.state.password)
  }

  handleSubmit() {
    console.log('=== logueando =====')
    const endPoint = 'https://api.invupos.com/invuApiPos/index.php?r=site/ApiLogin'

    var params = new URLSearchParams();
    params.append('username', 'pos.invu');
    params.append('password', 'ff9907a80070300578eb65a2137670009e8c17cf');

    axios.post(endPoint, params)
      .then( (response) => console.log(response) )
      .then( (error) => console.log(error) )

    // axios.get('https://api.invupos.com/invuApiPos/index.php?r=menu')
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });

  }

  render() {
    return (

      <div className="container" >
        <form>

          <FormGroup
            controlId="formLogin"
            >

            <ControlLabel>Usuario</ControlLabel>
            <FormControl
              name="username"
              type="text"
              value={this.state.username}
              placeholder="Enter your username"
              onChange={this.handleChange}
            />

            <ControlLabel>Password</ControlLabel>
            <FormControl
              name="password"
              type="password"
              value={this.state.password}
              placeholder="Enter your password"
              onChange={this.handleChange}
            />

            <Button bsStyle="primary" onClick={this.handleSubmit}>Login</Button>

          </FormGroup>

        </form>

      </div>

    )
  }
}

export default Login
