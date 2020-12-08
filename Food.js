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
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
var {height, width } = Dimensions.get('window');
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import moment from "moment";


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
      dataCart:"",
      currentDate: new Date(),
      selectCatg:0,
      textSearch:"",
      isLoading: true
      

    }
  }

  static navigationOptions = {
headerShown: false,
};

  componentDidMount(){
    AsyncStorage.removeItem('cart')
    
    const url = "https://wepardo.com.ar/comercios.php"
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {

      this.setState({
        
        dataBanner: responseJson.banner,
        dataCategories: responseJson.categorias,
        dataAllFood:responseJson,
        dataFood:responseJson.comercios,
        dataBackup:responseJson.comercios,
        isLoading: false
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
        const itemData = item.nombre.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
    })
    console.log(newData.length)
    if (newData.length >= 1) {
      this.setState({
        dataFood: newData,
        textSearch: text,
    })
    } else {
      const newData = data.filter(function(item){
        const itemData = item.tags.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
    })
   
    this.setState({
        dataFood: newData,
        textSearch: text,
    })
    }
    
  }


  comercioabierto(item){


const hori = moment().format('HH:mm');
const today = this.state.currentDate;
const day = moment(today).format("dddd");
if ((hori >= item.horaabre1 && hori <= item.horacierra1 && item.habilitado == 1 && day != item.descanso) || (hori >= item.horaabre2 && hori <= item.horacierra2 && item.habilitado == 1 && day != item.descanso)){
this.props.navigation.navigate("Comercio",{"comercio":item})
} else {
  Alert.alert(
      'Ups! Cerrado',
       item.nombre + ' Abre de: '+ item.horario,
      [

     {text: 'Ver Catalogo', onPress: () => this.props.navigation.navigate("Deshabilitado",{"comercio":item})},
      {text: 'Excelente!', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: true }
    )
     
}

  }

  render() {
    const { isLoading } = this.state;
    
    return (
      <View style={{ flex: 1,backgroundColor:"#f2f2f2" }}>
      <ScrollView>
        
          <View style={{width: width, alignItems:'center'}} >
         <LinearGradient colors={['orange', 'white']} style={{ width:width, alignItems: 'center' }}>
          <View style={{height:3}} />
              <Image style={{height:60,width:width/2,margin:3 }} resizeMode="contain" source={require("./image/foodapp.png")}  />
              <Swiper style={{height:width/2}} key={this.state.dataBanner.length} autoplay={true} showsButtons={false} autoplayTimeout={5} showsPagination={false} >
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
              placeholder="¿Que local buscas?"
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
             {!isLoading ? 

<View style={{ flex:1 , justifyContent: 'center', alignItems: 'center' }}>
            <FlatList
              //horizontal={true}
              data={this.state.dataFood}
              renderItem={({ item }) => this._renderItemFood(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
</View>
            :
           
           <ActivityIndicator size="large" color="#0000ff" />
        }
        
   

            <View style={{height:20}} />

          </View>

        </View>
        
           
      </ScrollView>
      
    

</View>
      
    );
  }

 
_renderItemFood(item){
    let catg = this.state.selectCatg
    if(catg==0||catg==item.categoria)
    {
      return(

      <TouchableOpacity onPress={()=>this.comercioabierto(item)}>

      <ImageBackground imageStyle={{borderRadius:8}} resizeMode="cover" source={{uri:item.fondo}} style={{height:width/2, width: width-40, alignItems:'center', padding:10,
    marginTop:10}}>

    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',  backgroundColor:'black', opacity:0.5, borderRadius:8}}>
   </View>
   <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
   <Text style={{top:10,right:10, position:"absolute",fontSize:10, color:"white", fontWeight:"bold"}}>{item.horario}</Text>
   
   <Text style={{textTransform: 'uppercase',fontSize:25, color:"white", fontWeight:"bold",bottom:15, position:"absolute"}}>{item.nombre}</Text>
   <Image
          style={{top:10,left:5,position:"absolute",width:60,height:60,borderRadius:8}}
          resizeMode="contain"
          source={{uri : item.logo}} />
   <Text style={{fontSize:10, color:"white",fontWeight:"bold",bottom:5, position:"absolute"}} numberOfLines={1}>{item.descripcion}</Text>

   </View>
  
</ImageBackground>
</TouchableOpacity>

        

        )
    }
  }
 _renderItem(item){
    return(
      <TouchableOpacity style={[styles.divCategorie,{backgroundColor:this.state.selectCatg==item.id?"#f8bd00":item.color}]}
      onPress={()=>this.setState({selectCatg:this.state.selectCatg==item.id?"0":item.id})}>
        <Image
          style={{width:100,height:80}}
          resizeMode="contain"
          source={{uri : item.imagen}} />
        <Text style={{fontWeight:'bold',fontSize:22, textAlign:"center",color:"black"}} >{item.nombre}</Text>
     
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
    color:"black",
    textAlign:'center',
    marginBottom:10
  },
  imageFood:{
    width:((width/2)-20)-10,
    height:((width/2)-20)-30,
    backgroundColor:'transparent',
    position:'absolute',
    borderRadius:8,
    top:-30
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