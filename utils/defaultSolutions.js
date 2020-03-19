export default class DefaultSolutions {
    static solutions = [
        {
            id: '0',
            name: '1x PBS Buffer',
            solvent: [
                { solvent: '0', concentration: 100, unit: '%w' }
            ],
            solute: [
                { solute: '1', concentration: 0.0027, unit: 'M' },
                { solute: '2', concentration: 0.1370, unit: 'M' },
                { solute: '3', concentration: 0.01, unit: 'M' },
                { solute: '4', concentration: 0.0018, unit: 'M' }
            ],
            pH: 7.4,
            remarks: 'standard phosphate-buffered-saline from wikipedia',
        },
        {
            id: '1',
            name: '1x HBSS Buffer',
            solvent: [
                { solvent: '0', concentration: 100, unit: '%w' }
            ],
            solute: [
                { solute: '1', concentration: 0.005, unit: 'M' },
                { solute: '2', concentration: 0.14, unit: 'M' },
                { solute: '5', concentration: 0.001, unit: 'M' },
                { solute: '6', concentration: 0.0004, unit: 'M' },
                { solute: '7', concentration: 0.0005, unit: 'M' },
                { solute: '8', concentration: 0.0003, unit: 'M' },
                { solute: '9', concentration: 0.006, unit: 'M' },
                { solute: '10', concentration: 0.004, unit: 'M' },
                { solute: '4', concentration: 0.0004, unit: 'M' },
            ],
            pH: 7.4,
            remarks: "HBSS (Hank's Balanced Salt Solution) from aatbio.com",
        },
    ]
    static chemicals = [
        {
            solute: false,//if true = solute else = solvent
            id: '0',
            solutionDensity:1,//g/ml
            name: 'H2O',
            molarmass: 18.01528,
            dissociationMultiplier:1,
            remarks: 'universal solvent, essential for life',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '1',
            solutionDensity:'n/a',//g/ml
            name: 'KCl',
            molarmass: 74.55150,
            dissociationMultiplier:2,
            remarks: 'Potassium chloride',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '2',
            solutionDensity:'n/a',//g/ml
            name: 'NaCl',
            molarmass: 58.44300,
            dissociationMultiplier:2,
            remarks: 'Sodium chloride',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '3',
            solutionDensity:'n/a',//g/ml
            name: 'Na2HPO4',
            molarmass: 141.95897,
            dissociationMultiplier:3,
            remarks: 'Disodium phosphate',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '4',
            solutionDensity:'n/a',//g/ml
            name: 'KH2PO4',
            molarmass: 136.08569,
            dissociationMultiplier:3,
            remarks: 'Potassium dihydrogen phosphate',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '5',
            solutionDensity:'n/a',//g/ml
            name: 'CaCl2',
            molarmass: 110.98,
            dissociationMultiplier:3,
            remarks: 'Calcium chloride',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '6',
            solutionDensity:'n/a',//g/ml
            name: 'MgSO4-7H2O',
            molarmass: 246.475,
            dissociationMultiplier:2,
            remarks: 'Magnesium sulphate 7 water',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '7',
            solutionDensity:'n/a',//g/ml
            name: 'MgCl2-6H2O ',
            molarmass: 203.303,
            dissociationMultiplier:3,
            remarks: 'Magnesium chloride 6 water',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '8',
            solutionDensity:'n/a',//g/ml
            name: 'Na2HPO4-2H2O',
            molarmass: 177.99,
            dissociationMultiplier:3,
            remarks: 'Disodium phosphate 2 water',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '9',
            solutionDensity:'n/a',//g/ml
            name: 'D-Glucose (Dextrose)',
            molarmass: 180.156,
            dissociationMultiplier:1,
            remarks: 'D-Glucose (Dextrose)',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '10',
            solutionDensity:'n/a',//g/ml
            name: 'NaHCO3 ',
            dissociationMultiplier:2,
            molarmass: 84.007,
            remarks: 'Sodium Carbonate',
        }
    ]
} 
