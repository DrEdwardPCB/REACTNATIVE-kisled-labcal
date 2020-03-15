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
            density:1,//g/ml
            name: 'H2O',
            molarmass: 18.01528,
            remarks: 'universal solvent, essential for life',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '1',
            name: 'KCl',
            molarmass: 74.55150,
            remarks: 'Potassium chloride',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '2',
            name: 'NaCl',
            molarmass: 58.44300,
            remarks: 'Sodium chloride',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '3',
            name: 'Na2HPO4',
            molarmass: 141.95897,
            remarks: 'Disodium phosphate',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '4',
            name: 'KH2PO4',
            molarmass: 136.08569,
            remarks: 'Potassium dihydrogen phosphate',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '5',
            name: 'CaCl2',
            molarmass: 110.98,
            remarks: 'Calcium chloride',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '6',
            name: 'MgSO4-7H2O',
            molarmass: 246.475,
            remarks: 'Magnesium sulphate 7 water',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '7',
            name: 'MgCl2-6H2O ',
            molarmass: 203.303,
            remarks: 'Magnesium chloride 6 water',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '8',
            name: 'Na2HPO4-2H2O',
            molarmass: 177.99,
            remarks: 'Disodium phosphate 2 water',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '9',
            name: 'D-Glucose (Dextrose)',
            molarmass: 180.156,
            remarks: 'D-Glucose (Dextrose)',
        },
        {
            solute: true,//if true = solute else = solvent
            id: '10',
            name: 'NaHCO3 ',
            molarmass: 84.007,
            remarks: 'Sodium Carbonate',
        }
    ]
} 
