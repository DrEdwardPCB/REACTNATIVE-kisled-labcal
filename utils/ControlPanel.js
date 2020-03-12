import Drawer from 'react-native-drawer'
import React from 'react'
import { Divider } from 'react-native-paper'
import { Button, Grid, Col, Row, Container, Content, Left, Right, Body } from 'native-base'
import LABCAL from './Labcal.js'
import { FlatList, ScrollView } from 'react-native'


export default class ControlPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentApp=props.currentApp,
            currentScreen=props.currentScreen,
            navigation=props.navigation,

        }
    }
    render() {
        return (
            <Container>
                <Header>
                    <Title>{this.state.currentApp}</Title>
                </Header>
                <Content scrollEnabled={false}>
                    <Grid>
                        <Row>
                            <Col>
                                <FlatList/>
                            </Col>
                        </Row>
                        <Divider/>
                        <Row>
                            <Col>
                                <ScrollView/>
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        )
    }
}