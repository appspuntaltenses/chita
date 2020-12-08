import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Ordenes from "./Ordenes"
import Ticket from "./Ticket"


const AppNavigator = createStackNavigator({
    Ordenes: Ordenes,
    Ticket: Ticket,
    
  },
  {
    initialRouteName: 'Ordenes',
  }
);

export default createAppContainer(AppNavigator);