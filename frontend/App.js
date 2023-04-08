import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';

// import * as firebase from 'firebase';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// import { initializeApp } from "firebase/app";

import { Component } from 'react'
import { View, Text } from 'react-native';

import { Provider } from 'react-redux';
import { applyMiddleware } from 'redux';
import { configureStore } from "@reduxjs/toolkit";

// import {configStore, applyMiddleware} from 'redux';
import { legacy_createStore as createStore } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
// import { createBrowserHistory, History } from "history";

import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';
import CommentScreen from './components/main/Comment';

const store = createStore(rootReducer, applyMiddleware(thunk))

// const history = createBrowserHistory();
// const rootReducer = (history) => ({
//   articles: articlesReducer,
//   selection: selectionReducer,
//   router: connectRouter(history)
// });

// const preloadedState = {};
// const store = configureStore({
//   middleware: [thunk, routerMiddleware(history)],
//   reducer: rootReducer(history),
//   preloadedState,
// });

// const store = configStore(rootReducer, applyMiddleware(thunk))

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGv5fEOnOoRZWcYyzyOrG_xUBb_WshqTk",
  authDomain: "instagram-dev-fed8e.firebaseapp.com",
  projectId: "instagram-dev-fed8e",
  storageBucket: "instagram-dev-fed8e.appspot.com",
  messagingSenderId: "144203359141",
  appId: "1:144203359141:web:2ff8c99f455778bfd13e4c",
  measurementId: "G-436P29G2FK"
};

if (firebase.apps.length==0){
  firebase.initializeApp(firebaseConfig)
}

import MainScreen from './components/Main';

const Stack = createStackNavigator();

export class App extends Component {
  
  constructor(props){
    super(props);
    this.state={
      loaded: false,
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(!user){
        this.setState ({
          loggedIn: false,  
          loaded: true,
          }) 
      }else{
        this.setState ({
          loggedIn: true,  
          loaded: true,
          }) 
        
      }
    }) 
  }

  render() {
    const {loggedIn, loaded} =this.state;
    console.log("inside main function",this.props)
    if(!loaded){
      return(
        <View style = {{flex:1 ,justifyContent: 'center'}}>
          <Text> Loading </Text>
        </View>
      )
    }
    if(!loggedIn){
      return (
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false  }}/>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>

      </NavigationContainer>
    )
    }
    return(
      <NavigationContainer>
        <Provider store={store}>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Add" component={AddScreen} options={{ headerShown: true  }} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation} options={{ headerShown: true  }}/>
            <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation} options={{ headerShown: true  }}/>
          </Stack.Navigator>
        </Provider>
      </NavigationContainer>


    )

  }
}

export default App;
