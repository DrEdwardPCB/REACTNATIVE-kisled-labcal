import Drawer from 'react-native-drawer'
import React from 'react'
import { Header, Left, Right, Container, Icon, Button, Text, Title, Content, Footer, Body, Grid, Row, Col, Picker, Form, Item, Input, Label, Textarea } from 'native-base'
import ControlPanel from '../../utils/ControlPanel'
import LABCAL from '../../utils/Labcal'
import { AsyncStorage, ScrollView, View, Dimensions } from 'react-native'
import CustomSearchBar from '../../utils/SearchBar'
import Modal, { ModalContent, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals'
import SolutionsManager from '../../utils/SolutionsManager'
import { Switch, Divider } from 'react-native-paper'
import uuid from 'react-native-uuid'


export default class Solutions extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            navigation: props.navigation,
            currentPage: LABCAL.solutionpage,
            currentApp: LABCAL.SOLUTIONSSCREENdn
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
        if (this.state.currentPage === LABCAL.solutionpage) {
            return (<SolutionsMix></SolutionsMix>)
        } else if (this.state.currentPage === LABCAL.chemicaleditorpage) {
            return (<ChemicalEditor></ChemicalEditor>)
        } else if (this.state.currentPage === LABCAL.solutioneditorpage) {
            return (<SolutionEditor></SolutionEditor>)
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
                    <Body>
                        <Title>{this.state.currentPage}</Title>
                    </Body>
                    <Right></Right>
                </Header>
                {this.renderPages()}
                {

/*
                    <Footer>
                        <Button
                            full
                            onPress={() => {
                                AsyncStorage.clear(() => { console.log('clear success') })
                            }}><Text>clear</Text></Button>
                    </Footer>
                        */}
            </Container>
        )

    }
}



class SolutionsMix extends React.Component {
    render() {
        return (
            <Content style={{ padding: 10 }} scrollEnabled={false}>
                <Grid>
                    <Row>{/**selector */}

                    </Row>
                    <Row>{/**image */}

                    </Row>
                    <Row>{/**control panel */}

                    </Row>
                    <Row>{/**recipe */}

                    </Row>
                </Grid>
            </Content>
        )
    }
}
class ChemicalEditor extends React.Component {
    constructor() {
        super()
        this.state = {
            //currentChemical: null,
            searchData: SolutionsManager.getInstance().getChemicalList(),
            editable: false,
            chemicalIsSolute: false,
            chemicalid: uuid.v4(),
            chemicalName: '',
            chemicalMolarMass: '0',
            molarMassUnit: 'g/mol',
            chemicalRemarks: '',

        }
    }
    handleDisplayValue = () => {
        var temparr = []
        this.state.chemicalMolarMass.split(".").forEach((v) => { if (v == "") { temparr.push("x") } else { temparr.push(v) } })
        var isfloat = temparr.filter((v) => { return isNaN(v) == true }).length == 0
        var tempNum = parseFloat(this.state.chemicalMolarMass)
        console.log(temparr)
        console.log(isfloat)
        var tempNum = parseFloat(this.state.chemicalMolarMass)
        if (this.state.molarMassUnit === "g/mol" || this.state.molarMassUnit === "Da") {
            console.log("noneed")
            var tempNum = parseFloat(this.state.chemicalMolarMass);
            console.log(typeof (tempNum))
            console.log(tempNum)
            if (!isfloat) {
                return this.state.chemicalMolarMass
            } else {
                try {
                    if (tempNum.toString().split('.')[1].length > 4) {
                        return tempNum.toFixed(4).toString()
                    }
                } catch{

                }
                return tempNum.toString()
            }
        } else {
            //var tempNum = parseFloat(this.state.chemicalMolarMass);
            console.log("need / 1000")
            if (!isfloat) {
                return this.state.chemicalMolarMass
            } else {
                try {
                    if ((tempNum / 1000).toString().split('.')[1].length > 4) {
                        return (tempNum / 1000).toFixed(4).toString()
                    }
                } catch{

                }
                return (tempNum / 1000).toString()
            }
        }
    }
    render() {
        return (
            <Content style={{ padding: 10, paddingBottom: 0 }} scrollEnabled={false}>
                <Grid style={{ minHeight: '100%' }}>
                    <Row size={1} style={{ paddingBottom: 10, zIndex: 9999, maxHeight: 67 }}>{/** */}
                        <Col>
                            <CustomSearchBar labelText='Chemical'
                                displayData={this.state.searchData}
                                onSelected={(id, name) => {
                                    console.log(id)
                                    var chemical = SolutionsManager.getInstance().getChemical(id.toString())
                                    this.setState({ 
                                        currentChemical: chemical,
                                        chemicalid: chemical.id,
                                        chemicalName: chemical.name,
                                        chemicalMolarMass: chemical.molarmass.toString(),
                                        molarMassUnit: 'g/mol',
                                        chemicalRemarks: chemical.remarks,
                                        chemicalIsSolute: chemical.solute
                                    }, () => {
                                        console.log(this.state.currentChemical)
                                    })

                                }}
                                onClear={() => {
                                    console.log("clearing")
                                    this.setState({
                                        currentChemical: null,
                                        chemicalid: uuid.v4(),
                                        chemicalName: '',
                                        chemicalMolarMass: '0',
                                        molarMassUnit: 'g/mol',
                                        chemicalRemarks: '',
                                    })
                                }}
                            />

                        </Col>
                    </Row>
                    <Row size={1}>{/**selection */}
                        <Col>
                            <Button danger style={{ width: '100%', zIndex: 1 }}>
                                <Text>Remove Chemical</Text>
                            </Button>
                        </Col>
                        <Col>
                            <Button 
                            style={{ width: '100%', zIndex: -1 }}
                                onPress={() => {
                                    this.setState({ visible: true })
                                }}
                            >
                                <Text>{this.state.currentChemical==null?"Add Chemical":"Save edited Chemical"}</Text>
                            </Button>
                        </Col>
                    </Row>
                    <Row size={18} >{/**display details */}
                        <Col>{/**edit lock */}
                            <Row size={1} style={{ minHeight: Dimensions.get('window').height * 0.07 }}>
                                <Col size={3} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <Text style={{ color: this.state.editable ? '#dc3545' : '#6c757d' }}>{this.state.editable ? "Edit enabled" : "Edit disabled"}</Text>
                                </Col>
                                <Col size={1} style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Switch
                                        value={this.state.editable}
                                        onValueChange={() => { this.setState({ editable: !this.state.editable }) }}
                                        color='#007bff'
                                    ></Switch>
                                </Col>
                            </Row>
                            <Row size={4} style={{ minHeight: Dimensions.get('window').height * 0.3 }}>
                                <Col style={{ alignItems: 'center' }}>
                                    <Form>
                                        <Item style={{ height: '100%', aspectRatio: 1 }} regular>
                                            <Grid>
                                                <Row size={1}>
                                                    <Col style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Label>molar mass</Label>
                                                    </Col>
                                                    <Col style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Picker
                                                            mode="dropdown"
                                                            style={{ width: undefined }}
                                                            selectedValue={this.state.molarMassUnit}
                                                            onValueChange={(val) => { this.setState({ molarMassUnit: val }) }}
                                                        >
                                                            <Picker.Item label="g/mol" value="g/mol"></Picker.Item>
                                                            <Picker.Item label="kg/mol" value="kg/mol"></Picker.Item>
                                                            <Picker.Item label="Da" value="Da"></Picker.Item>
                                                            <Picker.Item label="kDa" value="kDa"></Picker.Item>
                                                        </Picker>
                                                    </Col>
                                                </Row>
                                                <Row size={4}>
                                                    <Col style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Input
                                                            editable={this.state.editable}
                                                            value={this.handleDisplayValue()}
                                                            onBlur={() => {
                                                                //console.log("onblur")
                                                                if (isNaN(this.state.chemicalMolarMass)) {
                                                                    this.setState({ chemicalMolarMass: "0" })
                                                                    //console.log('resetted')
                                                                }
                                                            }}
                                                            onChangeText={(val) => {
                                                                var temparr = []
                                                                val.split(".").forEach((v) => { if (v == "") { temparr.push("x") } else { temparr.push(v) } })
                                                                var isfloat = temparr.filter((v) => { return isNaN(v) == true }).length == 0
                                                                var tempNum = parseFloat(val)
                                                                //console.log(temparr)
                                                                //console.log(isfloat)
                                                                if (this.state.molarMassUnit === "g/mol" || this.state.molarMassUnit === "Da") {
                                                                    if (!isfloat) {
                                                                        //console.log('wrong')
                                                                        this.setState({ chemicalMolarMass: val })
                                                                    } else {
                                                                        //console.log('correct')
                                                                        this.setState({ chemicalMolarMass: tempNum.toString() })
                                                                    }
                                                                } else {
                                                                    if (!isfloat) {
                                                                        this.setState({ chemicalMolarMass: val })
                                                                    } else {
                                                                        this.setState({ chemicalMolarMass: (tempNum * 1000).toString() })
                                                                    }
                                                                }

                                                            }}
                                                            style={{ textAlign: 'center', height: '90%', fontSize: 48 }}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Grid>
                                        </Item>
                                    </Form>
                                </Col>
                            </Row>
                            <Divider style={{ marginVertical: 5 }} />
                            <Row size={4}>
                                <Col>
                                    <View style={{ height: '100%', width: '100%' }}>
                                        <ScrollView
                                            //style={{height:Dimensions.get('window').height*0.4}}
                                            //contentContainerStyle={{ width: '100%', height: Dimensions.get('window').height * 0.4 }}
                                            contentInset={{ bottom: 100 }}
                                        >
                                            <Form>
                                                <Item style={{ padding: 10 }} fixedLabel>
                                                    <Label>name</Label>
                                                    <Input
                                                        editable={this.state.editable}
                                                        value={this.state.chemicalName}
                                                        onChangeText={(val) => { this.setState({ chemicalName: val }) }}
                                                    />
                                                </Item>
                                                <Item style={{ padding: 10 }}>
                                                    <Grid>
                                                        <Row>
                                                            <Col size={3} style={{ alignItems: 'flex-start', alignContent: 'center', justifyContent: 'center' }}>
                                                                <Label>{this.state.chemicalIsSolute ? "is solute" : "is solvent"}</Label>
                                                            </Col>
                                                            <Col size={1} style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                                <Switch
                                                                    disabled={!this.state.editable}
                                                                    value={this.state.chemicalIsSolute}
                                                                    onValueChange={() => { this.setState({ chemicalIsSolute: !this.state.chemicalIsSolute }) }}
                                                                    color='#007bff'
                                                                ></Switch>
                                                            </Col>
                                                        </Row>
                                                    </Grid>
                                                </Item>
                                                <Item style={{ padding: 10 }} stackedLabel>
                                                    <Label>Remarks</Label>
                                                    <Textarea
                                                        editable={this.state.editable}
                                                        rowSpan={5}
                                                        bordered
                                                        style={{ width: '100%' }}
                                                        value={this.state.chemicalRemarks}
                                                        onChangeText={(val) => { this.setState({ chemicalRemarks: val }) }}
                                                    />
                                                </Item>
                                            </Form>
                                        </ScrollView>
                                    </View>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>
            </Content >
        )
    }
}
class SolutionEditor extends React.Component {
    render() {
        return (
            <Content style={{ padding: 10 }} scrollEnabled={false}>
                <Grid>
                    <Row>{/**selector */}

                    </Row>
                    <Row>{/**image */}

                    </Row>
                    <Row>{/**control panel */}

                    </Row>
                    <Row>{/**recipe */}

                    </Row>
                </Grid>
            </Content>
        )
    }
}
