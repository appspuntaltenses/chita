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
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';

import FastImage from 'react-native-fast-image';

var {height, width } = Dimensions.get('window');

import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from "react-native-swiper"
import LinearGradient from "react-native-linear-gradient"
// import AsyncStorage
import { AsyncStorage } from 'react-native';



export default class App extends Component {




  constructor(props)
  {
      super(props);
      this.state = {
        dataFood:[],
        dataCart:"",
        dataBackup:[],
        dataAllNews:{},
        dataCategories:[],
        selectCatg:0,
        message:"Hola",
        textSearch:"",
        isLoading:true
      }
  }


static navigationOptions = {
headerShown: false,
};

  componentDidMount(){
    const data = this.props.navigation.getParam('comercio')
    AsyncStorage.removeItem('cart')
    return fetch("https://wepardo.com.ar/productos.php",{
      method:'post',
      header:{
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body:JSON.stringify({
        // we will pass our input data to server
        id: data.id
        

      })
      
    })
    .then((response)=> response.json())
    .then((responseJson)=>{
      this.setState({
        dataFood:responseJson.productos,
        dataAllNews:responseJson,
        dataBackup:responseJson.productos,

        dataCategories:responseJson.categorias,
        isLoading:false
      })
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  onChangeSearch(text){
    console.log(text)
    const data = this.state.dataBackup
    const newData = data.filter(function(item){
        const itemData = item.nombre.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
    })
    console.log(newData.length)
    this.setState({
        dataFood: newData,
        textSearch: text,
    })
  }

  render(){
    const data = this.props.navigation.getParam('comercio')
    return(
      <View>
      <ScrollView>
      <View style={{flex:1,backgroundColor:'#f8f8f8'}}>
     
        <View style={styles.headernews}>
          <Image style={styles.logonews} source={require("./image/foodapp.png")} />
        </View>
        <View style={{height:200}}>
          <Swiper autoplay={true} showsButtons={false} showsPagination={false}>

          <ImageBackground style={{width:width,height:200}} resizeMode="cover" source={{uri:  data.fondo }}>
          
                  <LinearGradient style={styles.fondoBanner} colors={[ 'transparent', 'black']} >
                  <TouchableOpacity style={{fontSize:25, fontWeight:"bold",
    color:'white',top :10 ,
            right:10, position:"absolute",borderColor: '#f2f2f2'}} numberOfLines={2}><Icon name="ios-star" size={30} color={"#f8bd00"}  /></TouchableOpacity>
                  <Text style={{fontSize:25, fontWeight:"bold",
    color:'white'}} numberOfLines={2}>{data.nombre} </Text>
    <Text style={{fontSize:10, fontWeight:"bold",
    color:'white'}} numberOfLines={1}>{data.descripcion} </Text>
                    <Text style={styles.textBanner} numberOfLines={2}><Icon name="ios-alarm" size={15} color={"white"}  /> {data.horario} | <Icon name="ios-bicycle" size={15} color={"white"}  /> ${data.precio} | <Icon name="ios-clock" size={15} color={"white"}  /> {data.demora} Min</Text>
                  </LinearGradient>
                  
          <Image
          style={{position:"absolute",width:60,height:60,borderRadius:8}}
          resizeMode="contain"
          source={{uri : data.logo}} />
                </ImageBackground>


        

  


          </Swiper>
          
        </View>
        <View style={{width:width, backgroundColor:'gray',padding:8}}>
            <TextInput
              placeholder="¿Que quieres comer hoy?..."
              style={{ height: 40, borderColor: '#f2f2f2', borderRadius:10, backgroundColor:'white', borderWidth: 1, paddingHorizontal:20 }}
              onChangeText={(text) => this.onChangeSearch(text)}
              value={this.state.textSearch}
            />
          </View>
        <View style={{height:45, alignItems:'center', backgroundColor:"#343434"}}>
        {!this.state.isLoading ?
          <FlatList
              horizontal={true}
              data={this.state.dataAllNews.categorias}
              keyExtractor = { (item,index) => index.toString() }
              renderItem={({item})=>this._renderItemTheme(item)}
             />:
            <ActivityIndicator size="large" color="white"/>}
          </View>
          
          <FlatList
              
              data={this.state.dataFood}
              numColumns={2}
              renderItem={({ item }) => this._renderItemFood(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
      </View>

      </ScrollView>
      
              </View>

    )
  }


  


  _renderItemTheme = (item) => (
    <TouchableOpacity onPress={()=>this.setState({selectCatg:item.id}) }>
      <View style={this.state.selectCatg==item.id?styles.divtheme:styles.divtheme2}>
        <Text style={this.state.selectCatg==item.id?styles.textTheme:styles.textTheme2}> {item.categoria} </Text>
      </View>
    </TouchableOpacity>
  )

  _renderItemFood(item){
    let catg = this.state.selectCatg
    if(catg==0||catg==item.categoria)
    {
      return(
        <TouchableOpacity onPress={()=>this.props.navigation.navigate("Details",{"news":item})} style={styles.divFood}>
          <FastImage
            style={styles.imageFood}
            resizeMode={FastImage.resizeMode.contain}
            source={{uri:item.foto,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable}} />
            <View style={{height:((width/2)-20)-90, backgroundColor:'transparent', width:((width/2)-20)-10}} />
            <Text style={{fontWeight:'bold',fontSize:17,textAlign:'center'}}>
              {item.nombre}
            </Text>
            <Text>#Wepardo</Text>
            <Text style={{fontSize:20,color:"green"}}>${item.precio}</Text>
         
          </TouchableOpacity>
        )
    }
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
    width:((width/3)*2)-20,
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
    fontSize:15,
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
  },
  divCategorie:{
    backgroundColor:'red',
    margin:5, alignItems:'center',
    borderRadius:10,
    padding:10
  },
  titleCatg:{
    fontSize:30,
    fontWeight:'bold',
    textAlign:'center',
    marginBottom:10
  },
  imageFood:{
    width:((width/2)-20)-10,
    height:((width/2)-20)-30,
    backgroundColor:'transparent',
    position:'absolute',
    borderRadius:10,
    top:-45
  },
  divFood:{
    width:(width/2)-20,
    padding:10,
    borderRadius:10,
    marginTop:55,
    marginBottom:5,
    marginLeft:10,
    alignItems:'center',
    elevation:8,
    shadowOpacity:0.3,
    shadowRadius:50,
    backgroundColor:'white',
  },
})