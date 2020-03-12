import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createStackNavigator();
import Solutions from './Screen/Solutions/SolutionsScreen'
import ScientificCalculator from './Screen/BioChemistry/'
import LABCAL from './utils/Labcal'

export default class App extends React {
  renderScreen(){
    var screenarray=[]
    for(var i=0;i<LABCAL.APPLIST.length;i++){
      screenarray.push(<Stack.Screen name={LABCAL.APPLIST[i].routename} headerMode='none' component={LABCAL.APPLIST[i].component}/>)
    }
  }
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {this.renderScreen()}
        </Stack.Navigator>
      </NavigationContainer>
  
    );
  }
}
