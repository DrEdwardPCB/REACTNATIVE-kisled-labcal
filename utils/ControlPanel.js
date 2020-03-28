import Drawer from 'react-native-drawer'
import React from 'react'
import { Divider } from 'react-native-paper'
import { Button, Grid, Col, Row, Container, Content, Title, Left, Right, Body, Icon, Header, Text, Card, CardItem } from 'native-base'
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
        }else if(this.props.currentApp == LABCAL.SETTINGSSCREENdn){
            this.state = {
                currentApp: props.currentApp,
                currentPage: props.currentPage,
                navigation: props.navigation,
                closeHandler: props.closeHandler,
                FlatListItem: [
                    {
                        id: 1,
                        name: LABCAL.helpfeedbackpage
                    },
                    {
                        id: 2,
                        name: LABCAL.statementpage
                    },
                    {
                        id: 3,
                        name: LABCAL.memorymanagementpage
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
                <ApplicationIcon iconName={LABCAL.APPLIST[i].icon} iconColor={LABCAL.APPLIST[i].color} displayName={LABCAL.APPLIST[i].displayname} routename={(' '+LABCAL.APPLIST[i].routename).slice(1)} id={LABCAL.APPLIST[i].id} navigation={this.props.navigation}/>
            )
            if (approw.length == 2) {
                apps.push(approw)
                approw = []
            }
        }
        if (approw !== []) {
            approw.push(<Col size={50} style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}></Col>)
            apps.push(approw)
        }
        var rowedApp = []
        for (var i = 0; i < apps.length; i++) {
            rowedApp.push(
                <Row key={i} style={{ minHeight: 100, marginBottom: 5 }}>
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
                        <Row size={5} style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', paddingTop: 10 }}>
                            <Col style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                <Title>Pages</Title>
                            </Col>
                        </Row>
                        <Row size={5}>
                            <Col style={{ padding: 10 }}>
                                <Card>
                                    <CardItem>
                                        <ScrollView contentContainerStyle={{ height: Dimensions.get('window').height * 0.4 }}>
                                            <View>
                                                {this.renderPages()}
                                            </View>
                                        </ScrollView>
                                    </CardItem>
                                </Card>
                            </Col>
                        </Row>
                        <Divider />
                        <Row size={5} style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', paddingTop: 10 }}>
                            <Col style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                <Title>Applications</Title>
                            </Col>
                        </Row>
                        <Row size={5}>
                            <Col>
                                <ScrollView contentContainerStyle={{ height: Dimensions.get('window').height * 0.45, paddingTop: 10 }}>
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
class ApplicationIcon extends React.Component{
    constructor(props){
        super(props)
        this.state={
            iconColor:props.iconColor,
            iconName:props.iconName,
            displayName:props.displayName,
            routename:props.routename,
            id:props.id
        }
    }
    render(){
        return(
            <Col size={50} key={this.state.id} style={{ minHeight: 90, }}>
                    <Row size={2} style={{ Height: 60, }}>
                        <Col style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', height: 60 }}>
                            <Button style={{
                                backgroundColor: this.state.iconColor, justifyContent: 'center', alignContent: 'center', alignItems: 'center', aspectRatio: 1, height: 60, borderRadius: 10, shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                            }}
                                onPress={() => {
                                    //console.log(LABCAL.APPLIST[i])
                                    //console.log(i)
                                    //console.log(LABCAL.APPLIST[i].routename)
                                    this.props.navigation.dispatch(StackActions.replace(this.state.routename))
                                }}
                            >
                                <Icon type='MaterialCommunityIcons' name={this.state.iconName} style={{ fontSize: 28, color: 'rgba(200,200,200,1)' }} />
                            </Button>
                        </Col>
                    </Row>
                    <Row size={1} >
                        <Col style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: 15 }}>
                            <Text style={{ textAlign: 'center', fontSize: 12, minHeight: 15, aspectRatio: 8 / 1, zIndex: 1000 }}>{this.state.displayName}</Text>
                        </Col>
                    </Row>
                </Col>
        )
    }
}