import { AsyncStorage } from 'react-native'

export default class SolutionsManager {
    static instance = null
    static getInstance() {
        if (SolutionsManager.instance == null || SolutionsManager.instance == undefined) {
            SolutionsManager.instance = new SolutionsManager()
        }
        return SolutionsManager.instance
    }
    /**
     * datastructure
     * chemical:{
     * solute:bool//if true = solute else = solvent
     * id:string
     * name:string
     * molarmass:float
     * remarks:string
     * }
     * solution:{
     * id:string
     * solvent:[]
     * solute:[
     * {solute:id,concentration:float,unit:string}...
     * ]
     * remarks:
     * }
     */
    constructor() {
        this.ready = false
        this.chemicals = []
        this.solutions = []
        this.solutionlist = []
        this.chemicallist = []
        this.getData()
        console.log(this.chemicals)
        console.log(this.solutions)
    }

    saveData = async () => {
        var status=[false,false]
        try {
            await AsyncStorage.setItem('chemicals', JSON.stringify(this.chemicals));
            status[0]=true
        } catch (error) {
            // Error saving data
            status[0]=false
        }
        try {
            await AsyncStorage.setItem('solutions', JSON.stringify(this.solutions));
            status[1]=true
        } catch (error) {
            // Error saving data
            status[1]=false
        }

    };

    getData = async () => {
        var status=[false,false]
        try {
            const value = await AsyncStorage.getItem('chemicals');
            if (value !== null) {
                // We have data!!
                console.log(value);
                status[0]=true
            }
        } catch (error) {
            // Error retrieving data
            status[0]=false
        }
        try {
            const value = await AsyncStorage.getItem('chemicals');
            if (value !== null) {
                // We have data!!
                console.log(value);
                status[1]=true
            }
        } catch (error) {
            // Error retrieving data
            status[1]=false
        }
        console.log('getting')
        console.log(status)
        if(status.filter(e=>e==false).length==0){
            this.ready=true
            return
        }else{
            this.saveData()
            return this.getData()
        }
    };

    getSolutionList() {
        if (this.ready) {
            return this.solutionlist
        } else {
            return { error: 'not ready' }
        }
    }


}