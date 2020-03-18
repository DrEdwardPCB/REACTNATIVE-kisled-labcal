import React from 'react'
import { Button, Input, Form, Item, Card, CardItem, Grid, Col, Row, Label, Icon, Left, Right, Body, Title } from 'native-base'
import { Dimensions, View, ScrollView, TouchableOpacity } from 'react-native'


/**
 * props{
 * labelText:string
 * displayData:[]
 * onSelected:Function({id,text})
 * }
 */

export default class CustomSearchBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            open: false,
            displayData: props.displayData,
            onSelected: props.onSelected,
            //debounce: null,
            onClear : props.onClear
        }
        console.log(props)
    }
    showCancelButton = () => {
        if (this.state.text !== '') {
            return (
                <Button rounded
                    style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', height: '100%', aspectRatio: 1, padding: 0 }}
                    onPress={() => {
                        this.setState({
                            text: '',
                            open: false
                        },()=>{this.state.onClear()})
                        
                    }}
                >
                    <Icon type='Entypo' name='cross' style={{ fontSize: 24 }} />
                </Button>
            )
        } else {
            return (<Label style={{ paddingLeft: 15 }}>
                {this.props.labelText}
            </Label>)
        }
    }
    renderData = () => {
        if (this.state.open) {
            return (
                <Card style={{ position: "absolute", minWidth: Dimensions.get('window').width * 0.85, height: Dimensions.get('window').height * 0.5, elevation: 10, top: 50, alignSelf:'center' }}>
                    <CardItem>
                        <ScrollView contentContainerStyle={{ width: '100%', flexGrow:1}}>
                            {this.renderItem()}
                        </ScrollView>
                    </CardItem>
                </Card>
            )
        } else {
            return null
        }
    }
    renderItem = () => {
        if (this.state.text === '') {
            return this.state.displayData.map(e => {
                return (
                    <ListItem key ={e.id} id={e.id} name={e.name} pressHandler={(id, name) => {
                        this.state.onSelected(id, name)
                        this.setState({
                            open: false,
                            text:name
                        })
                    }} />
                )
            })
        } else {
            return this.state.displayData.filter(e => e.name.includes(this.state.text)).map(e => {
                return (
                    <ListItem key ={e.id} id={e.id} name={e.name} pressHandler={(id, name) => {
                        this.state.onSelected(id, name)
                        this.setState({
                            open: false,
                            text:name
                        })
                    }} />
                )
            })
        }
    }
    render() {
        return (
            <View>
                <Form>
                    <Item fixedLabel rounded style={{}}>
                        {this.showCancelButton()}
                        <Input value={this.state.text} onChangeText={(val => {
                            this.setState({ text: val })
                        })} />

                        <Button rounded transparent
                            style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', height: '100%', aspectRatio: 1 }}
                            onPress={() => {
                                this.setState({
                                    open: !this.state.open
                                })
                            }}
                        >
                            {this.state.open ? <Icon type='Ionicons' name='ios-arrow-up' style={{ fontSize: 24 }} /> : <Icon type='Ionicons' name='ios-arrow-down' style={{ fontSize: 24 }} />}
                        </Button>
                        <Button rounded
                            style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', height: '100%', aspectRatio: 1 }}
                            onPress={() => {
                                this.setState({
                                    open: true
                                })
                            }}
                        >
                            <Icon type='MaterialCommunityIcons' name='file-search-outline' style={{ fontSize: 24 }} />
                        </Button>
                    </Item>
                </Form>
                {this.renderData()}
            </View>
        )
    }
}
class ListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id,
            name: props.name,
            pressHandler: props.pressHandler
        }
    }
    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.state.pressHandler(this.state.id, this.state.name)
                }}
                style={{
                    shadowColor: 'rgba(0,0,0, .4)', // IOS
                    shadowOffset: { height: 2, width: 0 }, // IOS
                    shadowOpacity: 0.25, // IOS
                    shadowRadius: 3.84, //IOS
                    backgroundColor: '#fff',

                    elevation: 5,
                    borderWidth: 1,
                    borderColor: 'rgba(200,200,200,.5)',
                    borderRadius: 3,
                    height: 40,
                    margin: 5,
                    backgroundColor:'rgba(245,245,245,1)',
                    justifyContent:'center'
                }}
            >
                <Title>
                    {this.state.name}
                </Title>
            </TouchableOpacity >
        )
    }
}