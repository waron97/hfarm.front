import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth/Auth';
import CallDetails from './components/CallDetailts/CallDetails';
import Dashboard from './components/Dashboard/Dashboard';
import MyApplications from './components/MyApplications/MyApplications';
import MyPosts from './components/MyPosts/MyPosts';
import NavBar from './components/NavBar/NavBar';

function App() {
  return (
    <Auth>
      <div className="App">
        <Router>
          <NavBar />
          <Switch>
            <Route exact path="/" component={Dashboard}></Route>
            <Route path="/call/:id" component={CallDetails}></Route>
            <Route path="/posts" component={MyPosts} />
            <Route path="/applications" component={MyApplications} />
          </Switch>
        </Router>
      </div>
    </Auth>
  );
}

export default App;
