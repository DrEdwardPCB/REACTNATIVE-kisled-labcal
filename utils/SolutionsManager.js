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
        //console.log(this.chemicals)
        //console.log(this.solutions)
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
            //console.log("save success")
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
                //console.log(value);
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
                //console.log(value);
                this.chemicals=JSON.parse(value)
                status[1] = true
            }
        } catch (error) {
            // Error retrieving data
            status[1] = false
        }
        //console.log('getting')
        //console.log(status)
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
    resetDefault=async()=>{
        var keys = ['solutions', 'chemicals']
        try {
            await AsyncStorage.multiRemove(keys)
            await this.getData()
            alert("operation success")
        } catch (error) {
            alert("operation failed")
        }
    }
    getChemical(id){
        //console.log(id)
        var found=this.chemicals.filter(e=>e.id===id)[0]
        //console.log(found)
        return found
    }
    getSolution(id){
        //console.log(id)
        var found=this.solutions.filter(e=>e.id===id)[0]
        //console.log(found)
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
        console.log(obj)
        if(obj.name===''){
            return false
        }
        if(obj.pH>14||obj.pH<0){
            return false
        }
        if(obj.solvent.length==0){
            return false
        }
        if(Math.round(obj.solvent.map(e=>{
            if(e.unit=="%v"){
                return this.getChemical(e.solvent).solutionDensity*parseFloat(e.concentration)
            }else{
                return parseFloat(e.concentration)
            }
        }).reduce((accum,current)=>{return accum+=current},0))!==100){
            return false
        }
        return true
        
    }
    async addNewSolution(obj){
        if(!this.verifySolution(obj)){
            return false
        }
        //console.log(obj)
        obj.id=uuid.v4()
        this.solutions.push(obj)
        var saved=await this.saveData()
        if(saved){
            this.solutionlist=this.solutions.map(e=>{return{id:e.id,name:e.name}})
            return true
        }else{
            return false
        }
    }
    async editSolution(obj){
        console.log(obj)
        if(!this.verifySolution(obj)){
            return false
        }
        if(!this.verifySolution(obj)){
            return false
        }
        this.solutions=this.solutions.map((e)=>{
            if(e.id===obj.id){
                return obj
            }else{
                return e
            }
        })
        console.log(this.solutions)
        var saved=await this.saveData()
        if(saved){
            this.solutionlist=this.solutions.map(e=>{return{id:e.id,name:e.name}})
            return true
        }else{
            return false
        }
    }
    async deleteSolution(id){
        var deletedList=this.solutions.filter(e=>e.id!==id)
        if(deletedList.length==this.solutions.length){
            return false
        }
        this.solutions=deletedList
        var saved = await this.saveData()
        if(saved){
            this.solutionlist = this.solutions.map(e => { return { id: e.id, name: e.name } })
            return true
        }else{
            return false
        }
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
        if(deletedList.length==this.chemicals.length){
            return false
        }
        this.chemicals=deletedList
        var deletedSolList=this.solutions.filter(e=>{
            var contains=false
            var solventc=e.solvent.filter(f=>{return f.solvent==id})
            var solutec=e.solute.filter(f=>{return f.solute==id})
            if(solventc.length>0||solutec.length>0){
                contains=true
            }
            if(contains){
                return false
            }else{
                return true
            }
        })
        this.solutions=deletedSolList
        var saved = await this.saveData()
        if(saved){
            this.chemicallist = this.chemicals.map(e => { return { id: e.id, name: e.name, solute:e.solute } })
            this.solutionlist = this.solutions.map(e => { return { id: e.id, name: e.name } })
            return true
        }else{
            return false
        }
    }


}