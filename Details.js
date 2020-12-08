import React from 'react';
import { View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
  ScrollView
} from 'react-native';

var {height, width } = Dimensions.get('window');
const baseUrl = "http://192.168.1.8/newspapers/public/"

export default class DetailsScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
        headerTitle: 'Detalles!',
        headerStyle: { backgroundColor:"#f2f2f2" },
    };
  };

  render() {
    const data = this.props.navigation.getParam('news')
    return (
      <ScrollView>
        <View style={{ flex: 1}}>
          <Image style={{width:width,height:200}} resizeMode="contain" source={{uri: data.foto}} />
          <View style={{padding:10}}>
            <Text style={styles.textDate}>{data.c}</Text>
            <Text style={styles.textTitle}>{data.nombre}</Text>
            <Text style={styles.textTheme}>${data.precio}</Text>
            <Text style={styles.textArticle}>{data.descripcion}</Text>
          </View>
        </View>
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
  textTheme:{
    fontSize:24,
    fontWeight:"bold",
  },
  textArticle:{
    fontSize:20
  }


})