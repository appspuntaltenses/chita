import React from 'react';
import { View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
  Linking
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/Ionicons';
import io from "socket.io-client";
var {height, width } = Dimensions.get('window');



     
  


export default class DetailsScreen extends React.Component {


  constructor(props)
  {
      super(props);
      this.state = {
        currentPosition: 0,
        isVisible: false
      }
  }



  static navigationOptions = ({ navigation }) => {
    return {
        headerTitle: 'Ticket!',
        headerStyle: { backgroundColor:"#f2f2f2" },
         headerRight: () => (
        <TouchableOpacity style={{margin:10}} onPress={navigation.getParam('increaseCount')}><Icon name="ios-refresh" size={30} color={"#33c37d"} /></TouchableOpacity>
          ),
    };
    
  };


componentDidMount() {
    this.props.navigation.setParams({ increaseCount: this._increaseCount });
    const data = this.props.navigation.getParam('ticket')
    this.setState({isVisible:true})
    this.socket = io("https://wepardo.herokuapp.com/");
     this.socket.on("estado", () => {
      this._increaseCount();
    });
    fetch("https://wepardo.com.ar/estado.php",{
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
      this.setState({currentPosition:responseJson - 1,
        isVisible:false})
    })
    .catch((error)=>{
      console.log(error)
    })
  }

soporte(nombre)
 {
  const skere = 'Hola, Necesito ayuda! Mi pedido es el ' + nombre;
const whasts = '2915660209';
 Linking.openURL('whatsapp://send?text=' + skere + '&phone=549' + whasts);
 }

_increaseCount = () => {
  this.setState({isVisible:true})
  const data = this.props.navigation.getParam('ticket')
  fetch("https://wepardo.com.ar/estado.php",{
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
      this.setState({currentPosition:responseJson - 1,
        isVisible:false})
    })
    .catch((error)=>{
      console.log(error)
    })


  };
  


  render() {
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
    textAlign: "center"
  }
});
    const data = this.props.navigation.getParam('ticket')
    const labels = ["Preparando","En busqueda","En camino","Afuera","Entregado"];
    return (

      <ScrollView>

        <View style={{ flex: 1}}>

          <Modal
        animationType="fade"
        transparent={true}
        visible = {this.state.isVisible}
        
      >
        <View style={styleds.centeredView}>
          <View style={styleds.modalView}>
            <Text style={styleds.modalText}>Actualizando pedido!</Text>
            <ActivityIndicator size="large" color="#f8bd00" />
          </View>
        </View>
      </Modal>
          <View style={{padding:10}}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text>PEDIDO: #{data.id}</Text>
            <Text style={styles.textDate}>{data.fecha}</Text>
            </View>
            <StepIndicator
         customStyles={customStyles}
         currentPosition={this.state.currentPosition}
         labels={labels}
    />
            <Text style={styles.textTitle}>{data.Comercio}</Text>
            <Text style={styles.textArticle}>{data.Direccion}</Text>
            {
               data.Compras.map((item,i)=>{
                 return(
                   <View style={{width:width-20,backgroundColor:'transparent', flexDirection:'row', borderBottomWidth:2, borderColor:"#cccccc", paddingBottom:10}}>
                     <Image resizeMode={"contain"} style={{width:width/3,height:width/3,borderRadius:10}} source={{uri:item.foto}} />
                     <View style={{flex:1, backgroundColor:'trangraysparent', padding:10, justifyContent:"space-between"}}>
                       <View>

                         <Text style={{fontWeight:"bold", fontSize:20}}>{item.nombre}</Text>
                         <Text>#WepardoDelivery</Text>
                       </View>
                       <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                         <Text style={{fontWeight:'bold',color:"#33c37d",fontSize:20}}>${item.precio*item.cantidad}</Text>
                         <Text style={styles.textArticle}>{item.cantidad}</Text>
                         


                       </View>
                      

                     </View>

                   </View>

                 )
               })
             }
             <Text style={styles.envio}>+ {data.Envio == 0 ? 'ENVIO GRATIS' : '$' + data.Envio + ' de envio'}</Text>
            <Text style={styles.total}>${data.Total}</Text>
            <View
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  }}
>

          </View>
          <Text style={styles.textTheme}>¡Muchas gracias por tu compra!</Text>
          </View>
        </View>

<TouchableOpacity
             onPress={()=>this.soporte(data.id)}
             >

        <Text style={{fontSize:15,
    fontWeight:"bold",
    textAlign: "center",
    color:"#33c37d"}}>¿Problemas con tu pedido?</Text></TouchableOpacity>
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  textDate:{
    textAlign:'right'
  },
  textTitle:{
    fontSize:30,
    color:"#c2191c",
    fontWeight:"bold"
  },
  total:{
    fontSize:35,
    color:"#c2191c",
    textAlign: "center",
    fontWeight:"bold"
  },
  envio:{
    fontSize:20,
    color:"#33c37d",
    textAlign: "center",
    fontWeight:"bold"
  },
  textTheme:{
    fontSize:20,
    fontWeight:"bold",
    textAlign: "center"
  },
  textArticle:{
    fontSize:20
  }


})

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#e23027',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#33c37d',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#33c37d',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#33c37d',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 10,
  currentStepLabelColor: '#fe7013'
}
