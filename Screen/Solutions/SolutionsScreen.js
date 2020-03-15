import Drawer from 'react-native-drawer'
import React from 'react'
import { Header, Left, Right, Container, Icon, Button, Text, Title, Content, Footer, Body, Grid, Row, Col } from 'native-base'
import ControlPanel from '../../utils/ControlPanel'
import LABCAL from '../../utils/Labcal'
import { AsyncStorage } from 'react-native'
import CustomSearchBar from '../../utils/SearchBar'
import Modal, { ModalContent, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals'
import { View, Dimensions } from 'react-native'
import SolutionsManager from '../../utils/SolutionsManager'

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
            visible: false,
            currentChemical: null,
            searchData: SolutionsManager.getInstance().getChemicalList(),
        }
    }
    render() {
        return (
            <Content style={{ padding: 10, paddingBottom:0 }} scrollEnabled={false}>
                <Grid style={{minHeight:'100%'}}>
                    <Row size={1} style={{ paddingBottom: 10, zIndex: 9999, maxHeight:67 }}>{/** */}
                        <Col>
                            <CustomSearchBar labelText='Chemical'
                                displayData={this.state.searchData}
                                onSelected={(id, name) => {
                                    console.log(id)
                                    var chemical = SolutionsManager.getInstance().getChemical(id.toString())
                                    this.setState({ currentChemical: chemical }, () => {
                                        console.log(this.state.currentChemical)
                                    })

                                }} />
                        </Col>
                    </Row>
                    <Row size={1}>{/**image */}
                        <Col>
                            <Button danger style={{ width: '100%', zIndex: 1 }}>
                                <Text>Remove Chemical</Text>
                            </Button>
                        </Col>
                        <Col>
                            <Button style={{ width: '100%', zIndex: -1 }}
                                onPress={() => {
                                    this.setState({ visible: true })
                                }}
                            >
                                <Text>Add Chemical</Text>
                            </Button>
                        </Col>
                    </Row>
                    <Row size={18}>{/**control panel */}
                        <Col></Col>
                    </Row>
                    <Row size={1} style={{ alignSelf: 'flex-end', alignItems:'flex-end' }}>{/**recipe */}
                        <Button style={{ width: '100%', zIndex: 10 }}>
                            <Text>Save</Text>
                        </Button>
                    </Row>
                </Grid>
                <Modal.BottomModal
                    visible={this.state.visible}
                    //onTouchOutside={() => this.setState({ visible: false })}
                    height={0.8}
                    width={1}
                    //onSwipeOut={() => this.setState({ visible: false })}
                    modalTitle={<ModalTitle title='New Chemicals'></ModalTitle>}
                >
                    <ModalContent
                        style={{
                            paddingTop: 15,
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        <Grid style={{ minHeight: '80%' }}>
                            <Row size={6}>
                                <Col>
                                </Col>
                            </Row>
                            <Row size={1} style={{ alignSelf: 'flex-end' }}>
                                <Col>
                                    <Button danger style={{ width: '100%', zIndex: 1 }}
                                        onPress={() => {
                                            this.setState({ visible: false })
                                        }}
                                    >
                                        <Text>Cancel</Text>
                                    </Button>
                                </Col>
                                <Col>
                                    <Button style={{ width: '100%', zIndex: -1 }}
                                        onPress={() => {
                                            this.setState({ visible: false })
                                        }}
                                    >
                                        <Text>Confirm</Text>
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>

                    </ModalContent>
                </Modal.BottomModal>
            </Content>
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
