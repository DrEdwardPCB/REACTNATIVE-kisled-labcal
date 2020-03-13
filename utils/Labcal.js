/**
 * used to store constant
 * 
 * current application = XXXXSCREEN
 * current screen = xxxxpage
 * drawerdisplayname = XXXXSCREENdn
 */

export default class LABCAL {
    //solution app
    static SOLUTIONSSCREEN = 'solutionscreen';

    static SOLUTIONSSCREENdn = 'Solutions Mix'

    static solutionpage = 'Solutions'
    static chemicaleditorpage = 'Chemical Editor'
    static solutioneditorpage = 'Solution Editor'

    //scientific calculator app
    static SCIENTIFICCALCULATORSCREEN = 'scientificcalculatorscreen'

    static SCIENTIFICCALCULATORSCREENdn = 'Scientific Calculator'

    static calculatorpage = 'Calculator '
    static graphplotterpage = 'Graph Plotter'

    //not yet implemented
    static MACHINELEARNINGSCREEN = 'machinelearningscreen'
    static BIOCHEMISTRYSCREEN = 'biochemistryscreen'
    static BIOINFORMATICSSCREEN = 'bioinformaticsscreen'


    static APPLIST = [
        {
            id: LABCAL.SOLUTIONSSCREEN,
            icon: 'flask-outline',//represent on drawer
            color: 'purple',//represent on drawer
            routename: LABCAL.SOLUTIONSSCREEN,
            displayname: LABCAL.SOLUTIONSSCREENdn,
            //component: Solutions
        },
        {
            id: LABCAL.SCIENTIFICCALCULATORSCREEN,
            icon: 'calculator-variant',//represent on drawer
            color: 'green',//represent on drawer
            routename: LABCAL.SCIENTIFICCALCULATORSCREEN,
            displayname: LABCAL.SCIENTIFICCALCULATORSCREENdn,
            //component: ScientificCalculator
        },
    ]
}