import React, { Component } from 'react';
import { Text,Linking ,View, Modal, ScrollView, Picker, CheckBox, TextInput, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native'
var { width } = Dimensions.get("window")
// import icons
import Icon from 'react-native-vector-icons/Ionicons';
import { AsyncStorage } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

export default class Cart extends Component {

  constructor(props) {
     super(props);
     this.state = {
       dataCart:[],
       datosuser:[],
       datosusu: null,
       userDetalles: "SIN DETALLES",
       isVisible: false,
       isMinimo: false,
       inputText: '',
        editedItem: 0, 
        editedNombre: '',
        id_facebook:null,
       picture:null,
       name:null,
       email:null,
       token:null,
       celular:null,
       isTelefono: false

      
     };
  }



static navigationOptions = ({ navigation }) => {
    return {
        headerTitle: 'Carrito de compras',
        headerStyle: { backgroundColor:"#f2f2f2" },
    };
  };


   componentDidMount()
  {
    this.setState({dataCart:this.props.navigation.getParam('Cart')})




    AsyncStorage.getItem('user').then((user)=>{
      if (user !== null) {
        // We have data!!
        const datauser = JSON.parse(user)
        this.setState({datoscomprador:datauser,
          datosusu:datauser.name})
      }
    })

    .catch((err)=>{
      alert(err)
    })
  }




onLoadTotal()
  {
    const envio = this.props.navigation.getParam('comercio');
    var precio = envio.precio;
    var total = 0
    const cart = this.state.dataCart
    for (var i = 0; i < cart.length; i++) {
      total = total + (cart[i].precio*cart[i].cantidad)
    }
  
    return parseInt(precio) + parseInt(total)
    }

  onChangeQual(i,type)
  {
    const dataCar = this.state.dataCart
    let cantd = dataCar[i].cantidad;

    if (type) {
     cantd = cantd + 1
     dataCar[i].cantidad = cantd
     this.setState({dataCart:dataCar})
     AsyncStorage.setItem("cart", JSON.stringify(dataCar));
    }
    else if (type==false&&cantd>=2){
     cantd = cantd - 1
     dataCar[i].cantidad = cantd
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

  minimorequerido(){
    const comercio = this.props.navigation.getParam('comercio');
    if (comercio.minimo >= this.onLoadTotal()) {
      this.setState({isMinimo:true})
    }
   else {
    this.props.navigation.navigate("Ubicacion",{"datos":this.state.dataCart,"usuario":this.state.datoscomprador,"total":this.onLoadTotal(),"detalles":this.state.userDetalles,"comercio":this.props.navigation.getParam('comercio')})

  }
}

  

  cargar(celular)
 {

  const data_fb =  {
          id_facebook: this.state.id_facebook,
          email : this.state.email,
          name  : this.state.name,
          picture: this.state.picture,
          celular: this.state.celular,
          isLoading: false
        }

        this.setState(data_fb);
        AsyncStorage.setItem('user',JSON.stringify(data_fb));

  fetch('https://wepardo.com.ar/usuario.php', {
        method: 'post',
        header: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          // we will pass our input data to server
          nombre: this.state.name,
          email: this.state.email,
          foto: this.state.picture.data.url,
          idfacebook: this.state.id_facebook,
          celular: this.state.celular
          
        }),
      })

  this.setState({isTelefono:false})
 }


  handleEditItem = (editedItem) => {
        const newData = this.state.dataCart.map( item => {
            if (item.id === editedItem ) {
                item.detalles = this.state.inputText
                return item
            }
            return item
        })
        this.setState({ dataCart: newData, isVisible: false })
        AsyncStorage.setItem("cart", JSON.stringify(newData));
    }




  render() {
    const comercio = this.props.navigation.getParam('comercio');

    const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8bd00',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    textAlign: "center"
  }
});


    return (

      <View style={{flex:1,alignItems: 'center', justifyContent: 'center'}}>

      <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isTelefono}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.text}>AGREGAR CELULAR:</Text>
              <Text style={{fontWeight:"bold", fontSize:12}}>SIN EL 0 NI EL 15</Text>
                        <TextInput
                        keyboardType = 'numeric'
                        placeholder="EJ: 2932578332"
                            style={{width: width/2,
        marginBottom: 30,
        borderColor: 'gray', 
        borderBottomWidth: 2,
        fontSize: 16,}}
                            onChangeText={(text) => {this.setState({celular: text});}}
                            defaultValue={this.state.celular}
                            editable = {true}
                            multiline = {false}
                        /> 
                        <TouchableOpacity
            onPress={()=>this.cargar()}
            style={{
              width:(width/2),
              backgroundColor:'black',
              flexDirection:'row',
              alignItems:'center',
              justifyContent:"center",
              borderRadius:5,
              padding:4
            }}>
            <Text style={{fontSize:18, color:"white", fontWeight:"bold"}}>AGREGAR</Text>
            <View style={{width:10}} />
            <Icon name="ios-add-circle" size={30} color={"white"} />
          </TouchableOpacity>
         
                         
            </View>
          </View>
        </Modal>

         <View style={{height:5}} />

         

         <View style={{flexDirection:'row',justifyContent:'space-between'}}>
         <TouchableOpacity onPress={()=>this.eliminar()}>
                             <Icon name="ios-trash" style={{paddingHorizontal:8, paddingVertical:6}} size={32} color={"#33c37d"} />
                           </TouchableOpacity>
         <Text style={{fontSize:32,fontWeight:"bold",color:"#33c37d"}}>Carrito </Text>
         </View>
         <View style={{height:5}} />

         <View style={{flex:1}}>
         <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isVisible}
          onRequestClose={() => {
            this.setState({ isVisible: false });
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.text}>AGREGAR COMENTARIO:</Text>
              <Text style={{fontWeight:"bold", fontSize:12}}>{this.state.editedNombre}</Text>
                        <TextInput
                        placeholder="Detalla aqui tu producto"
                            style={{width: width/2,
        marginBottom: 30,
        borderColor: 'gray', 
        borderBottomWidth: 2,
        fontSize: 16,}}
                            onChangeText={(text) => {this.setState({inputText: text});}}
                            defaultValue={this.state.inputText}
                            editable = {true}
                            multiline = {false}
                        /> 
                        <TouchableOpacity
            onPress={()=>this.handleEditItem(this.state.editedItem)}
            style={{
              width:(width/2),
              backgroundColor:'black',
              flexDirection:'row',
              alignItems:'center',
              justifyContent:"center",
              borderRadius:5,
              padding:4
            }}>
            <Text style={{fontSize:18, color:"white", fontWeight:"bold"}}>AGREGAR</Text>
            <View style={{width:10}} />
            <Icon name="ios-add-circle" size={30} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity style={{top:20}} onPress={()=>this.setState({isVisible:false}) }>
      <View>
        <Text > SALIR </Text>
      </View>
    </TouchableOpacity>
                         
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isMinimo}
          onRequestClose={() => {
            this.setState({ isMinimo: false });
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{fontSize:18, color:"black", fontWeight:"bold"}}>MINIMO DE COMPRA:</Text>
              <Text style={{fontSize:30, color:"green", fontWeight:"bold"}}>${comercio.minimo}</Text>
              <Icon name="ios-alert" size={150} color={"black"} />
                        <TouchableOpacity
            onPress={()=>this.setState({isMinimo:false}) }
            style={{
              width:(width/2),
              backgroundColor:'black',
              flexDirection:'row',
              alignItems:'center',
              justifyContent:"center",
              borderRadius:5,
              padding:4
            }}>
            <Text style={{fontSize:18, color:"white", fontWeight:"bold"}}><Icon name="ios-arrow-back" size={18} color={"white"} /> ATRAS</Text>
            
            
          </TouchableOpacity>
          
                         
            </View>
          </View>
        </Modal>

           <ScrollView>

             {
               this.state.dataCart.map((item,i)=>{
                 return(
                 <TouchableOpacity onPress={()=>this.setState({isVisible:true,editedItem:item.id,inputText:item.detalles,editedNombre:item.nombre})}> 
                   <View style={{width:width-20,margin:10,backgroundColor:'transparent', flexDirection:'row', borderBottomWidth:2, borderColor:"#cccccc", paddingBottom:10}}>
                     <Image resizeMode={"contain"} style={{width:width/3,height:width/3, borderRadius:10}} source={{uri:item.foto}} />
                     <View style={{flex:1, backgroundColor:'trangraysparent', padding:10, justifyContent:"space-between"}}>
                       <View>

                         <Text style={{fontWeight:"bold", fontSize:20}}>{item.nombre}</Text>
                         <Text>#Wepardo</Text>
                       </View>
                       <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                         <Text style={{fontWeight:'bold',color:"#33c37d",fontSize:20}}>${item.precio*item.cantidad}</Text>
                         <View style={{flexDirection:'row', alignItems:'center'}}>
                         
                           <TouchableOpacity onPress={()=>this.onChangeQual(i,false)}>
                             <Icon name="ios-remove-circle" size={35} color={"#33c37d"} />
                           </TouchableOpacity>
                           <Text style={{paddingHorizontal:8, fontWeight:'bold', fontSize:18}}>{item.cantidad}</Text>
                           <TouchableOpacity onPress={()=>this.onChangeQual(i,true)}>
                             <Icon name="ios-add-circle" size={35} color={"#33c37d"} />
                           </TouchableOpacity>
                          
                         </View>


                       </View>
                      

                     </View>

                   </View>
                   </TouchableOpacity>

                 )
               })
             }
             <Text style={{fontSize:15,fontWeight:"bold",color:"#33c37d",textAlign:'center'}}>+ {comercio.precio == 0 ? 'ENVIO GRATIS' : '$' + comercio.precio + ' DE ENVIO'} </Text>
 </ScrollView>
             <View style={{height:10}} />
             
<Text style={{fontSize:28,fontWeight:"bold",color:"#33c37d",textAlign:'center'}}>${this.onLoadTotal()}</Text>
             <TextInput
              placeholder="¿Algo que quieras decirnos?"
              style={{margin:10, height: 40, width:width-20, borderColor: '#f2f2f2', borderRadius:10, backgroundColor:'white', borderWidth: 1, elevation:8, paddingHorizontal:20, textAlign: 'center', alignItems: 'center' }}
              onChangeText={userDetalles => this.setState({userDetalles})}
              value={this.state.textSearch}
            />


            {

              this.state.datosusu ?

             <TouchableOpacity
             onPress={()=>this.minimorequerido()}

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
             :
             <TouchableOpacity
             onPress={()=>this._authFB()}

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
                <Icon name="md-person-add" size={24}/> INICIAR SESION <Icon name="md-person-add" size={24}/>
               </Text>
             </TouchableOpacity>}

             <View style={{height:10}} />
          

         </View>

      </View>
    );
  }

    _authFB()
  {
    const dhis = this
    LoginManager.logInWithPermissions(["public_profile","email"]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );
          dhis._setDataFB()
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  }

  async _setDataFB()
  {
    // get token from facebook
    const tokenData = await AccessToken.getCurrentAccessToken().then(
      (data) => {
        return  data.accessToken.toString()
      }
    )
    // get data about profile from api graph
    const datajson = await this.apiGraphFace(tokenData)

    if (datajson.success) {
        console.log(datajson.data);
       // variable para enviar post
       

          const data_fb =  {
          id_facebook: datajson.data.id,
          email : datajson.data.email,
          name  : datajson.data.name,
          picture: datajson.data.picture,
          celular: this.state.celular,
          isLoading: false
        }

        this.setState(data_fb);
        this.setState({datoscomprador:datajson.data,
          datosusu:datajson.data.name});
        
        AsyncStorage.setItem('user',JSON.stringify(data_fb));
        this.setState({isTelefono:true});


    }
    else {
      console.log("Error get data");
    }
  }

  async apiGraphFace (token)  {

    const resface = await fetch('https://graph.facebook.com/v2.10/me?fields=id,name,email,picture.width(500)&access_token='+token)
   .then((response) => response.json())
   .then((json) => {
     const data = {
       data: json,
       success: true
     }
     return data ;
   })
   .catch((error) => {
     const data = {
       message: error,
       success: false
     }
     return data;
   })

   return resface;
 }



}