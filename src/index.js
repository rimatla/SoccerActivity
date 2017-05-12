import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Whoops404 from './components/Whoops404'
import {Router, Route, hashHistory} from 'react-router';
import '../styles/index.css';
import '../styles/ui.scss';
import '../styles/stylesheet.scss';

//React Routes
ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App} />
        <Route path="list-days" component={App} >
            <Route path=":filter" component={App} />
        </Route>

        <Route path="add-day" component={App} />
        <Route path="*" component={Whoops404} />
    </Router>,
  document.getElementById('root')
);

