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
  Alert,
  Modal,
  Picker
} from 'react-native';

var {height, width } = Dimensions.get('window');

import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from "react-native-swiper"
import LinearGradient from "react-native-linear-gradient"
// import AsyncStorage
import { AsyncStorage } from 'react-native';

import FastImage from 'react-native-fast-image';



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
        isLoading:true,
        isVisible: false,
        dataModal:[]
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

  onLoadTotal()
  {
    
    var total = 0
    const cart = this.state.dataCart
    for (var i = 0; i < cart.length; i++) {
      total = total + (cart[i].precio*cart[i].cantidad)
    }
  
    return  parseInt(total)
    }

  onClickAddModal(data){
    this.setState({
        isVisible:true,
        dataModal:data
      })

  }

  render(){
    const data = this.props.navigation.getParam('comercio')
    return(
      <View>
      <ScrollView>
      <View style={{flex:1,backgroundColor:'#f8f8f8'}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible = {this.state.isVisible}
        onRequestClose={() => {
          this.setState({isVisible:false})
        }}
      >
      
        <View style={styleds.centeredView}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={styleds.modalView}>


            <Text style={styleds.modalText}>{this.state.dataModal.nombre}</Text>
    
            <Image
            style={{width:width/2,
    height:width/2,
    borderRadius:10}}
            resizeMode="contain"
            source={{uri:this.state.dataModal.foto}} />
            <Text>#Wepardo</Text>
            <Text style={{fontSize:15, fontWeight:"bold",
    color:'black',borderColor: '#f2f2f2'}}>{this.state.dataModal.descripcion}</Text>

            <Text style={{fontSize:25,color:"green", fontWeight:"bold"}}>${this.state.dataModal.precio}</Text>
            <View style={{height:5}}/>
            <TouchableOpacity
            onPress={()=>this.onClickAddCart(this.state.dataModal)}
            style={{
              width:(width/2),
              backgroundColor:'black',
              flexDirection:'row',
              alignItems:'center',
              justifyContent:"center",
              borderRadius:5,
              padding:4
            }}>
            <Text style={{fontSize:18, color:"white", fontWeight:"bold"}}>Pedir</Text>
            <View style={{width:10}} />
            <Icon name="ios-basket" size={30} color={"white"} />
          </TouchableOpacity>
            <TouchableOpacity style={{top:20}} onPress={()=>this.setState({isVisible:false}) }>
      <View>
        <Text > SALIR </Text>
      </View>
    </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
        
      </Modal>
     
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
                    <Text style={styles.textBanner} numberOfLines={2}><Icon name="ios-alarm" size={15} color={"white"}  /> {data.horario} | <Icon name="ios-bicycle" size={15} color={"white"}  /> {data.precio == 0 ? 'GRATIS ' : '$' + data.precio + ' '}| <Icon name="ios-clock" size={15} color={"white"}  /> {data.demora} Min</Text>
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
              placeholder="¿Que estas buscando hoy?..."
              style={{ height: 40, borderColor: '#f2f2f2', borderRadius:10, backgroundColor:'white', borderWidth: 1, paddingHorizontal:20 }}
              onChangeText={(text) => this.onChangeSearch(text)}
              value={this.state.textSearch}
            />
          </View>
        <View style={{height:42, alignItems:'center', backgroundColor:"#343434"}}>
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
             
              renderItem={({ item }) => this._renderItemFood(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
             
      </View>
   <View style={{height:90}} />
      </ScrollView>

      {
           this.state.dataCart?
             
 <TouchableOpacity
             onPress={()=>this.props.navigation.navigate("Cart",{"Cart":this.state.dataCart,"comercio":data})}

              style={{
                 backgroundColor:"#33c37d",
                 width:width-40,
                 position:'absolute',
                 alignItems:'center',
                 padding:10,
                 bottom:5,
                 borderRadius:5,
                 margin:20
               }}>

               <Text style={{
                   fontSize:width > 310 ? 24: 20,
                   fontWeight:"bold",
                   color:'white'
                 }}>
                <Icon name="ios-heart" size={width > 310 ? 24: 20}/> CARRITO: ${this.onLoadTotal()} <Icon name="ios-heart" size={width > 310 ? 24: 20}/>
               </Text>
             </TouchableOpacity> 
             : 
 <TouchableOpacity
            

              style={{
                 backgroundColor:"black",
                 width:width-40,
                 position:'absolute',
                 alignItems:'center',
                 padding:10,
                 bottom:5,
                 borderRadius:5,
                 margin:20
               }}>

               <Text style={{
                   fontSize:24,
                   fontWeight:"bold",
                   color:'#e23027'
                 }}>
                <Icon name="ios-heart" size={24}/> #WEPARDO <Icon name="ios-heart" size={24}/>
               </Text>
             </TouchableOpacity> 
              }
              </View>

    )
  }


_renderItemFood(item){
    if (this.state.selectCatg==item.categoria||this.state.selectCatg==0) {
      return(
      <TouchableOpacity onPress={()=>this.onClickAddModal(item)}>
        <View style={[tuki.divnews,tuki.shadows]}>
        {item.foto == 0 ? <Image
            style={tuki.imagenew}
            source={require("./image/wepardologo.png")} /> :
          <FastImage style={tuki.imagenew} source={{uri:item.foto,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable}} />
        }
          <View style={{padding:5}}>
            <Text style={tuki.titleNews} numberOfLines={2}>{item.nombre}</Text>
            <Text numberOfLines={1} style={{width:((width/3)*2)-20,}}>{item.descripcion}</Text>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.themeNews}>${item.precio}</Text>

            <TouchableOpacity
            onPress={()=>this.onClickAddCart(item)}
            style={{
              width:(width/2)-40,
              backgroundColor:'#33c37d',
              flexDirection:'row',
              alignItems:'center',
              justifyContent:"center",
              borderRadius:5,
              padding:4
            }}>
            <Text style={{fontSize:18, color:"white", fontWeight:"bold"}}>Pedir</Text>
            <View style={{width:10}} />
            <Icon name="ios-add-circle" size={30} color={"white"} />
          </TouchableOpacity>
          </View>
          </View>
        </View>
        </TouchableOpacity>
      )
    }
  }



  onClickAddCart(data){

   const itemcart = {
    nombre: data.nombre,
    foto: data.foto,
     cantidad:  1,
     precio: data.precio,
     detalles: '',
     id: data.id
   }

   this.setState({isVisible:false})

   AsyncStorage.getItem('cart').then((datacart)=>{
       if (datacart !== null) {
         // We have data!!
         const cart = JSON.parse(datacart)
         cart.push(itemcart)
         AsyncStorage.setItem('cart',JSON.stringify(cart));
         this.setState({dataCart:cart})
       }
       else{
         const cart  = []
         cart.push(itemcart)
         AsyncStorage.setItem('cart',JSON.stringify(cart));


         this.setState({dataCart:cart});

       }
       Alert.alert(
      'Producto guardado!',
      'Sigue comprando o dirigete al carrito. | #Wepardo',
      [
     {text: 'Excelente!', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
     })
     .catch((err)=>{
       alert(err)
     })
 }


  _renderItemTheme = (item) => (
    <TouchableOpacity onPress={()=>this.setState({selectCatg:this.state.selectCatg==item.id?"0":item.id}) }>
      <View style={this.state.selectCatg==item.id?styles.divtheme:styles.divtheme2}>
        <Text style={this.state.selectCatg==item.id?styles.textTheme:styles.textTheme2}> {item.categoria} </Text>
      </View>
    </TouchableOpacity>
  )

  
}

const styleds = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8bd00",
     backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color:"black"
  }
});



const styles = StyleSheet.create({
  imagenew:{
    width:width/3,
    height:width/3,
    resizeMode:'cover',
    borderRadius:5
  },
  
  titleNews:{
    width:((width/3)*2)-20,
    fontSize:22
  },
  themeNews:{
    color:"#c2191c",
    fontSize:25,
    fontWeight:"bold"
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
const tuki = StyleSheet.create({
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
    fontSize:20,
    fontWeight: "bold",
    color:"black"
  },
  themeNews:{
    color:"#c2191c",
    fontSize:20,
    fontWeight:"bold"
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