import Drawer from 'react-native-drawer'
import React from 'react'
import { Header, Left, Right, Container, Icon, Button, Text, Title, Content, Footer, Body, Item, Grid, Row, Col, Card, CardItem, } from 'native-base'
import { DeckSwiper } from '../../updatedModules/nativebase/functionDeckSwiper'
import ControlPanel from '../../utils/ControlPanel'
import LABCAL from '../../utils/Labcal'
import { AsyncStorage, Dimensions, View, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview';
import uuid from "react-native-uuid";
import Katex from 'react-native-katex';
import { create, all } from 'mathjs'
import { Switch, Divider } from 'react-native-paper'
import MathIcon from '../../utils/Mathicon'
import CalculatorManager from '../../utils/CalculatorManager'
import { isIphoneX } from 'react-native-iphone-x-helper'
const config = {}
const MathJS = create(all, config)


export default class ScientificCalculator extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            navigation: props.navigation,
            currentPage: LABCAL.calculatorpage,
            currentApp: LABCAL.SCIENTIFICCALCULATORSCREENdn
        }
        CalculatorManager.getInstance()

    }
    updatePage = (page) => {
        this.setState({ currentPage: page })
    }
    closeControlPanel = () => {
        this._drawer.close()
    };
    openControlPanel = () => {
        this._drawer.open()
    };
    render() {

        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                content={<ControlPanel navigation={this.props.navigation} closeHandler={this.closeControlPanel} currentPage={this.state.currentPage} currentApp={this.state.currentApp} updatePage={this.updatePage} />}
                tapToClose={true}
                openDrawerOffset={0.2} // 20% gap on the right side of drawer
                panCloseMask={0.2}
                closedDrawerOffset={-3}
                //styles={drawerStyles}
                tweenHandler={(ratio) => ({
                    main: { opacity: (2 - ratio) / 2 }
                })}
            >
                <MainView navigation={this.props.navigation} openHandler={this.openControlPanel} currentPage={this.state.currentPage} />
            </Drawer>
        )
    }
}
class MainView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage: props.currentPage,
        }
    }
    static getDerivedStateFromProps(props, state) {
        if (props.currentPage !== state.currentPage) {
            return {
                currentPage: props.currentPage
            }
        } else {
            return null
        }
    }

    renderPages() {
        //mapping
        if (this.state.currentPage === LABCAL.calculatorpage) {
            return (<Calculator></Calculator>)
        } else if (this.state.currentPage === LABCAL.graphplotterpage) {
            return (<GraphPlotter></GraphPlotter>)
        }
    }
    render() {
        return (
            <Container>
                <Header transparent>
                    <Left>
                        <Button transparent onPress={() => { this.props.openHandler() }}>
                            <Icon type='MaterialCommunityIcons' name='menu-open' style={{ color: 'blue', fontSize: 24 }} />

                        </Button>
                    </Left>
                </Header>
                {this.renderPages()}
                {/*<Footer>
                    <Button
                        full
                        onPress={() => {
                            AsyncStorage.clear(() => { console.log('clear success') })
                        }}><Text>clear</Text></Button>
                    </Footer>*/}
            </Container>
        )

    }
}



class Calculator extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mathArr: ['cursor'],
            memory: CalculatorManager.getInstance().getMemory(),
            ans: ""
        }
    }
    componentDidMount() {
        if (this.state.memory.error) {
            this.interval = setInterval(() => {
                this.setState({ memory: CalculatorManager.getInstance().getMemory() }, () => {
                    if (!this.state.memory.error) {
                        clearInterval(this.interval)
                    }
                })
            }, 500)
        }
    }
    saveto = (alphabet, value) => {
        console.log('savetofnc')
        console.log(this)
        console.log(this.state)
        console.log(this.state.memory)
        var tempmem = JSON.parse(JSON.stringify(this.state.memory))
        tempmem[alphabet] = value
        this.setState({ memory: tempmem }, () => { CalculatorManager.getInstance().changeAndSaveData(tempmem) })
    }
    pushto = (alphabet, value) => {
        var tempmem = JSON.parse(JSON.stringify(this.state.memory))
        tempmem[alphabet].push(value)
        this.setState({ memory: tempmem }, () => { CalculatorManager.getInstance().changeAndSaveData(tempmem) })
    }
    delArray = (alphabet) => {
        var tempmem = JSON.parse(JSON.stringify(this.state.memory))
        tempmem[alphabet] = []
        this.setState({ memory: tempmem }, () => { CalculatorManager.getInstance().changeAndSaveData(tempmem) })
    }
    moveCursorRight = () => {
        if (this.state.mathArr.length == 1) {
            return this.state.mathArr
        } else if (this.state.mathArr[this.state.mathArr.length - 1] == 'cursor') {
            return this.state.mathArr
        }
        var cursorindex = this.state.mathArr.indexOf('cursor')
        var rightone = this.state.mathArr[cursorindex + 1]
        var newArray = this.state.mathArr.map((e, i) => {
            if (i == cursorindex) {
                return rightone
            } else if (i == cursorindex + 1) {
                return 'cursor'
            } else {
                return e
            }
        })
        return newArray
    }
    moveCursorLeft = () => {
        if (this.state.mathArr.length == 1) {
            return this.state.mathArr
        } else if (this.state.mathArr[0] == 'cursor') {
            return this.state.mathArr
        }
        var cursorindex = this.state.mathArr.indexOf('cursor')
        var leftone = this.state.mathArr[cursorindex - 1]
        var newArray = this.state.mathArr.map((e, i) => {
            if (i == cursorindex) {
                return leftone
            } else if (i == cursorindex - 1) {
                return 'cursor'
            } else {
                return e
            }
        })
        return newArray
    }
    addLast = (sym, processed) => {
        var array = processed ? processed : this.state.mathArr.map((e) => { return e })
        array.push(sym)
        return array
    }
    addCursor = (sym, processed) => {
        var array = processed ? processed : this.state.mathArr.map((e) => { return e })
        var cursorindex = array.indexOf('cursor')
        array.splice(cursorindex, 0, sym)
        return array

    }
    deleteAll = () => {
        return ['cursor']
    }
    backspace = () => {
        var array = this.state.mathArr.map(e => e)
        if (array == 1) {
            return
        }
        var cursorindex = array.indexOf('cursor')
        array.splice(cursorindex - 1, 2, 'cursor')
        return array
    }
    update = (array) => {
        console.log(array)
        this.setState({ mathArr: array, ans: "" })
    }
    evaluate = (callback) => {
        var allString = this.state.mathArr.reduce((accum, curr) => {
            return accum += curr
        }, "");
        allString = allString.replace('cursor', "")
        //console.log(allString)
        var answer;
        try{
            answer = MathJS.evaluate(allString, this.state.memory)
        }catch(e){
            answer = "Syntax Error"
        }
        //console.log(answer)
        //console.log(typeof answer)
        this.setState(
            {
                ans: answer.toString(),
                memory: { A: this.state.memory.A, B: this.state.memory.B, C: this.state.memory.C, D: this.state.memory.D, β: this.state.memory.β, α: this.state.memory.α, X: this.state.memory.X, Y: this.state.memory.Y, ans: answer }
            },
            () => { callback?callback(answer):'' })
    }
    render() {
        return (
            <Content style={{ padding: 10 }} scrollEnabled={false} >
                <Grid>
                    <Row></Row>
                    <Display style={{ height: isIphoneX()?(Dimensions.get('window').height - 120) * 0.2:(Dimensions.get('window').height - 64) * 0.2, width: '100%' }} mathArray={this.state.mathArr} ans={this.state.ans} />
                    <FunctionPanel style={{height: isIphoneX()?(Dimensions.get('window').height - 120) * 0.37:(Dimensions.get('window').height - 64) * 0.37, width: '100%',}} addCursor={this.addCursor} addLast={this.addLast} update={this.update} saveto={this.saveto} pushto={this.pushto} delArray={this.delArray} memory={this.state.memory} evalu={this.evaluate} del={this.deleteAll} />
                    <NormalPanel style={{ height: isIphoneX()?(Dimensions.get('window').height - 120) * 0.43:(Dimensions.get('window').height - 64) * 0.43, width: '100%', }} left={this.moveCursorLeft} right={this.moveCursorRight} clr={this.deleteAll} del={this.backspace} addCursor={this.addCursor} addLast={this.addLast} update={this.update} evalu={this.evaluate} />
                </Grid>
            </Content>
        )
    }
}

const inlineStyle = `
html, body {
  display: flex;
  background-color: #fafafa;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 0;
  padding: 0;
}
.katex {
  font-size: 4em;
  margin: 0;
  display: flex;
}
`;

class Display extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mathArray: props.mathArray,
            katexString: "",

            cursor: '',
            isLatex: true,
            fallsback: false
        }
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.state.cursor == '') {
                this.setState({ cursor: '|' })
            } else {
                this.setState({ cursor: '' })
            }
        }, 1000)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }
    static getDerivedStateFromProps(props, state) {
        try {
            var allString = props.mathArray.reduce((accum, curr) => {
                return accum += curr
            }, "");
            var katexString = MathJS.parse(allString).toTex({ parenthesis: 'keep' })
            katexString = katexString.replace('cursor', state.cursor)
            //console.log(katexString)
            return {
                mathArray: props.mathArray,
                katexString: katexString,
                fallsback: false
            }
        } catch (error) {
            console.log(state.katexString)
            return {
                mathArray: props.mathArray,
                katexString: state.katexString,
                fallsback: true
            }
        }

    }
    renderDisplay() {
        if (this.state.isLatex && !this.state.fallsback) {
            return this.renderKatex()
        } else {
            return (
                <Text>
                    {this.renderText()}
                </Text>
            )
        }
    }
    renderKatex() {
        return (
            <Katex
                expression={this.state.katexString}
                style={{ height: '100%', width: '100%' }}
                inlineStyle={inlineStyle}
                displayMode={false}
                throwOnError={false}
                errorColor="#f00"
                macros={{}}
                colorIsTextColor={false}
                onLoad={() => this.setState({ loaded: true })}
                onError={() => console.error('Error')}
            />
        )
    }
    renderText() {
        var text = []
        for (var i = 0; i < this.state.mathArray.length; i++) {
            if (this.state.mathArray[i] == "cursor") {
                text.push(<Cursor key={uuid.v4()} />)
            } else {
                text.push(<Text key={uuid.v4()}>{this.state.mathArray[i]}</Text>)
            }
        }
        return text
    }
    getAnswer() {
        if (this.props.ans == "") {
            return ""
        } else {
            return this.props.ans
        }
    }
    render() {
        return (
            <Row style={this.props.style}>
                <Col>
                    <Row size={2} style={{
                        borderBottomColor: 'grey',
                        borderBottomWidth: 1
                    }}>{/**inputted+cursor */}
                        <Col size={2} style={{ justifyContent: 'center' }}><Text style={{ fontWeight: 'bold' }}>Display form</Text></Col>
                        <Col size={3} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                            <Text style={{ color: 'dimgrey' }}>{this.state.isLatex ? 'LaTeX form' : 'Text form'}</Text>
                        </Col>
                        <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Switch
                                value={this.state.isLatex}
                                onValueChange={() => { this.setState({ isLatex: !this.state.isLatex }) }}
                            />
                        </Col>
                    </Row>
                    <Row size={3} style={{
                        borderBottomColor: 'grey',
                        borderBottomWidth: 1
                    }}>
                        <Col>{/**katex */}
                            {this.renderDisplay()}
                        </Col>
                    </Row>
                    <Row size={2} style={{
                        borderBottomColor: 'grey',
                        borderBottomWidth: 1
                    }}>
                        <Col>{/**ans */}
                            <Text>{this.getAnswer()}</Text>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}
class Cursor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            on: true
        }
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({ on: !this.state.on })
        }, 500)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }
    render() {
        return (
            <Text style={{ fontFamily: 'Menlo-Regular' }}>{this.state.on ? "|" : " "}</Text>
        )
    }
}
class FunctionPanel extends React.Component {
    constructor(props) {
        super(props)
        const { addCursor, addLast, update, saveto, pushto, delArray, evalu, del } = props;
        this.state = {
            memory: props.memory,
            cards: [
                {
                    title: 'Basic',
                    row1: [{ fnc: () => { update(addLast(")", addCursor("(", addCursor("factorial")))) }, text: 'uni21' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("abs")))) }, text: 'abs(v)' },{ fnc: () => { update(addLast(")",addLast(",", addCursor("(", addCursor("mod"))))) }, text: 'mod(v)' },{ fnc: () => { update(addLast(")", addCursor("(", addCursor("cbrt")))) }, text: '∛' },{ fnc: () => { update(addLast(")",addLast(",", addCursor("(", addCursor("gcd"))))) }, text: 'gcd(v)' },{ fnc: () => { update(addCursor(",")) }, text: 'uni2C' },],
                    row2: [{ fnc: () => { update(addLast(")", addLast(",", addCursor("(", addCursor("combinations"))))) }, text: 'C(n,k)' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("exp")))) }, text: 'exp(v)' },{ fnc: () => { update(addLast(")", addCursor("(", addCursor("log10")))) }, text: 'log10(v)' },{ fnc: () => { update(addLast(")",addLast(",", addCursor("(", addCursor("nthRoot"))))) }, text: '∗√' },{ fnc: () => { update(addLast(")",addLast(",", addCursor("(", addCursor("lcm"))))) }, text: 'lcm(v)' },],
                    row3: [{ fnc: () => { update(addLast(")", addLast(",", addCursor("(", addCursor("permutations"))))) }, text: 'P(n,k)' }, { fnc: () => { update(addLast(")", addLast("e", addLast(",", addCursor("(", addCursor("log")))))) }, text: 'ln(v)' },{ fnc: () => { update(addLast(")", addCursor("(", addCursor("log2")))) }, text: 'log2(v)' },{ fnc: () => { update(addLast(")", addLast(",", addCursor("(", addCursor("log"))))) }, text: 'log(v,b)' },{ fnc: () => { update(addLast(")",addLast(",", addCursor("(", addCursor("hypot"))))) }, text: 'hypot(v)' },],
                    id: 0
                },
                {
                    title: 'Trigonometry 1',
                    row1: [{ fnc: () => { update(addLast(")", addCursor("(", addCursor("sin")))) }, text: 'sin()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("cos")))) }, text: 'cos()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("tan")))) }, text: 'tan()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("asin")))) }, text: 'sin⁻¹()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("acos")))) }, text: 'cos⁻¹()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("atan")))) }, text: 'tan⁻¹()' }],
                    row2: [{ fnc: () => { update(addLast(")", addCursor("(", addCursor("csc")))) }, text: 'csc()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("sec")))) }, text: 'sec()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("cot")))) }, text: 'cot()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("acsc")))) }, text: 'csc⁻¹()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("asec")))) }, text: 'sec⁻¹()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("acot")))) }, text: 'cot⁻¹()' }],
                    row3: [],
                    id: 1
                },
                {
                    title: 'Trigonometry 2',
                    row1: [{ fnc: () => { update(addLast(")", addCursor("(", addCursor("sinh")))) }, text: 'sinh()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("cosh")))) }, text: 'cosh()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("tanh")))) }, text: 'tanh()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("asinh")))) }, text: 'sinh⁻¹()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("acosh")))) }, text: 'cos⁻¹()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("atanh")))) }, text: 'tan⁻¹()' }],
                    row2: [{ fnc: () => { update(addLast(")", addCursor("(", addCursor("csch")))) }, text: 'csch()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("sech")))) }, text: 'sech()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("coth")))) }, text: 'coth()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("acsch")))) }, text: 'csch⁻¹()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("asech")))) }, text: 'sec⁻¹()' }, { fnc: () => { update(addLast(")", addCursor("(", addCursor("acoth")))) }, text: 'cot⁻¹()' }],
                    row3: [],
                    id: 2
                },
                {
                    title: 'Statistic',
                    row1: [{ fnc: () => { update(addLast(")", addCursor("(", addCursor("mad")))) }, text: 'mad()' },{ fnc: () => { update(addLast(")", addCursor("(", addCursor("mean")))) }, text: 'mean()' },{ fnc: () => { update(addLast(")", addCursor("(", addCursor("std")))) }, text: 'std()' },{ fnc: () => { update(addLast(")", addCursor("(", addCursor("sum")))) }, text: 'uni2211' },{ fnc: () => { update(addLast(")", addCursor("(", addCursor("gamma")))) }, text: 'γ()' }],
                    row2: [{ fnc: () => { update(addLast(")", addCursor("(", addCursor("max")))) }, text: 'max()' },{ fnc: () => { update(addLast(")", addCursor("(", addCursor("mad")))) }, text: 'mode()' },{ fnc: () => { update(addLast(")", addCursor("(", addCursor("variance")))) }, text: 'variance()' },{ fnc: () => { update(addLast(")", addCursor("(", addCursor("prod")))) }, text: 'uni220F' },{ fnc: () => { update(addLast(")",addLast(",", addCursor("(", addCursor("kldivergence"))))) }, text: 'KL()' }],
                    row3: [{ fnc: () => { update(addLast(")", addCursor("(", addCursor("min")))) }, text: 'min()' },{ fnc: () => { update(addLast(")", addCursor("(", addCursor("mad")))) }, text: 'median()' },],
                    id: 3
                },
                {
                    title: 'Constant',
                    row1: [{ fnc: () => { update(addCursor("e")) }, text: 'e' },{ fnc: () => { update(addCursor("i")) }, text: 'i' },{ fnc: () => { update(addCursor("phi")) }, text: 'uni3A6' },{ fnc: () => { update(addCursor("pi")) }, text: 'uni3C0' },],
                    row2: [],
                    row3: [],
                    id: 4
                },
                {
                    //{ A: 0, B: 0, C: 0, D: 0, X: 0, Y: 0, ans: 0, α:[], β:[]}
                    title: 'Memory',
                    row1: [{ fnc: () => { update(addCursor("A")) }, text: 'A' }, { fnc: () => { evalu((ans) => {saveto('A', ans);update(del())}) }, text: '->A' }, { fnc: () => { update(addCursor("D")) }, text: 'D' }, { fnc: () => { evalu((ans) => {saveto('D', ans);update(del())}) }, text: '->D' }, { fnc: () => { update(addCursor("α")) }, text: 'α' }, { fnc: () => { update(addCursor("β")) }, text: 'β' }],
                    row2: [{ fnc: () => { update(addCursor("B")) }, text: 'B' }, { fnc: () => { evalu((ans) => {saveto('B', ans);update(del())}) }, text: '->B' }, { fnc: () => { update(addCursor("X")) }, text: 'X' }, { fnc: () => { evalu((ans) => {saveto('X', ans);update(del())}) }, text: '->X' }, { fnc: () => { evalu((ans) => {pushto("α", ans);update(del())}) }, text: 'α+' }, { fnc: () => { evalu((ans) =>{pushto("β", ans);update(del())}) }, text: 'β+' }],
                    row3: [{ fnc: () => { update(addCursor("C")) }, text: 'C' }, { fnc: () => { evalu((ans) => {saveto('C', ans);update(del())}) }, text: '->C' }, { fnc: () => { update(addCursor("Y")) }, text: 'Y' }, { fnc: () => { evalu((ans) => {saveto('Y', ans);update(del())}) }, text: '->Y' }, { fnc: () => { delArray("α") }, text: 'del(α)' }, { fnc: () => { delArray("β") }, text: 'del(β)' }],
                    id: 5
                },
            ]
        }
    }
    static getDerivedStateFromProps(props, state) {

        console.log(props.memory)
        return { memory: props.memory }


    }
    renderButton(item, j) {
        var haha = item[j]
        if (haha == undefined) {
            return (<Col><Button transparent></Button></Col>)
        } else {
            if (haha.text.split('uni').length == 1) {
                return (<Col><TouchableOpacity onPress={haha.fnc} style={{
                    alignItems: 'center', borderRadius: 35, minHeight: 45, justifyContent: 'center', backgroundColor: "#f4f4f4", shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5, margin: 1
                }}><Text style={{ fontSize: 10 }}>{haha.text}</Text></TouchableOpacity></Col>)
            }
            return (<Col><Button light onPress={haha.fnc} style={{
                justifyContent: 'center', borderRadius: 35, height: 45, maxHeight: 45, shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5, margin: 1
            }}><MathIcon name={haha.text} size={20} ></MathIcon></Button></Col>)
        }
    }
    renderPages(j) {
        var pages = []
        pages.push(<Col key={uuid.v4()} size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity small onPress={() => { this._DeckSwiper._root.swipeRight() }} style={{ alignItems: 'center', justifyContent: 'center' }}><Icon type='Ionicons' name='ios-arrow-back' /></TouchableOpacity>
        </Col>)
        for (var i = 0; i < this.state.cards.length; i++) {
            if (i == j) {
                pages.push(
                    <Col key={uuid.v4()} size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,.8)' }}></View>
                    </Col>
                )
            } else {
                pages.push(
                    <Col key={uuid.v4()} size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,.2)' }}></View>
                    </Col>)
            }
        }
        pages.push(<Col key={uuid.v4()} size={1} style={{ justifyContent: 'center', alignItems: 'center' }} >
            <TouchableOpacity small onPress={() => { this._DeckSwiper._root.swipeLeft() }} style={{ alignItems: 'center', justifyContent: 'center' }}><Icon type='Ionicons' name='ios-arrow-forward' /></TouchableOpacity>
        </Col>)
        return (<Grid style={{ width: '100%', height: '100%' }}><Row style={{ width: '100%', height: '100%' }}>{pages}</Row></Grid>)
    }
    render() {
        return (
            <Row style={this.props.style}>
                <DeckSwiper
                    ref={(c) => this._DeckSwiper = c}
                    looping={false}
                    style={{ width: '100%', height: '100%' }}
                    dataSource={this.state.cards}
                    renderItem={item => <Card style={{
                        width: Dimensions.get('window').width - 20, shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 5,
                    }}>
                        <CardItem>
                            <Left>
                                <Title>{item.title}</Title>
                            </Left>
                            <Body>
                                {this.renderPages(item.id)}
                            </Body>
                        </CardItem>
                        <Divider />
                        <CardItem>
                            <Grid>
                                <Row>
                                    {this.renderButton(item.row1, 0)}
                                    {this.renderButton(item.row1, 1)}
                                    {this.renderButton(item.row1, 2)}
                                    {this.renderButton(item.row1, 3)}
                                    {this.renderButton(item.row1, 4)}
                                    {this.renderButton(item.row1, 5)}
                                </Row>
                                <Row>
                                    {this.renderButton(item.row2, 0)}
                                    {this.renderButton(item.row2, 1)}
                                    {this.renderButton(item.row2, 2)}
                                    {this.renderButton(item.row2, 3)}
                                    {this.renderButton(item.row2, 4)}
                                    {this.renderButton(item.row2, 5)}
                                </Row>
                                <Row>
                                    {this.renderButton(item.row3, 0)}
                                    {this.renderButton(item.row3, 1)}
                                    {this.renderButton(item.row3, 2)}
                                    {this.renderButton(item.row3, 3)}
                                    {this.renderButton(item.row3, 4)}
                                    {this.renderButton(item.row3, 5)}
                                </Row>
                            </Grid>
                        </CardItem>
                    </Card>}
                />
            </Row>
        )
    }
}
class NormalPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    //<NormalPanel left={this.moveCursorLeft} right={this.moveCursorRight} clr={this.deleteAll} del={this.backspace} addCursor={this.addCursor} addLast={this.addLast} update={this.update}/>
    render() {
        const { left, right, clr, del, addCursor, addLast, update, evalu } = this.props;
        return (
            <Row style={this.props.style}>
                <Col>
                    <Row>
                        <Col>
                            <Button onPress={() => { update(addCursor("(")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"("}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor(")")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{")"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(left()) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Icon type='SimpleLineIcons' name='arrow-left' /></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(right()) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Icon type='SimpleLineIcons' name='arrow-right' /></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(del()) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} danger><Text>{"DEL"}</Text></Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onPress={() => { update(addCursor("7")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"7"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("8")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"8"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("9")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"9"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("*")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"×"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("/")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"÷"}</Text></Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onPress={() => { update(addCursor("4")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"4"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("5")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"5"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("6")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"6"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("+")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"+"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("-")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"-"}</Text></Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onPress={() => { update(addCursor("1")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"1"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("2")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"2"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("3")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"3"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("^")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"^"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addLast(")", addCursor("sqrt("))) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"√"}</Text></Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onPress={() => { update(addCursor("0")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"0"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor(".")) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"."}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor('ans')) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} light><Text>{"ans"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { evalu() }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} primary><Text>{"="}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(clr()) }} style={{
                                justifyContent: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5, margin: 2
                            }} danger><Text>{"CLR"}</Text></Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}
import Markdown from 'react-native-easy-markdown';
class GraphPlotter extends React.Component {
    render() {
        return (
            <Content style={{ padding: 10 }}>
                <Body>
                    <Card>
                        <CardItem>
                            <Left>
                                <Title>Graph Plotter</Title>
                            </Left>
                            <Body>
                                <Text note>Coming Soon</Text>
                            </Body>
                        </CardItem>
                        <Divider/>
                        <CardItem>
                            <Markdown>
                                {
                                    '## Reason of halt development\n\n'+
                                    'I am getting tired when coming to develop this app, I shall spend some time in research, gaming and also family and friends, yet my research require some function of this app very bad. so the development will stop here for a while\n\n'+
                                    '## Graph plotter plan\n\n'+
                                    '1. plot from math function\n'+
                                    '2. plot data set\n'+
                                    '3. support bar chart pie chart line chart scatter chart\n'+
                                    '4. regression support\n'+
                                    '5. export to csv and save chart to camera\n\n'+
                                    '### target\n\n'+
                                    'A MORE POWERFUL AND EASY TO USE GRAPH TOOL THAN EXCEL'
                                }
                            </Markdown>
                        </CardItem>
                    </Card>
                </Body>
            </Content>
        )
    }
}
/**
 * @deprecated
 */
class CalculatorView extends React.Component {
    //html = require("./index.html");
    constructor(props) {
        super(props)
        console.log("loaded")
    }

    render() {
        return (
            <WebView
                //source={{uri:'https://stackoverflow.com/questions/35451139/react-native-webview-not-loading-any-url-react-native-web-view-not-working'}}
                style={{ flex: 1, height: Dimensions.get('window').height * 0.9, width: Dimensions.get('window').width }}
                source={this.html}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}

            />
        )
    }
}