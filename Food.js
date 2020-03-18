import React, { Component } from 'react';
import { Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity
} from 'react-native';
var {height, width } = Dimensions.get('window');
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';


// import AsyncStorage
import { AsyncStorage } from 'react-native';


export default class App extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
      dataBanner:[],
      dataCategories:[],
      dataAllFood:{},
      dataFood:[],
      dataBackup:[],
      selectCatg:0,
      textSearch:""
      

    }
  }

  componentDidMount(){
    const url = "http://tutofox.com/foodapp/api.json"
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {

      this.setState({
        isLoading: false,
        dataBanner: responseJson.banner,
        dataCategories: responseJson.categories,
        dataAllFood:responseJson,
        dataFood:responseJson.food,
        dataBackup:responseJson.food,
      });

    })
    .catch((error) =>{
      console.error(error);
    });
  }


onChangeSearch(text){
    console.log(text)
    const data = this.state.dataBackup
    const newData = data.filter(function(item){
        const itemData = item.name.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
    })
    console.log(newData.length)
    this.setState({
        dataFood: newData,
        textSearch: text,
    })
  }

  render() {
    return (
      <ScrollView>
        <View style={{ flex: 1,backgroundColor:"#f2f2f2" }}>
          <View style={{width: width, alignItems:'center'}} >
         <LinearGradient colors={['orange', 'white']} style={{ width:width, alignItems: 'center' }}>
          <View style={{height:3}} />
              <Image style={{height:60,width:width/2,margin:15 }} resizeMode="contain" source={require("./image/foodapp.png")}  />
              <Swiper style={{height:width/2}} autoplay={true} showsButtons={false} >
                {
                  this.state.dataBanner.map((itemmap)=>{
                    return(
                    	
                      <Image style={styles.imageBanner} resizeMode="contain" source={{uri:itemmap}} />
                     
                    )
                  })
                }
              </Swiper>
   
              
              <View style={{width:width,padding:8}}>
            <TextInput
              placeholder="¿Que comemos hoy?"
              style={{ height: 40, borderColor: '#f2f2f2', borderRadius:10, backgroundColor:'white', borderWidth: 1, paddingHorizontal:20 }}
              onChangeText={(text) => this.onChangeSearch(text)}
              value={this.state.textSearch}
            />
          </View></LinearGradient>
          </View>
 <View style={{width:width, backgroundColor:'white'}}>
          <View style={{width:width, borderRadius:20, paddingVertical:20, backgroundColor:'white'}}>
            <Text style={styles.titleCatg}>Categorias</Text>
            <FlatList
              horizontal={true}
              data={this.state.dataCategories}
              renderItem={({ item }) => this._renderItem(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
            <FlatList
              //horizontal={true}
              data={this.state.dataFood}
              numColumns={2}
              renderItem={({ item }) => this._renderItemFood(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
            <View style={{height:20}} />
          </View>

        </View>
        </View>
      </ScrollView>
    );
  }

 onClickAddCart(data){

   const itemcart = {
     food: data,
     quantity:  1,
     price: data.price
   }

   AsyncStorage.getItem('cart').then((datacart)=>{
       if (datacart !== null) {
         // We have data!!
         const cart = JSON.parse(datacart)
         cart.push(itemcart)
         AsyncStorage.setItem('cart',JSON.stringify(cart));
       }
       else{
         const cart  = []
         cart.push(itemcart)
         AsyncStorage.setItem('cart',JSON.stringify(cart));
       }
       Alert.alert(
      'Producto guardado!',
      'Sigue comprando o dirigete al carrito. | #ChitaDelivery',
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

_renderItemFood(item){
    let catg = this.state.selectCatg
    if(catg==0||catg==item.categorie)
    {
      return(
        <TouchableOpacity style={styles.divFood}>
          <Image
            style={styles.imageFood}
            resizeMode="contain"
            source={{uri:item.image}} />
            <View style={{height:((width/2)-20)-90, backgroundColor:'transparent', width:((width/2)-20)-10}} />
            <Text style={{fontWeight:'bold',fontSize:17,textAlign:'center'}}>
              {item.name}
            </Text>
            <Text>#ChitaDelivery</Text>
            <Text style={{fontSize:20,color:"green"}}>${item.price}</Text>
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
          </TouchableOpacity>
        )
    }
  }
 _renderItem(item){
    return(
      <TouchableOpacity style={[styles.divCategorie,{backgroundColor:this.state.selectCatg==item.id?"#33c37d":item.color}]}
      onPress={()=>this.setState({selectCatg:item.id})}>
        <Image
          style={{width:100,height:80}}
          resizeMode="contain"
          source={{uri : item.image}} />
        <Text style={{fontWeight:'bold',fontSize:22}}>{item.name}</Text>
     
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
	 imageBanner: {
    height:width/2,
    width:width-40,
    borderRadius:10,
    marginHorizontal:20
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
});