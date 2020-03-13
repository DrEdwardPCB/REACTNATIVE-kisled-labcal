import Drawer from 'react-native-drawer'
import React from 'react'
import { Divider } from 'react-native-paper'
import { Button, Grid, Col, Row, Container, Content, Title, Left, Right, Body, Icon, Header, Text } from 'native-base'
import LABCAL from './Labcal.js'
import { FlatList, ScrollView, Dimensions, View } from 'react-native'
import { StackActions } from '@react-navigation/native';

export default class ControlPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentApp: props.currentApp,
            currentPage: props.currentPage,
            navigation: props.navigation,
            closeHandler: props.closeHandler,
            FlatListItem: [],
            updatePage:props.updatePage
        }

    }
    fillPages = () => {
        //mapping
        if (this.state.currentApp == LABCAL.SOLUTIONSSCREENdn) {
            this.setState({
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
                ]
            })
        } else if (this.state.currentApp == LABCAL.SCIENTIFICCALCULATORSCREENdn) {
            this.setState({
                FlatListItem: [
                    {
                        id: 1,
                        name: LABCAL.calculatorpage
                    },
                    {
                        id: 2,
                        name: LABCAL.graphplotterpage
                    },
                ]
            })
        }
    }
    componentDidMount() {
        this.fillPages()
    }

    renderApp = () => {
        var apps = []
        var approw = []
        for (var i = 0; i < LABCAL.APPLIST.length; i++) {
            approw.push(
                <Col size={50} style={{ padding: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <Button rounded style={{ backgroundColor: LABCAL.APPLIST[i].color, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                            this.props.navigation.dispatch(StackActions.replace(LABCAL.APPLIST[i].routename))
                        }}
                    >
                        <Icon type='MaterialCommunityIcons' name={LABCAL.APPLIST[i].icon} style={{ fontSize: 28, color: 'rgba(200,200,200,1)' }} />
                    </Button>
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
                <Row>
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
    componentWillReceiveProps(props) {
        this.setState({ currentApp: props.currentApp, currentPage: props.currentPage })
        //this.fillPages()
    }
    render() {
        console.log(this.state.navigation)
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => { this.state.closeHandler() }}>
                            <Icon type='MaterialCommunityIcons' name='close' style={{ color: 'blue', fontSize: 24 }}></Icon>
                        </Button>
                    </Left>
                    <Body>
                        <Title>{this.state.currentApp}</Title>
                    </Body>
                    <Right />
                </Header>
                <Content scrollEnabled={false}>
                    <Grid>
                        <Row size={5}>
                            <Col>
                                <FlatList
                                    data={this.state.FlatListItem}
                                    renderItem={({ item }) => <Button
                                        transparent={this.state.currentPage === item.name ? false : true}
                                        full
                                        disabled={this.state.currentPage === item.name ? true : false}
                                        onPress={this.state.updatePage()}
                                    >
                                        <Text>{item.name}</Text>
                                    </Button>}
                                    keyExtractor={item => item.id}
                                />
                            </Col>
                        </Row>
                        <Row size={5}>
                            <Col>
                                <ScrollView contentContainerStyle={{ height: Dimensions.get('window').height * 0.45 }}>
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