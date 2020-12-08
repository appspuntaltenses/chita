import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from "./food"
import Details from "./Details"

const AppNavigator = createStackNavigator({
    Home: Main,
    Details: Details,
  },
  {
    initialRouteName: 'Home',
  }
);

export default createAppContainer(AppNavigator);