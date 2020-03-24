import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createStackNavigator();
import Solutions from './Screen/Solutions/SolutionsScreen'
import ScientificCalculator from './Screen/ScientificCalculator/ScientificCalculatorScreen'
import LABCAL from './utils/Labcal'
import SolutionsManager from './utils/SolutionsManager';
import Settings from './Screen/Settings/SettingScreen'

export default class App extends React.Component {
  constructor(){
    super()
    SolutionsManager.getInstance()
  }
  renderScreen() {
    var screenarray = []
    for (var i = 0; i < LABCAL.APPLIST.length; i++) {
      screenarray.push(<Stack.Screen name={LABCAL.APPLIST[i].routename} headerMode='none' component={
        LABCAL.APPLIST[i].id == LABCAL.SOLUTIONSSCREEN ? Solutions : LABCAL.APPLIST[i].id == LABCAL.SCIENTIFICCALCULATORSCREEN ? ScientificCalculator : ScientificCalculator}
      />)
    }
    return screenarray
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {
            //this.renderScreen()
          }
          <Stack.Screen name={LABCAL.SOLUTIONSSCREEN} options={{headerShown:false}} component={Solutions}/>
          <Stack.Screen name={LABCAL.SCIENTIFICCALCULATORSCREEN} options={{headerShown:false}} component={ScientificCalculator}/>
          <Stack.Screen name={LABCAL.SETTINGSSCREEN} options={{headerShown:false}} component={Settings}/>
        </Stack.Navigator>
      </NavigationContainer>

    );
  }
}
