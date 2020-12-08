import React, { Component } from 'react';

import { Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView
} from 'react-native';

var {height, width } = Dimensions.get('window');

import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from "react-native-swiper"
import LinearGradient from "react-native-linear-gradient"
import { AsyncStorage } from 'react-native';


export default class App extends Component {




  constructor(props)
  {
      super(props);
      this.state = {
        datosOrden:"",
        isLoading:true
        
      }
  }


static navigationOptions = ({ navigation }) => {
    return {
        headerTitle: 'Ordenes - Historial',
        headerStyle: { backgroundColor:"white" },
    };
  };

  componentDidMount(){
    AsyncStorage.getItem('ordenes').then((orden)=>{
      if (orden !== null) {
        // We have data!!
        const dataorden = JSON.parse(orden)
        dataorden.sort(function(a){return a.fecha > a.fecha});
        this.setState({datosOrden:dataorden,
          })
      }
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  eliminar(i)
  {
    const eliorden = this.state.datosOrden
    eliorden.splice(i,1)
     this.setState({datosOrden:eliorden})
     AsyncStorage.setItem("ordenes", JSON.stringify(eliorden));
  }



  render(){
    return(
      <View style={{flex:1,backgroundColor:'#f8f8f8',justifyContent: 'center',}}>
       
        <ScrollView>
        
        {this.state.datosOrden == "" ?
          <Text style={{fontSize:30, fontWeight:"bold",textAlign:'center'}}>¡No realizaste pedidos! ¿Que estas esperando?</Text> : 

          
               this.state.datosOrden.map((item,i)=>{
                 return(
                 <TouchableOpacity onPress={()=>this.props.navigation.navigate("Ticket",{"ticket":item})}>
        <View style={[styles.divnews,styles.shadows]}>
          <Image style={styles.imagenew} resizeMode="contain" source={require("./image/wepardologo.png")} />
          <View style={{padding:5}}><View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={styles.titleNews} numberOfLines={2}>PEDIDO #{item.id}</Text>
            <TouchableOpacity style={{paddingHorizontal:2}} onPress={()=>this.eliminar(i)}>
                             <Icon name="ios-trash" size={32} color={"#33c37d"} />
                           </TouchableOpacity></View>
            <Text style={styles.textTheme} numberOfLines={2}>#WepardoDelivery</Text>
            <Text style={styles.themeNews}>${item.Total}</Text>
            <Text>{item.fecha}</Text>

          </View>
        </View>
        </TouchableOpacity>
                 )}
                 )
               

          

         }
</ScrollView>
      </View>
    )
  }



}

const styles = StyleSheet.create({
  imagenew:{
    width:width/3,
    height:width/3,
    resizeMode:'cover',
    borderRadius:5
  },
  shadows:{
    elevation:4,
    shadowOpacity:0.3,
    shadowRadius:50,
    shadowColor:'gray',
    shadowOffset: { height:0, width:0 }
  },
  divnews:{
    width:width-10,
    backgroundColor:'white',
    margin:5,
    flexDirection:'row',
    borderRadius:5
  },
  titleNews:{
   
    fontSize:22
  },
  themeNews:{
    color:"#c2191c",
    fontSize:20
  },
  headernews:{
    width:width,
    height:50,
    backgroundColor:"#f8f8f8",
    alignItems:'center',
    justifyContent:'center'
  },
  logonews:{
    height:45,
    width:width/3,
    resizeMode:'contain'
  },
  textBanner:{
    fontSize:25,
    color:'white'
  },
  fondoBanner:{
    flex:2,
    justifyContent:"flex-end",
    padding:10
  },
  divtheme:{
    height:42,
    borderTopWidth:3,
    padding:10,
    borderColor:'#c2191c',
    backgroundColor:'white'
  },
  divtheme2:{
    height:41,
    borderBottomWidth:2,
    borderColor:'#c2191c',
    padding:10,
    backgroundColor:'#343434'
  },
  textTheme:{
    color:'black'
  },
  textTheme2:{
    color:'white'
  }
})