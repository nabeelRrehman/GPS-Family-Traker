import React from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Button, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import firebase from '../../config/Firebase';
import { Header, Input } from 'react-native-elements';
import { StackActions, NavigationActions } from 'react-navigation';
import { Constants } from 'expo';
import { enterCircleCode } from '../../Store/actions/authAction'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { white } from 'ansi-colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Container from '../../container/Container';
// import SplashScreen from '../../../assets/SplashScreen.png';

class JoinCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circleCode: '',
            cond: false,
        }
    }


    _addCircle = () => {
        const { circleCode } = this.state;
        const { userUid } = this.props;
        if (circleCode) {
            this.setState({ cond: true })

            this.props.actions.enterCircleCode(userUid, circleCode)
                .then(() => {
                    this.setState({ cond: false, circleCode: '' })
                    alert('Successfully Join')
                    this.props.navigation.navigate('Home')
                })
                .catch((err) => {
                    if(err === 'admin') {
                        alert('You are Circle Admin')
                    }else{
                        alert('You are already in this circle')
                    }
                })
        }
    }


    goback() {
        this.props.navigation.dispatch(NavigationActions.back())
    }

    render() {
        const { circleCode } = this.state;
        return (
            <Container center={false} right={false} back={true} title={'Join A Circle'} goback={() => this.goback()}>
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{
                        flex: 1,
                        justifyContent: 'flex-start',
                    }}>
                        <View style={{ alignItems: 'center', paddingVertical: 15, paddingHorizontal: 7, alignSelf: 'center' }}>
                            <Text style={[styles.text, { fontWeight: '600', fontSize: 20 }]}>
                                Please Enter Invite Code
                            </Text>
                            <Text style={styles.text}>
                                Get the code from your Circle's admin
                            </Text>
                            <View style={styles.input}>
                                <Input
                                    style={{ borderBottomWidth: 1, color: '#075e54', paddingHorizontal: 10 }}
                                    value={circleCode}
                                    place
                                    placeholder={'XX-XX-XX'}
                                    onChangeText={(e) => this.setState({ circleCode: e })}
                                />
                            </View>
                        </View>
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.opacity}
                        onPress={this._addCircle}
                    >
                        <View>
                            <Text style={{ fontSize: 20, color: 'white', fontWeight: '600' }}>
                                Join
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Container >
        )
    }
}



// export default AddCircle;

function mapStateToProps(states) {
    return ({
        userUid: states.authReducers.UID,
        // currentUser: states.authReducers.CURRENTUSER,
        // currentUserUID: states.authReducers.CURRENTUSERUID,
    })
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            enterCircleCode
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinCode);


const styles = StyleSheet.create({
    text: {
        fontSize: 24,
        marginTop: 15,
    },
    input: {
        width: 100,
    },
    opacity: {
        paddingVertical: 15,
        alignItems: 'center',
        backgroundColor: '#075e54'
    },
    text: {
        fontSize: 19,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        textAlign: 'center',
    }
})