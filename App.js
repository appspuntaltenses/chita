import React, { Component } from 'react';

import { Text, View, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, Alert } from 'react-native';
var { width } = Dimensions.get("window")

import OneSignal from 'react-native-onesignal';

// import Components
import Food from './Apu'
import Favoritos from './Favoritos'
import Ordenes from './Ordenroute'
import Profile from './Profile'
// unable console yellow
console.disableYellowBox = true;
// import icons
import Icon from 'react-native-vector-icons/Ionicons';
import { AsyncStorage } from 'react-native';
export default class App extends Component {

  constructor(props) {
     super(props);
     OneSignal.init("91ff1369-702c-48c5-87d8-653d5909525a");
      OneSignal.addEventListener('opened', this.onOpened);
     this.state = {
       module:1,
       picture:""
     };
  }

   componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.onOpened);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('openResult: ', openResult);
  }


   componentDidMount()
  {
    

    AsyncStorage.getItem('user').then((user)=>{
      if (user !== null) {
        // We have data!!
        const datauser = JSON.parse(user)
        this.setState({
          picture:datauser.picture.data})
      }
    })

    .catch((err)=>{
      alert(err)
    })
  }


  render() {
    return (
      <View style={{flex:1}}>
         {
          this.state.module==1? <Food />
          :this.state.module==2? <Favoritos />
          :this.state.module==3? <Ordenes />
          :<Profile />
         }
         <View style={styles.bottomTab}>
           <TouchableOpacity style={styles.itemTab} onPress={()=>this.setState({module:1})}>
             <Icon name="md-restaurant" size={30} color={this.state.module==1?"#900":"gray"} />
             <Text>Pedi!</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.itemTab} onPress={()=>Alert.alert(
      'Ups! Seccion en construccion',
       'Muy pronto podras destacar tus comercios favoritos! \n #Wepardo',
      [

    
      {text: 'Excelente!', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: true }
    )}>
             <Icon name="md-star" size={30} color={this.state.module==2?"#900":"gray"} />
             <Text>Favoritos</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.itemTab} onPress={()=>this.setState({module:3})}>
             <Icon name="ios-list-box" size={30} color={this.state.module==3?"#900":"gray"} />
             <Text>Ordenes</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.itemTab} onPress={()=>this.setState({module:4})}>
            
             {this.state.picture ? <Image source={{uri: this.state.picture.url}} style={{width:30,height:30,borderRadius:350}} /> : <Icon name="md-contact" size={30} color={this.state.module==4?"#900":"gray"} />}
             <Text>Perfil</Text>
           </TouchableOpacity>
         </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomTab:{
    height:60,
    width:width,
    backgroundColor:'orange',
    flexDirection:'row',
    justifyContent:'space-between',
    elevation:8,
    shadowOpacity:0.3,
    shadowRadius:50,
  },
  itemTab:{
    width:width/4,
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center'
  }
})