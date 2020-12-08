import React, { Component } from 'react';
import { Text, Dimensions,  View, TextInput, TouchableOpacity, Image, Modal, Linking, StyleSheet } from 'react-native';
var { width } = Dimensions.get("window")
import Icon from 'react-native-vector-icons/Ionicons';

import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { AsyncStorage } from 'react-native';

export default class Profile extends Component {

  constructor(props) {
  	
     super(props);
     this.state = {
       id_facebook:null,
       picture:null,
       name:null,
       email:null,
       token:null,
       celular:null,
       isLoading: true,
       isTelefono: false
     }; 
  }

  componentDidMount()
  {



    AsyncStorage.getItem('user').then((user)=>{
      if (user !== null) {
        // We have data!!
        const datauser = JSON.parse(user)

        const data_fb =  {
          id_facebook: datauser.id_facebook,
          email : datauser.email,
          name  : datauser.name,
          picture: datauser.picture,
          celular: datauser.celular,
          isLoading: false
        }
        this.setState(data_fb);

      }
    })


    .catch((err)=>{
      alert(err)
    })
  }


 eliminar()
 {
 	LoginManager.logOut()
 	AsyncStorage.removeItem('user')
 	this.setState({id_facebook:null})
 }

 whatsapp()
 {
  const skere = 'Hola, Quiero ser parte de Wepardo!';
const whasts = '2915660209';
 Linking.openURL('whatsapp://send?text=' + skere + '&phone=549' + whasts);
 }

 soporte(nombre)
 {
  const skere = 'Hola, Necesito ayuda! Mi nombre es: ' + nombre;
const whasts = '2915660209';
 Linking.openURL('whatsapp://send?text=' + skere + '&phone=549' + whasts);
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





  render() {
  	 const isLoggedIn = this.state.isLoading;
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

         {
           this.state.id_facebook?
           <View style={{justifyContent:'center'}}>
             <Image source={{uri: this.state.picture.data.url}} style={{width:200,height:200,borderRadius:350}} />
             <View style={{height:20}} />
             <Text style={{fontSize:20,fontWeight:"bold"}}>{this.state.name}</Text>
             <Text style={{fontSize:20}}>{this.state.email}</Text>
             <TouchableOpacity
             onPress={()=>this.setState({isTelefono:true})}
             style={{
               backgroundColor:"#33c37d",
              
               alignItems:'center',
               padding:10,
               borderRadius:5
             }}><Text style={{fontSize:20,fontWeight:'bold',color:"white"}}><Icon name="logo-whatsapp" size={20} color={"white"} /> {this.state.celular}</Text>
             </TouchableOpacity>
             <Text >#WepardoDelivery</Text>

             <TouchableOpacity
             onPress={()=>this.eliminar()}
             style={{
               backgroundColor:"#3b5998",
              
               alignItems:'center',
               padding:10,
               borderRadius:5
             }}>
             <Text style={{
                 fontSize:24,
                 fontWeight:'bold',
                 color:"white"
               }}>
               Cerrar Sesion <Icon name="logo-facebook" size={30} color={"white"} />
             </Text>
           </TouchableOpacity>

           </View>
           :
           <TouchableOpacity
             onPress={()=>this._authFB()}
             style={{
               backgroundColor:"#3b5998",
               width:width-40,
               alignItems:'center',
               padding:10,
               borderRadius:5
             }}>
             <Text style={{
                 fontSize:24,
                 fontWeight:'bold',
                 color:"white"
               }}>
               Iniciar con  <Icon name="logo-facebook" size={30} color={"white"} />
             </Text>
           </TouchableOpacity>
         }

<View style={{height:15}} />
<TouchableOpacity
             onPress={()=>this.whatsapp()}
             style={{
               backgroundColor:"#f8bd00",
              
               alignItems:'center',
               padding:10,
               borderRadius:5
             }}>

             <Text style={{
                 fontSize:10,
                 fontWeight:'bold',
                 color:"#e23027"
               }}>
              ¿TENES UN COMERCIO O QUERES SER REPARTIDOR?
             </Text>
           </TouchableOpacity>
           <TouchableOpacity
             onPress={()=>this.soporte(this.state.name)}
             style={{
               backgroundColor:"red",
               position: 'absolute',
            bottom: 10,
              margin: 10,
               alignItems:'center',
               padding:10,
               borderRadius:5
             }}>

             <Text style={{
                 fontSize:10,
                 fontWeight:'bold',
                 color:"white"
               }}>
              SOPORTE TECNICO 24/7
             </Text>
           </TouchableOpacity>

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