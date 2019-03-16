import React from 'react';
import { View, ScrollView, Image, Text, TextInput, StyleSheet, Button, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import { Input, Header, Divider } from 'react-native-elements';
import { addMyCircle } from '../../Store/actions/authAction'
import { Alert } from 'expo';
import { bindActionCreators } from 'redux';
import Container from '../../container/Container';

class AddCircle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    goback() {
        this.props.navigation.dispatch(NavigationActions.back())
    }

    ID() {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 6 characters
        // after the decimal.
        return (Math.random().toString(36).substr(2, 6)).toUpperCase();
    };

    addCircle() {
        const { text } = this.state
        const { addMyCircle } = this.props.actions
        const { userUid } = this.props

        if (text) {
            this.setState({ loader: true })
            var obj = {
                circleName: text,
                joinCode: this.ID(),
                members: [],
                userUid,
            }
            addMyCircle(obj).then(() => {
                const { navigate } = this.props.navigation
                navigate('Home')
                this.setState({ loader: false })
            })
        } else {
            Alert.alert(
                'Warning',
                'Please enter name',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
            )
        }
        this.setState({ text: '' })
    }

    render() {
        const { text, loader } = this.state
        return (
            <Container center={false} right={false} back={true} title={'Create A Circle'} goback={() => this.goback()}>
                <View style={styles.container}>
                    <View style={styles.name}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            paddingVertical: 15,
                            alignSelf: 'center'
                        }}>
                            Enter Your Circle Name
                        </Text>
                    </View>
                    <View style={styles.textField}>
                        <TextInput
                            placeholder={'Enter Circle Name'}
                            value={text}
                            style={{
                                borderWidth: 1,
                                width: '60%',
                                alignSelf: 'center',
                                paddingVertical: 10,
                                paddingHorizontal: 10,
                            }}
                            placeholderTextColor={'grey'}
                            onChangeText={(text) => this.setState({ text })}
                        />
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={{
                            alignSelf: 'center',
                            backgroundColor: '#075e54',
                            paddingVertical: 15,
                            paddingHorizontal: 20,
                            borderRadius: 5
                        }}
                            onPress={() => this.addCircle()}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                CREATE
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    loader &&
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#075e54" />
                    </View>
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        // borderWidth: 1,
        width: '100%',
        paddingVertical: 10,
    },
    container: {
        flex: 1,
        // borderWidth: 2,
        alignItems: 'center',
    },
    name: {
        width: '100%',
        // borderWidth: 1,
    },
    textField: {
        // borderWidth: 2,
        width: '100%',
        paddingVertical: 20
    },
    loader: {
        position: 'absolute',
        bottom: '50%',
        right: '45%'
    }
});

function mapStateToProp(state) {
    return ({
        userUId: state.authReducers.USER,
        allUser: state.authReducers.ALLUSER,
        userUid: state.authReducers.UID
    })
}
function mapDispatchToProp(dispatch) {
    return ({
        actions: bindActionCreators({
            addMyCircle
        }, dispatch)
    })
}

export default connect(mapStateToProp, mapDispatchToProp)(AddCircle);

