import Drawer from 'react-native-drawer'
import React from 'react'
import { Header, Left, Right, Container, Icon, Button, Text, Title, Content, Footer } from 'native-base'
import ControlPanel from '../../utils/ControlPanel'
import LABCAL from '../../utils/Labcal'
import { AsyncStorage } from 'react-native'

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
                content={<ControlPanel navigation={this.props.navigation} closeHandler={this.closeControlPanel} currentPage={this.state.currentPage} currentApp={this.state.currentApp} updatePage={this.updatePage}/>}
                tapToClose={true}
                openDrawerOffset={0.2} // 20% gap on the right side of drawer
                panCloseMask={0.2}
                closedDrawerOffset={-3}
                //styles={drawerStyles}
                tweenHandler={(ratio) => ({
                    main: { opacity: (2 - ratio) / 2 }
                })}
            >
                <MainView navigation={this.props.navigation} openHandler={this.openControlPanel} currentPage={this.state.currentPage}  />
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
    static getDerivedStateFromProps(props,state){
        if(props.currentPage !== state.currentPage){
            return{
                currentPage:props.currentPage
            }
        }else{
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
                <Footer>
                <Button 
                full
                onPress={()=>{
                    AsyncStorage.clear(()=>{console.log('clear success')})
                }}><Text>clear</Text></Button>
                </Footer>
            </Container>
        )

    }
}



class SolutionsMix extends React.Component {
    render() {
        return (
            <Content>
                <Text>Solution</Text>
                    
            </Content>
        )
    }
}
class ChemicalEditor extends React.Component {
    render() {
        return (
            <Content><Text>Chemical editor</Text></Content>
        )
    }
}
class SolutionEditor extends React.Component {
    render() {
        return (
            <Content><Text>Solution editor</Text></Content>
        )
    }
}
