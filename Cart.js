import React, { Component } from 'react';
import { Text,Linking ,View, ScrollView, TextInput, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native'
var { width } = Dimensions.get("window")
// import icons
import Icon from 'react-native-vector-icons/Ionicons';
import { AsyncStorage } from 'react-native';

export default class Cart extends Component {

  constructor(props) {
     super(props);
     this.state = {
       dataCart:[],
       datoscomprador:[],
       jaja: "hola",
     };
  }

   componentDidMount()
  {
    AsyncStorage.getItem('cart').then((cart)=>{
      if (cart !== null) {
        // We have data!!
        const cartfood = JSON.parse(cart)
        this.setState({dataCart:cartfood})
      }
    })
    AsyncStorage.getItem('user').then((user)=>{
      if (user !== null) {
        // We have data!!
        const datauser = JSON.parse(user)
        this.setState({datoscomprador:datauser})
      }
    })

    .catch((err)=>{
      alert(err)
    })
  }


onLoadTotal()
  {
    var total = 0
    const cart = this.state.dataCart
    for (var i = 0; i < cart.length; i++) {
      total = total + (cart[i].price*cart[i].quantity)
    }
    return total
    }

  onChangeQual(i,type)
  {
    const dataCar = this.state.dataCart
    let cantd = dataCar[i].quantity;

    if (type) {
     cantd = cantd + 1
     dataCar[i].quantity = cantd
     this.setState({dataCart:dataCar})
     AsyncStorage.setItem("cart", JSON.stringify(dataCar));
    }
    else if (type==false&&cantd>=2){
     cantd = cantd - 1
     dataCar[i].quantity = cantd
     this.setState({dataCart:dataCar})
     AsyncStorage.setItem("cart", JSON.stringify(dataCar));
    }
    else if (type==false&&cantd==1){
      
     dataCar.splice(i,1)
     this.setState({dataCart:dataCar})
     AsyncStorage.setItem("cart", JSON.stringify(dataCar));
    } 
  }

  eliminar()
  {
    const dataCar = this.state.dataCart
  try {
      AsyncStorage.removeItem('cart')
      this.state.dataCart.splice('cart')
      this.setState({dataCart:dataCar})
      console.log("Borrado!");
    } catch (err) {
      console.log(`The error is: ${err}`)
    }
  }

  comprar()
  {
    const {dataCart} = this.state;
    const skere = JSON.stringify(this.state.dataCart) + JSON.stringify(this.state.datoscomprador);

    Linking.openURL(`whatsapp://send?text=` + skere);
    fetch('http://appspuntaltenses.xyz/losmussini/data.php',{
      method:'post',
      header:{
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body:JSON.stringify({
        // we will pass our input data to server
        pedido: this.state.dataCart,
        nombre: this.state.datoscomprador

      })
      
    })
    .then((response) => response.json())
     .then((responseJson)=>{
       if(responseJson == "ok"){
         // redirect to profile page
        

       
      
         Alert.alert(
      'Sesion Iniciada',
      'Sal de la aplicacion y vuelve a ingresar',
      [
     {text: 'Excelente!', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )

           

       
      
     
         
       }
       else{
         Alert.alert("Cuidado","Email o contraseña incorrecta");
       }
     })
     .catch((error)=>{
     console.error(error);
     });
    
  }




  render() {
    return (
      <View style={{flex:1,alignItems: 'center', justifyContent: 'center'}}>
         <View style={{height:20}} />
         <View style={{flexDirection:'row',justifyContent:'space-between'}}>
         <TouchableOpacity onPress={()=>this.eliminar()}>
                             <Icon name="ios-trash" style={{paddingHorizontal:8, paddingVertical:6}} size={32} color={"#33c37d"} />
                           </TouchableOpacity>
         <Text style={{fontSize:32,fontWeight:"bold",color:"#33c37d"}}>Carrito </Text>
         </View>
         <View style={{height:10}} />

         <View style={{flex:1}}>
<Text>{JSON.stringify(this.state.dataCart)}</Text>
           <ScrollView>

             {
               this.state.dataCart.map((item,i)=>{
                 return(
                   <View style={{width:width-20,margin:10,backgroundColor:'transparent', flexDirection:'row', borderBottomWidth:2, borderColor:"#cccccc", paddingBottom:10}}>
                     <Image resizeMode={"contain"} style={{width:width/3,height:width/3}} source={{uri: item.food.image}} />
                     <View style={{flex:1, backgroundColor:'trangraysparent', padding:10, justifyContent:"space-between"}}>
                       <View>
                         <Text style={{fontWeight:"bold", fontSize:20}}>{item.food.name}</Text>
                         <Text>#ChitaDelivery</Text>
                       </View>
                       <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                         <Text style={{fontWeight:'bold',color:"#33c37d",fontSize:20}}>${item.price*item.quantity}</Text>
                         <View style={{flexDirection:'row', alignItems:'center'}}>
                           <TouchableOpacity onPress={()=>this.onChangeQual(i,false)}>
                             <Icon name="ios-remove-circle" size={35} color={"#33c37d"} />
                           </TouchableOpacity>
                           <Text style={{paddingHorizontal:8, fontWeight:'bold', fontSize:18}}>{item.quantity}</Text>
                           <TouchableOpacity onPress={()=>this.onChangeQual(i,true)}>
                             <Icon name="ios-add-circle" size={35} color={"#33c37d"} />
                           </TouchableOpacity>
                         </View>
                       </View>
                     </View>
                   </View>
                 )
               })
             }
 </ScrollView>
             <View style={{height:20}} />
             
<Text style={{fontSize:28,fontWeight:"bold",color:"#33c37d",textAlign:'center'}}>${this.onLoadTotal()}</Text>
             <TouchableOpacity
             onPress={()=>this.comprar()}

              style={{
                 backgroundColor:"#33c37d",
                 width:width-40,
                 alignItems:'center',
                 padding:10,
                 borderRadius:5,
                 margin:20
               }}>

               <Text style={{
                   fontSize:24,
                   fontWeight:"bold",
                   color:'white'
                 }}>
                <Icon name="ios-heart" size={24}/> PEDIR <Icon name="ios-heart" size={24}/>
               </Text>
             </TouchableOpacity>

             <View style={{height:20}} />
          

         </View>

      </View>
    );
  }
}