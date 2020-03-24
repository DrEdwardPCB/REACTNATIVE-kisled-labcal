import Drawer from 'react-native-drawer'
import React from 'react'
import { Header, Left, Right, Container, Icon, Button, Text, Title, Content, Footer, Body, Item, Grid, Row, Col, DeckSwiper, Card, CardItem } from 'native-base'
import ControlPanel from '../../utils/ControlPanel'
import LABCAL from '../../utils/Labcal'
import { AsyncStorage, Dimensions } from 'react-native'
import { WebView } from 'react-native-webview';
import uuid from "react-native-uuid";


export default class ScientificCalculator extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            navigation: props.navigation,
            currentPage: LABCAL.calculatorpage,
            currentApp: LABCAL.SCIENTIFICCALCULATORSCREENdn
        }

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
            memory: { A: '', B: '', C: '', D: '', E: '', F: '', X: '', Y: '', M: '' }
        }
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
        this.setState({ mathArr: array })
    }
    render() {
        return (
            <Content style={{ padding: 10 }} scrollEnabled={false} >
                <Grid>
                    <Row></Row>
                    <Display style={{ height: (Dimensions.get('window').height - 64) * 0.2, width: '100%' }} mathArray={this.state.mathArr} />
                    <FunctionPanel style={{ height: (Dimensions.get('window').height - 64) * 0.35, width: '100%' }} />
                    <NormalPanel style={{ height: (Dimensions.get('window').height - 64) * 0.45, width: '100%' }} left={this.moveCursorLeft} right={this.moveCursorRight} clr={this.deleteAll} del={this.backspace} addCursor={this.addCursor} addLast={this.addLast} update={this.update} />
                </Grid>
            </Content>
        )
    }
}
class Display extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mathArray: props.mathArray,
            mathString: "",
            ans: "",
        }
    }
    static getDerivedStateFromProps(props, state) {
        console.log(props.mathArray)
        return { mathArray: props.mathArray }
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
    render() {
        return (
            <Row style={this.props.style}>
                <Col>
                    <Row size={2} style={{
                        borderBottomColor: 'grey',
                        borderBottomWidth: 1
                    }}>{/**inputted+cursor */}
                        <Col>
                            <Text>
                                {this.renderText()}
                            </Text>
                        </Col>
                    </Row>
                    <Row size={3} style={{
                        borderBottomColor: 'grey',
                        borderBottomWidth: 1
                    }}>
                        <Col>{/**katex */}

                        </Col>
                    </Row>
                    <Row size={2} style={{
                        borderBottomColor: 'grey',
                        borderBottomWidth: 1
                    }}>
                        <Col>{/**ans */}

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
        this.state = {
            cards: [
                {
                    title: 'fnc1',
                    row1: [],
                    row2: [],
                    row3: [],
                    id: 1
                },
                {
                    title: 'fnc2',
                    row1: [],
                    row2: [],
                    row3: [],
                    id: 2
                },
                {
                    title: 'fnc3',
                    row1: [],
                    row2: [],
                    row3: [],
                    id: 3
                },
            ]
        }
    }
    renderButton(item, j) {
        var haha = item[j]
        if (haha == undefined) {
            return (<Col></Col>)
        } else {
            return (<Col><Button light onPress={haha.fnc}><Text>{item.haha.text}</Text></Button></Col>)
        }
    }
    render() {
        return (
            <Row style={this.props.style}>
                <DeckSwiper
                    style={{ width: '100%', height: '100%' }}
                    dataSource={this.state.cards}
                    renderItem={item => <Card style={{ width: Dimensions.get('window').width-20 }}>
                        <CardItem>
                            <Left>
                                <Title>{item.title}</Title>
                            </Left>
                            <Body>
                                <Text>{item.id}</Text>
                            </Body>
                        </CardItem>
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
        const { left, right, clr, del, addCursor, addLast, update } = this.props;
        return (
            <Row style={this.props.style}>
                <Col>
                    <Row>
                        <Col>
                            <Button onPress={() => { update(addCursor("(")) }} light><Text>{"("}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor(")")) }} light><Text>{")"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(left()) }} light><Icon type='SimpleLineIcons' name='arrow-left' /></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(right()) }} light><Icon type='SimpleLineIcons' name='arrow-right' /></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(del()) }} danger><Text>{"DEL"}</Text></Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onPress={() => { update(addCursor("7")) }} light><Text>{"7"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("8")) }} light><Text>{"8"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("9")) }} light><Text>{"9"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("*")) }} light><Text>{"×"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("/")) }} light><Text>{"÷"}</Text></Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onPress={() => { update(addCursor("4")) }} light><Text>{"4"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("5")) }} light><Text>{"5"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("6")) }} light><Text>{"6"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("+")) }} light><Text>{"+"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("-")) }} light><Text>{"-"}</Text></Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onPress={() => { update(addCursor("7")) }} light><Text>{"1"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("8")) }} light><Text>{"2"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("9")) }} light><Text>{"3"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("*")) }} light><Text>{"^"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addLast(")", addCursor("sqrt("))) }} light><Text>{"√"}</Text></Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onPress={() => { update(addCursor("0")) }} light><Text>{"0"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor(".")) }} light><Text>{"."}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("ans")) }} light><Text>{"ans"}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(addCursor("=")) }} primary><Text>{"="}</Text></Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { update(clr()) }} danger><Text>{"CLR"}</Text></Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}
class GraphPlotter extends React.Component {
    render() {
        return (
            <Content style={{ padding: 10 }}>
                <Text>Graph plotter</Text>
            </Content>
        )
    }
}
/**
 * @deprecated
 */
class CalculatorView extends React.Component {
    html = require("./index.html");
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