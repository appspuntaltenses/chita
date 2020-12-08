import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Food from "./Food"
import Details from "./Details"
import Cart from "./Cart"
import Address from "./Address"
import Ticket from "./Ticket"
import Profile from "./Profile"
import Comercio from "./Comercios"
import Deshabilitado from "./Deshabilitado"

const AppNavigator = createStackNavigator({
    Home: Food,
    Details: Details,
    Cart: Cart,
    Ubicacion: Address,
    Ticket: Ticket,
    Usuario: Profile,
    Comercio: Comercio,
    Deshabilitado: Deshabilitado,
  },
  {
    initialRouteName: 'Home',
  }
);

export default createAppContainer(AppNavigator);