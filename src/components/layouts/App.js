import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import React, { Component } from 'react';
import './../../assets/scss/index.scss';

export default class App extends Component {
  render() {
    return (
      <div className={"app-container"}>
        <Header/>
        <Body/>
        <Footer/>
      </div>
    )
  }
}
