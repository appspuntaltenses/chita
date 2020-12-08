import React, { Component } from 'react';
import {
  Text,
  Alert,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
var { height, width } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';
import { AsyncStorage } from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import MercadoPagoCheckout from '@blackbox-vision/react-native-mercadopago-px';
import io from "socket.io-client";

const Env = {
  ACCESS_TOKEN: 'APP_USR-835534770985910-061220-f5721b06a62b87f09fe89cdab71cbcc6-583504373',
  PUBLIC_KEY: 'APP_USR-b2c74551-c569-4d6d-a1ee-f13d04284813',
};

const getPreferenceId = async (payer, ...items) => {
  const response = await fetch(
    `https://api.mercadopago.com/checkout/preferences?access_token=${Env.ACCESS_TOKEN}`,
    {
      method: 'POST',
      body: JSON.stringify({
        items,
        payer: {
          email: payer,
        },
        payment_methods: {
          excluded_payment_types: [{ id: 'ticket' }, { id: 'atm' }],
          default_installments: 1,
        },
      }),
    }
  );

  const preference = await response.json();

  return preference.id;
};


export default class Address extends Component {
  // No hace falta que uses el constructor para crear el initial state de tu componente
  state = {
    data: '',
    latitude: -38.8758812,
    longitude: -62.0735893,
    userDireccion: '',
    userDetalles: 'No detalla',
    isVisible: false,
    isVisiblepago: false,
    id: null,
  };

  componentDidMount() {
    Geolocation.getCurrentPosition(
      (info) => {
        this.setState({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
        const loca = {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        };

      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
    this.socket = io("https://wepardo.herokuapp.com/");
  }

  // Los callbacks siempre hacelos con arrow functions
  comprar = (dato) => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    const comercio = this.props.navigation.getParam('comercio');

    if (this.state.userDireccion == '') {
      this.setState({ isVisiblepago: false });
      Alert.alert(
        'SIN DIRECCION',
        'Por favor ingresa tu direccion',
        [{ text: 'Excelente!', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    } else {
      this.setState({ isVisiblepago: false, isVisible: true });

      const usuario = this.props.navigation.getParam('usuario');
      const compras = this.props.navigation.getParam('datos');
      const total = this.props.navigation.getParam('total');
      const detalles = this.props.navigation.getParam('detalles');
      const comercio = this.props.navigation.getParam('comercio');
      const mapa =
        'https://maps.google.com/?q=' +
        JSON.stringify(this.state.latitude) +
        ',' +
        JSON.stringify(this.state.longitude);

      fetch('https://wepardo.com.ar/data.php', {
        method: 'post',
        header: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          // we will pass our input data to server
          pedido: compras,
          nombre: usuario.name,
          idfacebook: usuario.id_facebook,
          detalles: detalles,
          total: total,
          comercioid: comercio.id,
          comercio: comercio.nombre,
          mapa: mapa,
          direccion: this.state.userDireccion,
          detallesdire: this.state.userDetalles,
          metodo: dato,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson > '1') {
            // redirect to profile page
            const ticket = {
              id: responseJson,
              Compras: this.props.navigation.getParam('datos'),
              Total: this.props.navigation.getParam('total'),
              Detalles: this.props.navigation.getParam('detalles'),
              Direccion: this.state.userDireccion,
              Comercio: comercio.nombre,
              Envio: comercio.precio,
              fecha:
                date + '-' + month + '-' + year + ' | ' + hours + ':' + min,
            };

            AsyncStorage.getItem('ordenes')
              .then((dataorden) => {
                if (dataorden !== null) {
                  // We have data!!
                  const orden = JSON.parse(dataorden);
                  orden.push(ticket);
                  AsyncStorage.setItem('ordenes', JSON.stringify(orden));
                } else {
                  const orden = [];
                  orden.push(ticket);
                  AsyncStorage.setItem('ordenes', JSON.stringify(orden));
                }
              })
              .catch((err) => {
                alert(err);
              });

            this.setState({ isVisible: false });

            this.socket.emit('nuevo');

            this.props.navigation.navigate('Ticket', { ticket: ticket });
          } else {
            this.setState({ isVisible: false });
            Alert.alert('ERROR', 'No pudimos realizar tu pedido');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  render() {

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Enviando pedido!</Text>
              <ActivityIndicator size="large" color="#f8bd00" />
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isVisiblepago}
          onRequestClose={() => {
            this.setState({ isVisiblepago: false });
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => this.comprar('efectivo')}
                style={{
                  backgroundColor: '#33c37d',
                  width: width - 150,
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 5,
                  margin: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: width > 310 ? 20: 15,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  <Icon name="ios-cash" size={width > 310 ? 20: 15} color={'white'} /> EFECTIVO
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.onMercadoPagoPayment}
                style={{
                  backgroundColor: '#009EE3',
                  width: width - 150,
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: width > 310 ? 20: 15,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  <Icon name="ios-card" size={width > 310 ? 20: 15} color={'white'} /> MERCADOPAGO
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <MapView
          style={{ width: width, height: height - 15 }}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0042,
            longitudeDelta: 0.0121,
          }}
          onPress={(e) => this.onClickMap(e.nativeEvent)}
        >
          <MapView.Marker
            draggable
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
            }}
            onDragEnd={(e) => this.movementMarker(e.nativeEvent)}
            title="¿Tu estas aqui?"
            description="Actualiza el mapa"
          />
        </MapView>

        <TouchableOpacity
          style={{
            backgroundColor: 'black',
            height: 60,
            width: 60,
            borderRadius: 50,
            alignItems: 'center',
            padding: 5,
            position: 'absolute',
            top: 10,
            right: 10,
          }}
          onPress={() => this._getLocation()}
        >
          <Icon name="md-locate" size={50} color={'orange'} />
        </TouchableOpacity>

        

        <TextInput
          placeholder="¿Cual es tu direccion?"
          style={{
            height: 40,
            width: width - 20,
            borderColor: '#f2f2f2',
            borderRadius: 10,
            position: 'absolute',
            bottom: 110,
            backgroundColor: 'white',
            borderWidth: 1,
            elevation: 8,
            shadowOpacity: 0.3,
            shadowRadius: 50,
            paddingHorizontal: 20,
            textAlign: 'center',
          }}
          onChangeText={(userDireccion) => this.setState({ userDireccion })}
          value={this.state.textSearch}
        />
        <TextInput
          placeholder="¿Alguna referencia de tu hogar?"
          style={{
            height: 40,
            width: width - 20,
            borderColor: '#f2f2f2',
            borderRadius: 10,
            position: 'absolute',
            bottom: 65,
            backgroundColor: 'white',
            borderWidth: 1,
            elevation: 8,
            shadowOpacity: 0.3,
            shadowRadius: 50,
            paddingHorizontal: 20,
            textAlign: 'center',
          }}
          onChangeText={(userDetalles) => this.setState({ userDetalles })}
          value={this.state.textSearch}
        />

        <TouchableOpacity
          style={{
                 backgroundColor:"#33c37d",
                 width:width-40,
                 alignItems:'center',
                 padding:10,
                 borderRadius:5,
                 position: 'absolute',
                 bottom:5
               }}
          onPress={() => this.setState({ isVisiblepago: true })}
        >
          <Text style={{
                   fontSize: width > 310 ? 24: 20,
                   fontWeight:"bold",
                   color:'white'
                 }}>FINALIZAR COMPRA</Text>
        </TouchableOpacity>
      </View>
    );
  }



  onMercadoPagoPayment = async () => {
    if (this.state.userDireccion == '') {
      this.setState({ isVisiblepago: false });
      Alert.alert(
        'SIN DIRECCION',
        'Por favor ingresa tu direccion',
        [{ text: 'Excelente!', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    } else {
const total = this.props.navigation.getParam('total');
const comercio = this.props.navigation.getParam('comercio');
const usuario = this.props.navigation.getParam('usuario');
    try {
      const preferenceId = await getPreferenceId(usuario.email, {
        title: comercio.nombre,
        description: 'Wepardo Delivery',
        picture_url: 'https://wepardo.com.ar/WEPARDO.png',
        quantity: 1,
        currency_id: 'ARS',
        unit_price: total,

      });

      // Inicias el Payment con el publicKey y el preferenceId
      const payment = await MercadoPagoCheckout.createPayment({
        publicKey: Env.PUBLIC_KEY,
        preferenceId,
        advancedOptions: {
          bankDealsEnabled: false
        },
      });



   if (payment.status === 'in_process') {
        Alert.alert(
          'ATENCION - Pago en proceso',
          'Comunicate con nuestro soporte'
        );
    }
        else if (payment.status === 'rejected') {
          this.setState({ isVisiblepago: false });
        Alert.alert(
          'Pago rechazado',
          'El pago a sido rechazado, intentelo nuevamente.'
        );
      } else {
        this.setState({ isVisiblepago: false });
        Alert.alert(
          'Felicitaciones!',
          'Su pago se a realizado con exito!'
        );
        this.comprar('mercadopago');
      }
    } catch (err) {
      if (err.message.includes('cancel')) {
        this.setState({ isVisiblepago: false });
       
        Alert.alert(
          'El pago se cancelo',
          'Prueba otra vez o paga en efectivo'
        );

      } else {
        Alert.alert(
          'Hubo un problema con el pago',
          'Intentalo de nuevo. Si el error persiste contactate con soporte'
        );
      }
    }
  }
  
  };



  // Los callbacks siempre hacelos con arrow functions
  _getLocation = () => {
    Geolocation.getCurrentPosition(
      (info) => {
        this.setState({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
        const loca = {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        };
      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
  };

  // Los callbacks siempre hacelos con arrow functions
  movementMarker = (e) => {
    // get coordinate from mapviews
    const { latitude, longitude } = e.coordinate;
    // update coordinate
    this.setState({
      latitude: latitude,
      longitude: longitude,
    });
  };

  // Los callbacks siempre hacelos con arrow functions
  onClickMap = (e) => {
    const { latitude, longitude } = e.coordinate;
    this.setState({
      latitude: latitude,
      longitude: longitude,
    });
  };
}

// El styles nunca adentro del render porque podes hacer que se redibuje constantemente
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8bd00',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
});