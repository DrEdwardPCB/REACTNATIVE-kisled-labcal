import Drawer from 'react-native-drawer'
import React from 'react'
import { Header, Left, Right, Container, Icon, Button, Text, Title, Content, Footer, Body, Grid, Row, Col, Picker, Form, Item, Input, Label, Textarea, Card, CardItem } from 'native-base'
import ControlPanel from '../../utils/ControlPanel'
import LABCAL from '../../utils/Labcal'
import { AsyncStorage, ScrollView, View, Dimensions, Alert, SafeAreaView, Slider } from 'react-native'
import CustomSearchBar from '../../utils/SearchBar'
import Modal, { ModalContent, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals'
import SolutionsManager from '../../utils/SolutionsManager'
import { Switch, Divider, DataTable } from 'react-native-paper'

import Markdown from 'react-native-easy-markdown';
import CalculatorManager from '../../utils/CalculatorManager'



export default class Solutions extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            navigation: props.navigation,
            currentPage: LABCAL.statementpage,
            currentApp: LABCAL.SETTINGSSCREENdn
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
        if (this.state.currentPage === LABCAL.statementpage) {
            return (<Statementpage></Statementpage>)
        }
        else if (this.state.currentPage === LABCAL.helpfeedbackpage) {
            return (<HelpFeedbackpage></HelpFeedbackpage>)
        } else if (this.state.currentPage === LABCAL.memorymanagementpage) {
            return (<Memorypage></Memorypage>)
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
class HelpFeedbackpage extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (<Content style={{padding:10}}>
            <Markdown>
                {
                    '## help\n\n'+
                    '* [Github](https://github.com/DrEdwardPCB/REACTNATIVE-kisled-labcal)\n\n'+
                    '## Feedback\n\n'+
                    '* [Github](https://github.com/DrEdwardPCB/REACTNATIVE-kisled-labcal)\n'+
                    '* [Developer pages](http://ekhome.life#contact)'                   
                }
            </Markdown>
        </Content>)
    }
}
class Statementpage extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (<Content style={{padding:10}}>
            <Markdown>
                {
                    '# kisled-labcal\n\n' +
                    'this app is create to assist calculation in wet lab and hopefully some in dry lab\n' +
                    'This project is also made free and open sourced under MIT Lisence [source code](https://github.com/DrEdwardPCB/REACTNATIVE-kisled-labcal) are available\n\n'+
                    '## Solution mix\n\n' +
                    'helps save solution recipe and calculate required mass, volume of the ingrediants based on the required volume, it can also estimate osmotic pressure\n\n' +
                    '## Scientific Calculator\n\n' +
                    'a calculator that contains nearly all necessary function of lab needs\n\n' +
                    '### Credits\n\n' +
                    '* Author: [Wong Yuk Ming, Edward](http://ekhome.life/)(Edward Wong)\n' +
                    '* Affliation: [PBHuang Lab@HKUST](https://facultyprofiles.ust.hk/profiles.php?profile=pingbo-huang-bohuangp)\n\n'+
                    '### Lisence\n\n' +
                    'MIT License\n\nCopyright (c) 2020 Edward Wong\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.'
                    
                }
            </Markdown>
        </Content>)
    }
}
class Memorypage extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Content scrollEnabled={false} style={{padding:10}}>
                <Grid>
                    <Row><Col><Title>{LABCAL.SOLUTIONSSCREENdn}</Title></Col></Row>
                    <Row>
                        <Col size={1}><Button onPress={() => {
                            Alert.alert(
                                'Confirmation',
                                'confirm delete memory?',
                                [
                                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                    {
                                        text: 'OK', onPress: async () => {
                                            SolutionsManager.getInstance().resetDefault()
                                        }
                                    },
                                ],
                                { cancelable: false }
                            )
                        }}><Text>Clear</Text></Button></Col>
                        <Col size={3} style={{ justifyContent: 'center' }} style={{paddingLeft:10, justifyContent:'center'}}>
                            <Text>reset to the default set of chemicals and solutions</Text>
                        </Col>
                    </Row>
                    <Row><Col><Title>{LABCAL.SCIENTIFICCALCULATORSCREENdn}</Title></Col></Row>
                    <Row>
                        <Col size={1}><Button 
                        
                        onPress={() => {
                            Alert.alert(
                                'Confirmation',
                                'confirm delete memory?',
                                [
                                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                    {
                                        text: 'OK', onPress: async () => {
                                            CalculatorManager.getInstance().resetDefault()
                                        }
                                    },
                                ],
                                { cancelable: false }
                            )
                        }}><Text>Clear</Text></Button></Col>
                        <Col size={3} style={{ justifyContent: 'center' }} style={{paddingLeft:10, justifyContent:'center'}}>
                            <Text>reset saved variable to default</Text>
                        </Col>
                    </Row>
                </Grid>

            </Content>)
    }
}




