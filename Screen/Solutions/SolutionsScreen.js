import Drawer from 'react-native-drawer'
import React from 'react'
import { Header, Left, Right, Container, Icon, Button, Text, Title, Content, Footer, Body, Grid, Row, Col, Picker, Form, Item, Input, Label, Textarea, Card, CardItem } from 'native-base'
import ControlPanel from '../../utils/ControlPanel'
import LABCAL from '../../utils/Labcal'
import { AsyncStorage, ScrollView, View, Dimensions, Alert, SafeAreaView } from 'react-native'
import CustomSearchBar from '../../utils/SearchBar'
import Modal, { ModalContent, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals'
import SolutionsManager from '../../utils/SolutionsManager'
import { Switch, Divider, DataTable } from 'react-native-paper'
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
            chemicalIsSolute: true,
            chemicalid: uuid.v4(),
            chemicalName: '',
            chemicalMolarMass: '0',
            molarMassUnit: 'g/mol',
            chemicalRemarks: '',
            chemicalDissocationMultiplier: '1',
            chemicalSolutionDensity: 'n/a'

        }

    }
    handleDisplayValue = () => {
        var temparr = []
        this.state.chemicalMolarMass.split(".").forEach((v) => { if (v == "") { temparr.push("x") } else { temparr.push(v) } })
        var isfloat = temparr.filter((v) => { return isNaN(v) == true }).length == 0
        var tempNum = parseFloat(this.state.chemicalMolarMass)
        //console.log(temparr)
        //console.log(isfloat)
        var tempNum = parseFloat(this.state.chemicalMolarMass)
        if (this.state.molarMassUnit === "g/mol" || this.state.molarMassUnit === "Da") {
            //console.log("noneed")
            var tempNum = parseFloat(this.state.chemicalMolarMass);
            //console.log(typeof (tempNum))
            //console.log(tempNum)
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
            //console.log("need / 1000")
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
                                ref={component => this.mySearchBar = component}
                                displayData={this.state.searchData}
                                onSelected={(id, name) => {
                                    //console.log(id)
                                    var chemical = SolutionsManager.getInstance().getChemical(id.toString())
                                    this.setState({
                                        currentChemical: chemical,
                                        chemicalid: chemical.id,
                                        chemicalName: chemical.name,
                                        chemicalMolarMass: chemical.molarmass.toString(),
                                        molarMassUnit: 'g/mol',
                                        chemicalSolutionDensity: chemical.solutionDensity,
                                        chemicalRemarks: chemical.remarks,
                                        chemicalIsSolute: chemical.solute,
                                        chemicalDissocationMultiplier: chemical.dissociationMultiplier.toString()
                                    }, () => {
                                        //console.log(this.state.currentChemical)
                                    })

                                }}
                                onClear={() => {
                                    //console.log("clearing")
                                    this.setState({
                                        currentChemical: null,
                                        chemicalid: uuid.v4(),
                                        chemicalName: '',
                                        chemicalMolarMass: '0',
                                        molarMassUnit: 'g/mol',
                                        chemicalRemarks: '',
                                        chemicalSolutionDensity: 'n/a',
                                        chemicalDissocationMultiplier: '1'
                                    })
                                }}
                            />

                        </Col>
                    </Row>
                    <Row size={1}>{/**selection */}
                        <Col>
                            <Button
                                danger
                                style={{ width: '100%', zIndex: 1 }}
                                onPress={() => {
                                    Alert.alert(
                                        'Confirm delete',
                                        'confirm delete the selected chemical',
                                        [
                                            {
                                                text: 'Yes', onPress: async () => {
                                                    var success = await SolutionsManager.getInstance().deleteChemical(this.state.chemicalid)
                                                    if (success) {

                                                        this.setState({
                                                            searchData: SolutionsManager.getInstance().getChemicalList(),
                                                            currentChemical: null,
                                                            chemicalid: uuid.v4(),
                                                            chemicalName: '',
                                                            chemicalMolarMass: '0',
                                                            molarMassUnit: 'g/mol',
                                                            chemicalRemarks: '',
                                                            chemicalSolutionDensity: 'n/a',
                                                            chemicalDissocationMultiplier: '1'

                                                        })
                                                        this.mySearchBar.clearText()
                                                        alert('operation success')
                                                    } else {
                                                        alert("operation failed")
                                                    }

                                                }
                                            },
                                            { text: 'No', onPress: () => console.log('No button clicked'), style: 'cancel' },
                                        ],
                                        {
                                            cancelable: true
                                        }
                                    )
                                }}
                            >
                                <Text>Remove Chemical</Text>
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                style={{ width: '100%', zIndex: -1 }}
                                onPress={async () => {
                                    if (this.state.currentChemical == null) {
                                        var status = await SolutionsManager.getInstance().addNewChemical({
                                            solute: this.state.chemicalIsSolute,
                                            id: this.state.chemicalid,
                                            solutionDensity: this.state.chemicalSolutionDensity,
                                            name: this.state.chemicalName,
                                            molarmass: this.state.chemicalMolarMass,
                                            dissociationMultiplier: this.state.chemicalDissocationMultiplier,
                                            remarks: this.state.chemicalRemarks,
                                        })
                                        if (status) {

                                            this.setState({
                                                searchData: SolutionsManager.getInstance().getChemicalList(),
                                                currentChemical: null,
                                                chemicalid: uuid.v4(),
                                                chemicalName: '',
                                                chemicalMolarMass: '0',
                                                molarMassUnit: 'g/mol',
                                                chemicalRemarks: '',
                                                chemicalSolutionDensity: 'n/a',
                                                chemicalDissocationMultiplier: '1'
                                            })
                                            this.mySearchBar.clearText()
                                            alert('operation success')
                                        } else {
                                            alert('operation failed')
                                        }
                                    } else {
                                        var status = await SolutionsManager.getInstance().editChemical({
                                            solute: this.state.chemicalIsSolute,
                                            id: this.state.chemicalid,
                                            solutionDensity: this.state.chemicalSolutionDensity,
                                            name: this.state.chemicalName,
                                            molarmass: this.state.chemicalMolarMass,
                                            dissociationMultiplier: this.state.chemicalDissocationMultiplier,
                                            remarks: this.state.chemicalRemarks,
                                        })
                                        if (status) {
                                            this.setState({
                                                searchData: SolutionsManager.getInstance().getChemicalList(),
                                                currentChemical: null,
                                                chemicalid: uuid.v4(),
                                                chemicalName: '',
                                                chemicalMolarMass: '0',
                                                molarMassUnit: 'g/mol',
                                                chemicalRemarks: '',
                                                chemicalSolutionDensity: 'n/a',
                                                chemicalDissocationMultiplier: '1'
                                            })
                                            this.mySearchBar.clearText()
                                            alert('operation success')
                                        } else {
                                            alert('operation failed')
                                        }
                                    }
                                }}
                            >
                                <Text>{this.state.currentChemical == null ? "Add Chemical" : "Save edited Chemical"}</Text>
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
                                            contentInset={{ bottom: 250 }}
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
                                                <Item style={{ padding: 10 }} fixedLabel>
                                                    <Label>Dissociation Multiplier</Label>
                                                    <Input
                                                        editable={this.state.editable}
                                                        value={this.state.chemicalDissocationMultiplier}
                                                        onChangeText={(val) => { this.setState({ chemicalDissocationMultiplier: val }) }}
                                                        onBlur={() => {
                                                            if (isNaN(this.state.chemicalDissocationMultiplier)) {
                                                                this.setState({ chemicalDissocationMultiplier: '1' })
                                                            }
                                                        }}
                                                    />
                                                </Item>
                                                <Item style={{ padding: 10 }} fixedLabel>
                                                    <Label>Solution density(g/cm^3)</Label>
                                                    <Input
                                                        editable={this.state.editable && !this.state.chemicalIsSolute}
                                                        value={this.state.chemicalSolutionDensity}
                                                        onChangeText={(val) => { this.setState({ chemicalSolutionDensity: val }) }}
                                                        onBlur={() => {
                                                            if (isNaN(this.state.solutionDensity)) {
                                                                if (this.state.chemicalIsSolute) {
                                                                    this.setState({ chemicalSolutionDensity: 'n/a' })
                                                                } else {
                                                                    this.setState({ chemicalSolutionDensity: '1' })
                                                                }
                                                            }
                                                        }}
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
                                                <Item style={{ padding: 10 }} stackedLabel
                                                //disabled={!this.state.editable}
                                                >
                                                    <Label>Remarks</Label>
                                                    <Textarea

                                                        disabled={!this.state.editable}
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
    constructor() {
        super()
        this.state = {
            //currentChemical: null,
            searchData: SolutionsManager.getInstance().getSolutionList(),
            editable: false,
            solutionId: uuid.v4(),
            solutionName: '',
            solutionSolvent: [],
            solutionSolute: [],
            solutionPH: '7',
            solutionRemarks: '',
            solventModal: false,
            soluteModal: false,
            solventHeight: 3 * Dimensions.get('window').height * 0.06,
            soluteHeight: 3 * Dimensions.get('window').height * 0.06,
        }

    }
    renderSolvent() {
        var dataRow = []
        for (var i = 0; i < this.state.solutionSolvent.length; i++) {
            var Solventname = SolutionsManager.getInstance().getChemical(this.state.solutionSolvent[i].solvent).name
            dataRow.push(<Datarow
                key={uuid.v4()}
                type='solvent'
                editable={this.state.editable}
                id={this.state.solutionSolvent[i].solvent}
                unit={this.state.solutionSolvent[i].unit}
                concentration={this.state.solutionSolvent[i].concentration}
                name={Solventname}
                updateList={(id, operation, concentration, unit) => {
                    if (operation == "delete") {
                        this.setState({ solutionSolvent: this.state.solutionSolvent.filter((e) => { return id != e.solvent }) })
                    } else {
                        this.setState({
                            solutionSolvent: this.state.solutionSolvent.map((e) => {
                                if (e.solvent == id) {
                                    e.concentration = concentration
                                    e.unit = unit
                                }
                                return e
                            })
                        }, console.log(this.state))
                    }
                }}
            />)
        }
        return (
            <Card style={{ maxHeight: Dimensions.get('window').height * 0.21, height: Dimensions.get('window').height * 0.21, minHeight: Dimensions.get('window').height * 0.21 }}>
                <CardItem style={{ maxHeight: '100%', height: '100%', minHeight: '100%' }}>
                    <ScrollView contentContainerStyle={{ height: this.state.solventHeight }}>
                        <Grid>
                            <Row>
                                <Col size={2}><Text>Solvent</Text></Col>
                                <Col size={1} style={{ alignItems: 'flex-end' }}><Text>Fraction</Text></Col>
                                <Col size={1} style={{ alignItems: 'flex-end' }}><Text>Fraction unit</Text></Col>
                                <Col size={0.75} style={{ alignItems: 'flex-end' }}><Icon type='MaterialCommunityIcons' name='plus-minus' /></Col>
                            </Row>
                            {dataRow}
                            <Row>
                                <Col size={2}></Col>
                                <Col size={1} style={{ alignItems: 'flex-end' }}></Col>
                                <Col size={1} style={{ alignItems: 'flex-end' }}></Col>
                                <Col size={0.75} style={{ alignItems: 'flex-end' }}>
                                    <Button
                                        transparent
                                        onPress={() => { this.setState({ solventModal: true }) }}
                                    >
                                        <Icon type='MaterialCommunityIcons' name='plus' />
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>
                    </ScrollView>

                </CardItem>
            </Card>
        )

    }
    renderSolute() {
        var dataRow1 = []
        for (var i = 0; i < this.state.solutionSolute.length; i++) {
            var Solutename = SolutionsManager.getInstance().getChemical(this.state.solutionSolute[i].solute).name
            dataRow1.push(<Datarow
                key={uuid.v4()}
                type='solute'
                editable={this.state.editable}
                id={this.state.solutionSolute[i].solvent}
                unit={this.state.solutionSolute[i].unit}
                concentration={this.state.solutionSolute[i].concentration}
                name={Solutename}
                updateList={(id, operation, concentration, unit) => {
                    if (operation == "delete") {
                        this.setState({ solutionSolute: this.state.solutionSolute.filter((e) => { return id != e.solvent }) })
                    } else {
                        this.setState({
                            solutionSolute: this.state.solutionSolute.map((e) => {
                                if (e.solute == id) {
                                    e.concentration = concentration
                                    e.unit = unit
                                }
                                return e
                            })
                        }, console.log(this.state))
                    }
                }}
            />)
        }
        return (
            <Card style={{ maxHeight: Dimensions.get('window').height * 0.21, height: Dimensions.get('window').height * 0.21, minHeight: Dimensions.get('window').height * 0.21 }}>
                <CardItem style={{ maxHeight: '100%', height: '100%', minHeight: '100%' }}>
                    <ScrollView contentContainerStyle={{ height: this.state.solventHeight }}>
                        <Grid>
                            <Row>
                                <Col size={2}><Text>Solute</Text></Col>
                                <Col size={1} style={{ alignItems: 'flex-end' }}><Text>Concentration</Text></Col>
                                <Col size={1} style={{ alignItems: 'flex-end' }}><Text>Concentration unit</Text></Col>
                                <Col size={0.75} style={{ alignItems: 'flex-end' }}><Icon type='MaterialCommunityIcons' name='plus-minus' /></Col>
                            </Row>
                            {dataRow1}
                            <Row>
                                <Col size={2}></Col>
                                <Col size={1} style={{ alignItems: 'flex-end' }}></Col>
                                <Col size={1} style={{ alignItems: 'flex-end' }}></Col>
                                <Col size={0.75} style={{ alignItems: 'flex-end' }}>
                                    <Button
                                        transparent
                                        onPress={() => { this.setState({ soluteModal: true }) }}
                                    >
                                        <Icon type='MaterialCommunityIcons' name='plus' />
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>
                    </ScrollView>
                </CardItem>
            </Card>
        )
    }
    render() {
        return (
            <Content style={{ padding: 10, paddingBottom: 0 }} scrollEnabled={false}>
                <Grid style={{ minHeight: '100%', maxHeight: '100%' }}>
                    <Row size={1} style={{ paddingBottom: 10, zIndex: 9999, maxHeight: 67 }}>{/** */}
                        <Col>
                            <CustomSearchBar
                                labelText='Chemical'
                                ref={component => this.mySearchBar = component}
                                displayData={this.state.searchData}
                                onSelected={(id, name) => {
                                    //console.log(id)
                                    var solution = SolutionsManager.getInstance().getSolution(id.toString())
                                    this.setState({
                                        currentSolution: solution,
                                        solutionid: solution.id,
                                        solutionName: solution.name,
                                        solutionSolvent: solution.solvent,
                                        solutionSolute: solution.solute,
                                        solutionPH: solution.pH.toString(),
                                        solutionRemarks: solution.remarks
                                    }, () => {
                                        //console.log(this.state.currentSolution)
                                    })

                                }}
                                onClear={() => {
                                    //console.log("clearing")
                                    this.setState({
                                        currentSolution: null,
                                        solutionid: uuid.v4(),
                                        solutionName: '',
                                        solutionSolvent: [],
                                        solutionSolute: [],
                                        solutionPH: '7',
                                        solutionRemarks: ''
                                    })
                                }}
                            />

                        </Col>
                    </Row>
                    <Row size={1}>{/**selection */}
                        <Col>
                            <Button
                                danger
                                style={{ width: '100%', zIndex: 1 }}
                                onPress={() => { }}
                            >
                                <Text>Remove Solution</Text>
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                style={{ width: '100%', zIndex: -1 }}
                                onPress={() => { }}
                            >
                                <Text>{this.state.currentSolution == null ? "Add Solution" : "Save edited Solution"}</Text>
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
                            <Row size={4}>
                                <Col>
                                    {this.renderSolvent()}
                                </Col>
                            </Row>
                            <Divider style={{ marginVertical: 2 }} />
                            <Row size={4}>
                                <Col>
                                    {this.renderSolute()}
                                </Col>
                            </Row>
                            <Divider style={{ marginVertical: 2 }} />
                            <Row size={4}>
                                <Card style={{ height: '100%' }}>
                                    <CardItem>
                                        <ScrollView></ScrollView>
                                    </CardItem>
                                </Card>
                            </Row>
                        </Col>
                    </Row>
                </Grid>
                <Modal.BottomModal
                    visible={this.state.solventModal}
                    onTouchOutside={() => this.setState({ solventModal: false })}
                    height={0.7}
                    width={1}
                    onSwipeOut={() => this.setState({ solventModal: false })}
                    modalTitle={<ModalTitle title='Add Solvent'></ModalTitle>}
                >
                    <ModalContent
                        style={{
                            paddingTop: 15,
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        <View style={{ height: 60 }}>


                            <CustomSearchBar
                                clearAfterClick={true}
                                labelText='Solvent'
                                displayData={SolutionsManager.getInstance().getChemicalList().filter((e) => { return e.solute == false })}
                                onSelected={(id, name) => {
                                    var templist = this.state.solutionSolvent.map(e => e)
                                    templist.push({ solvent: id, concentration: "1", unit: "%w" })
                                    this.setState({
                                        solutionSolvent: templist,
                                        solventModal: false
                                    }, () => {
                                        this.setState({ solventHeight: (this.state.solutionSolvent.length + 2) * Dimensions.get('window').height * 0.06 })
                                    })
                                }}
                            />
                        </View>
                    </ModalContent>
                </Modal.BottomModal>
                <Modal.BottomModal
                    visible={this.state.soluteModal}
                    onTouchOutside={() => this.setState({ soluteModal: false })}
                    height={0.7}
                    width={1}
                    onSwipeOut={() => this.setState({ soluteModal: false })}
                    modalTitle={<ModalTitle title='Add Solute'></ModalTitle>}
                >
                    <ModalContent
                        style={{
                            paddingTop: 15,
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        <View style={{ height: 60 }}>
                            <CustomSearchBar
                                clearAfterClick={true}
                                labelText='Solute'
                                displayData={SolutionsManager.getInstance().getChemicalList().filter((e) => { return e.solute == true })}
                                onSelected={(id, name) => {
                                    var templist = this.state.solutionSolute.map(e => e)
                                    templist.push({ solute: id, concentration: "1", unit: "M" })
                                    this.setState({
                                        solutionSolute: templist,
                                        soluteModal: false
                                    }, () => { this.setState({ soluteHeight: (this.state.solutionSolute.length + 2) * Dimensions.get('window').height * 0.06 }) })
                                }}
                            />
                        </View>
                    </ModalContent>
                </Modal.BottomModal>
            </Content >
        )
    }
}
class Datarow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: props.name,
            concentration: props.concentration,
            unit: props.unit,
            id: props.id,
            updateList: props.updateList,
            editable: props.editable,
            type: props.type
        }
        console.log(props)
    }
    /*static getDerivedStateFromProps(props, state) {
        if (props.concentration != state.concentration || props.unit != state.unit) {
            return { concentration: props.concentration, unit: props.unit }
        } else {
            return null
        }
    }*/
    renderPickerItem() {
        if (this.state.type == 'solvent') {
            return (
                <Picker
                    style={{ maxWidth: "100%" }}
                    enabled={this.state.editable}
                    selectedValue={this.state.unit}
                    note={false}
                    mode='dropdown'
                    //iosIcon={<Icon name="arrow-down" />}
                    onValueChange={(value) => {
                        this.setState({ unit: value }, () => {
                            console.log(this.state)
                            this.state.updateList(this.state.id, 'edit', this.state.concentration, this.state.unit)
                        })
                    }}
                >
                    <Picker.Item label="%w" value="%w" />
                    <Picker.Item label="%v" value="%v" />
                </Picker>
            )
        } else {
            return (
                <Picker
                    style={{ maxWidth: "100%" }}
                    enabled={this.state.editable}
                    selectedValue={this.state.unit}
                    mode='dropdown'
                    note={false}
                    //iosIcon={<Icon name="arrow-down" />}
                    onValueChange={(value) => {
                        this.setState({ unit: value }, () => {
                            this.state.updateList(this.state.id, 'edit', this.state.concentration, this.state.unit)
                        })
                    }}
                >
                    <Picker.Item label="µM" value="µM" />
                    <Picker.Item label="mM" value="mM" />
                    <Picker.Item label="M" value="M" />
                </Picker>
            )
        }

    }
    render() {
        return (
            <Row>
                <Col size={2} style={{ justifyContent: 'center' }}><Text>{this.state.name}</Text></Col>
                <Col size={1} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Input
                        editable={this.state.editable}
                        value={this.state.concentration}
                        onChangeText={(val) => {
                            this.setState({ concentration: val })
                        }}
                        onBlur={() => {
                            console.log(this.state.concentration)
                            if (isNaN(this.state.concentration)) {
                                this.setState({ concentration: '1' }, () => {
                                    this.state.updateList(this.state.id, 'edit', this.state.concentration, this.state.unit)
                                })
                            } else {
                                this.state.updateList(this.state.id, 'edit', this.state.concentration, this.state.unit)
                            }

                        }}
                    />
                </Col>
                <Col size={1} style={{ alignContent: 'flex-end', justifyContent: 'center' }}>
                    {this.renderPickerItem()}
                </Col>
                <Col size={0.75} style={{ alignContent: 'flex-end', justifyContent: 'center', }}>
                    <Button
                        transparent
                        style={{ maxWidth: "100%" }}
                        disabled={!this.state.editable}
                        onPress={() => {
                            this.state.updateList(this.state.id, 'delete', this.state.concentration, this.state.unit)
                        }}
                    >
                        <Icon type='MaterialCommunityIcons' name='minus' />
                    </Button>
                </Col>
            </Row >
        )
    }
}
