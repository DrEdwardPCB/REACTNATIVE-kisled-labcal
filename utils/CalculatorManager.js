import {AsyncStorage} from 'react-native'
const defaultCalculatorMemory={ A: 0, B: 0, C: 0, D: 0, X: 0, Y: 0, ans: 0, α:[], β:[]}

export default class CalculatorManager{
    static instance=null
    static getInstance(){
        if (CalculatorManager.instance==null){
            CalculatorManager.instance=new CalculatorManager()
        }
        return CalculatorManager.instance
    }
    constructor(){
        this.ready = false
        this.calculatorMemory=null
        this.getData()

    }
    changeAndSaveData=async (data)=>{
        var haha=JSON.parse(JSON.stringify(data))
        this.calculatorMemory=haha
        return await this.saveData()
    }
    getMemory=()=>{
        console.log('getting')
        if(this.ready){
            console.log('success in getting')
            console.log(this.memory)
            return this.calculatorMemory
        }else{
            console.log('error in getting')
            return {error:'e'}
        }
    }
    saveData = async () => {
        var status = [false]
        try {
            await AsyncStorage.setItem('calculatorMemory', JSON.stringify(this.calculatorMemory));
            status[0] = true
        } catch (error) {
            // Error saving data
            status[0] = false
        }
        if (status.filter(e => e == false).length == 0) {
            //console.log("save success")
            return true
        }else{
            return false
        }


    };

    getData = async () => {
        var status = [false]
        try {
            const value = await AsyncStorage.getItem('calculatorMemory');
            if (value !== null) {
                // We have data!!
                //console.log(value);
                this.calculatorMemory=JSON.parse(value)
                status[0] = true
            }
        } catch (error) {
            // Error retrieving data
            status[0] = false
        }
        if (status.filter(e => e == false).length == 0) {
            this.ready = true
            return
        } else {
            this.calculatorMemory=defaultCalculatorMemory
            this.saveData()
            return this.getData()
        }
    };
    resetDefault=async()=>{
        var keys = ['calculatorMemory']
        try {
            await AsyncStorage.multiRemove(keys)
            await this.getData()
            alert("operation success")
        } catch (error) {
            alert("operation failed")
        }
    }
    
}