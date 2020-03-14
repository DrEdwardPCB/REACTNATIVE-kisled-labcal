import Drawer from 'react-native-drawer'
import React from 'react'
import { Divider } from 'react-native-paper'
import { Button, Grid, Col, Row, Container, Content, Title, Left, Right, Body, Icon, Header, Text } from 'native-base'
import LABCAL from './Labcal.js'
import { FlatList, ScrollView, Dimensions, View } from 'react-native'
import { StackActions } from '@react-navigation/native';
//import { black } from 'react-native-paper/lib/typescript/src/styles/colors'

export default class ControlPanel extends React.Component {
    constructor(props) {
        super(props)
        //console.log(props)
        if (this.props.currentApp == LABCAL.SOLUTIONSSCREENdn) {
            this.state = {
                currentApp: props.currentApp,
                currentPage: props.currentPage,
                navigation: props.navigation,
                closeHandler: props.closeHandler,
                FlatListItem: [
                    {
                        id: 1,
                        name: LABCAL.solutionpage
                    },
                    {
                        id: 2,
                        name: LABCAL.chemicaleditorpage
                    },
                    {
                        id: 3,
                        name: LABCAL.solutioneditorpage
                    },
                ],
                updatePage: props.updatePage
            }
        } else {
            this.state = {
                currentApp: props.currentApp,
                currentPage: props.currentPage,
                navigation: props.navigation,
                closeHandler: props.closeHandler,
                FlatListItem: [
                    {
                        id: 1,
                        name: LABCAL.calculatorpage
                    },
                    {
                        id: 2,
                        name: LABCAL.graphplotterpage
                    },
                ],
                updatePage: props.updatePage
            }
        }
        //this.fillPages()

    }
    /*fillPages = () => {
        //mapping
        if (this.props.currentApp == LABCAL.SOLUTIONSSCREENdn) {

            this.state.FlatListItem = [
                {
                    id: 1,
                    name: LABCAL.solutionpage
                },
                {
                    id: 2,
                    name: LABCAL.chemicaleditorpage
                },
                {
                    id: 3,
                    name: LABCAL.solutioneditorpage
                },
            ]

        } else if (this.props.currentApp == LABCAL.SCIENTIFICCALCULATORSCREENdn) {
            this.state
                .FlatListItem = [
                    {
                        id: 1,
                        name: LABCAL.calculatorpage
                    },
                    {
                        id: 2,
                        name: LABCAL.graphplotterpage
                    },
                ]

        }
    }
*/
    static getDerivedStateFromProps(props, state) {
        if (props.currentPage !== state.currentPage) {
            return {
                currentPage: props.currentPage
            }
        } else {
            return null
        }
    }
    renderPages = () => {
        //console.log(this.state.FlatListItem)
        return this.state.FlatListItem.map(Element => {
            return (
                <Button
                    full
                    transparent={Element.name === this.state.currentPage ? false : true}
                    disapled={Element.name === this.state.currentPage ? true : false}
                    onPress={() => this.state.updatePage(Element.name)}
                >
                    <Text>{Element.name}</Text>
                </Button>
            )
        })
    }
    renderApp = () => {
        var apps = []
        var approw = []
        for (var i = 0; i < LABCAL.APPLIST.length; i++) {
            approw.push(
                <Col size={50} key={LABCAL.APPLIST[i].id} style={{ padding: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <Row>
                        <Col style={{ padding: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Button style={{ backgroundColor: LABCAL.APPLIST[i].color, justifyContent: 'center', alignContent: 'center', alignItems: 'center', aspectRatio: 1, height: 60, borderRadius: 10 }}
                                onPress={() => {
                                    this.props.navigation.dispatch(StackActions.replace(LABCAL.APPLIST[i].routename))
                                }}
                            >
                                <Icon type='MaterialCommunityIcons' name={LABCAL.APPLIST[i].icon} style={{ fontSize: 28, color: 'rgba(200,200,200,1)' }} />
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ padding: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{minWidth:100, backgroundColor:'black'}}>{LABCAL.APPLIST[i].displayname}</Text>
                        </Col>
                    </Row>
                </Col>
            )
            if (approw.length == 2) {
                apps.push(approw)
                approw = []
            }
        }
        if (approw !== []) {
            approw.push(<Col size={50} style={{ padding: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}></Col>)
        }
        var rowedApp = []
        for (var i = 0; i < apps.length; i++) {
            rowedApp.push(
                <Row key={i}>
                    {apps[i][0]}
                    {apps[i][1]}
                </Row>
            )
        }
        return (
            <Grid>
                {rowedApp}
            </Grid>
        )
    }

    render() {
        //console.log(this.state.navigation)
        return (
            <Container>
                <Header>
                    <Grid>
                        <Row style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                            <Col size={2} />
                            <Col size={4}>
                                <Title>{this.state.currentApp}</Title>
                            </Col>
                            <Col size={2}>
                                <Button transparent onPress={() => { this.state.closeHandler() }}>
                                    <Icon type='MaterialCommunityIcons' name='close' style={{ color: 'blue', fontSize: 24 }}></Icon>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </Header>
                <Content scrollEnabled={false}>
                    <Grid>
                        <Row size={5}>
                            <Col>
                                <ScrollView contentContainerStyle={{ height: Dimensions.get('window').height * 0.45 }}>
                                    <View>
                                        {this.renderPages()}
                                    </View>
                                </ScrollView>
                            </Col>
                        </Row>
                        <Divider />
                        <Row size={5}>
                            <Col>
                                <ScrollView contentContainerStyle={{ height: Dimensions.get('window').height * 0.45, paddingTop: 30 }}>
                                    <View>
                                        {
                                            this.renderApp()
                                        }
                                    </View>
                                </ScrollView>
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        )
    }
}