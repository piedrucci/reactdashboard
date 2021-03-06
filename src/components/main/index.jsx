import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
// import Home from '../home'
// import Login from '../login'
// import ChartContainer from '../chart'
import Statistic from '../statistic'
import PaymentStats from '../statistic/daySummary'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Statistic}/>
      {/* <Route path='/dashboard' component={ChartContainer}/> */}
      <Route path='/stats' component={Statistic}/>
      <Route path='/daysumary' component={PaymentStats}/>
      <Redirect from="/" to="/stats"/>
    </Switch>
  </main>
)

export default Main
