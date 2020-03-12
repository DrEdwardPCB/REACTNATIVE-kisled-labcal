/**
 * used to store constant
 * 
 * current application = XXXXSCREEN
 * current screen = xxxxpage
 * drawerdisplayname = XXXXSCREENdn
 */
import Solutions from '../Screen/Solutions/SolutionsScreen'
import ScientificCalculator from '../Screen/ScientificCalculator/ScientificCalculatorScreen'
export default class LABCAL {
    //solution app
    static SOLUTIONSSCREEN = 'solutionscreen';

    static SOLUTIONSSCREENdn = 'Solutions Mix'

    static solutionpage = 'solution page'
    static chemicaleditorpage = 'chemical editor'
    static solutioneditorpage = 'solution editor'

    //scientific calculator app
    static SCIENTIFICCALCULATORSCREEN = 'scientificcalculatorscreen'

    static SCIENTIFICCALCULATORSCREENdn = 'Scientific Calculator'

    static calculatorpage = 'calculator '
    static graphplotter = 'graph plotter'

    //not yet implemented
    static MACHINELEARNINGSCREEN = 'machinelearningscreen'
    static BIOCHEMISTRYSCREEN = 'biochemistryscreen'
    static BIOINFORMATICSSCREEN = 'bioinformaticsscreen'


    static APPLIST = [
        {
            id: LABCAL.SOLUTIONSSCREEN,
            icon: '',//represent on drawer
            color: '',//represent on drawer
            routename: LABCAL.SOLUTIONSSCREEN,
            displayname: LABCAL.SOLUTIONSSCREENdn,
            component: Solutions
        },
        {
            id: LABCAL.SCIENTIFICCALCULATORSCREEN,
            icon: '',//represent on drawer
            color: '',//represent on drawer
            routename: LABCAL.SCIENTIFICCALCULATORSCREEN,
            displayname: LABCAL.SCIENTIFICCALCULATORSCREENdn,
            component: ScientificCalculator
        },
    ]
}