import { AsyncStorage } from 'react-native'
import DefaultSolutions from "./defaultSolutions";
import uuid from "react-native-uuid"

export default class SolutionsManager {
    static instance = null
    static getInstance() {
        if (SolutionsManager.instance == null || SolutionsManager.instance == undefined) {
            SolutionsManager.instance = new SolutionsManager()
        }
        return SolutionsManager.instance
    }
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
        var status = [false, false]
        try {
            await AsyncStorage.setItem('chemicals', JSON.stringify(this.chemicals));
            status[0] = true
        } catch (error) {
            // Error saving data
            status[0] = false
        }
        try {
            await AsyncStorage.setItem('solutions', JSON.stringify(this.solutions));
            status[1] = true
        } catch (error) {
            // Error saving data
            status[1] = false
        }
        if (status.filter(e => e == false).length == 0) {
            console.log("save success")
            return true
        }else{
            return false
        }


    };

    getData = async () => {
        var status = [false, false]
        try {
            const value = await AsyncStorage.getItem('solutions');
            if (value !== null) {
                // We have data!!
                console.log(value);
                this.solutions=JSON.parse(value)
                status[0] = true
            }
        } catch (error) {
            // Error retrieving data
            status[0] = false
        }
        try {
            const value = await AsyncStorage.getItem('chemicals');
            if (value !== null) {
                // We have data!!
                console.log(value);
                this.chemicals=JSON.parse(value)
                status[1] = true
            }
        } catch (error) {
            // Error retrieving data
            status[1] = false
        }
        console.log('getting')
        console.log(status)
        if (status.filter(e => e == false).length == 0) {
            this.chemicallist = this.chemicals.map(e => { return { id: e.id, name: e.name, solute:e.solute } })
            this.solutionlist = this.solutions.map(e => { return { id: e.id, name: e.name} })
            this.ready = true
            return
        } else {
            this.solutions = JSON.parse(JSON.stringify(DefaultSolutions.solutions))
            this.chemicals = JSON.parse(JSON.stringify(DefaultSolutions.chemicals))
            this.saveData()
            return this.getData()
        }
    };
    getChemical(id){
        console.log(id)
        var found=this.chemicals.filter(e=>e.id===id)[0]
        console.log(found)
        return found
    }
    getSolution(id){
        console.log(id)
        var found=this.solutions.filter(e=>e.id===id)[0]
        console.log(found)
        return found
    }
    getSolutionList() {
        if (this.ready) {
            return this.solutionlist
        } else {
            return { error: 'not ready' }
        }
    }
    getChemicalList() {
        if (this.ready) {
            return this.chemicallist
        } else {
            return { error: 'not ready' }
        }
    }
    verifySolution(obj){

    }
    async addNewSolution(obj){
        await this.saveData()
    }
    async editSolution(obj){
        await this.saveData()
    }
    /**
     * datastructure
     * chemical:{
     * solute:bool//if true = solute else = solvent
     * id:string
     * name:string
     * molarmass:float
     * remarks:string
     * density:
     * }
     * solution:{
     * id:string
     * name:string
     * solvent:[]
     * solute:[
     * {solute:id,concentration:float,unit:string}...
     * ]
     * pH:
     * remarks:
     * }
     */
    verifyChemical(obj){
        if(obj.molarmass==0){
            return false
        }
        if(obj.name===''){
            return false
        }
        if(!obj.solute&&obj.solutionDensity=='n/a'){
            return false
        }
        if(isNaN(obj.dissociationMultiplier)){
            return false
        }
        return true
    }
    async addNewChemical(obj){
        if(!this.verifyChemical(obj)){
            return false
        }
        obj.id==uuid.v4()
        this.chemicals.push(obj)
        var saved = await this.saveData()
        if(saved){
            this.chemicallist = this.chemicals.map(e => { return { id: e.id, name: e.name, solute:e.solute } })
            return true
        }else{
            return false
        }
    }
    async editChemical(obj){
        if(!this.verifyChemical(obj)){
            return false
        }
        this.chemicals=this.chemicals.map((e)=>{
            if(e.id===obj.id){
                return obj
            }else{
                return e
            }
        })
        var saved=await this.saveData()
        if(saved){
            
            this.chemicallist = this.chemicals.map(e => { return { id: e.id, name: e.name, solute:e.solute } })
            return true
        }else{
            return false
        }
    }
    async deleteChemical(id){
        var deletedList=this.chemicals.filter(e=>e.id!==id)
        if(deletedList.length==this.chemicals.list){
            return false
        }
        this.chemicals=deletedList
        var saved = await this.saveData()
        if(saved){
            this.chemicallist = this.chemicals.map(e => { return { id: e.id, name: e.name, solute:e.solute } })
            return true
        }else{
            return false
        }
    }


}