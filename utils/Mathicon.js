import {createIconSetFromIcoMoon} from 'react-native-vector-icons'
import icoMoonConfig from '../resources/selection.json'
import * as symbola from '../resources/fonts/symbola.ttf' 
const MathIcon = createIconSetFromIcoMoon(
    icoMoonConfig,
    'symbola',
    require('../resources/fonts/symbola.ttf')
)
export default MathIcon