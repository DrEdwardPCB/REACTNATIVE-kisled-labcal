import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createStackNavigator();
import Solutions from './Screen/Solutions/SolutionsScreen'
import ScientificCalculator from './Screen/BioChemistry/'
import LABCAL from './utils/Labcal'
import { render } from 'react-dom';

export default class App extends React {
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="" component={Solutions} />
          <Stack.Screen name="Notifications" component={ScientificCalculator} />
          <Stack.Screen name="Profile" component={MachineLearning} />
          <Stack.Screen name="Settings" component={BioChemistry} />
          <Stack.Screen name="Settings" component={BioInformatics} />
        </Stack.Navigator>
      </NavigationContainer>
  
    );
  }
}
