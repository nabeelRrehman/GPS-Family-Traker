import React from 'react';
import { View, ScrollView, Image, Text, TextInput, StyleSheet, Button, TouchableOpacity, KeyboardAvoidingView, RefreshControl } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Header, Divider } from 'react-native-elements';
import { Constants, Location, Permissions, Contacts, MailComposer } from 'expo';
import Container from '../../container/Container';
import { bindActionCreators } from 'redux';
import { addEmail } from '../../Store/actions/authAction'
import Icons from '../../../assets/person-dummy.jpg'


class InviteCode extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    goback() {
        this.props.navigation.dispatch(NavigationActions.back())
    }

    componentDidMount() {
        const { getParam } = this.props.navigation

        const data = getParam('data')
        console.log(data, 'data here getparam')
        this.setState({ data })
    }

    submit = () => {
        const { data, email } = this.state
        var mail = Promise.resolve(MailComposer.composeAsync({
            recipients: [email],
            body: `Code for Join Circle: ${data.joinCode}`,
            subject: 'GPS Tracker App'
        }))
        mail.then((res) => {
            console.log(res, 'response here')
            alert('mail sent')
        })
        // if (data && email) {
        //     const { addEmail } = this.props.actions

        //     addEmail(data, email)
        // }
    }

    render() {
        const { data, email } = this.state
        return (
            <Container center={false} right={false} back={true} title={'Invite A New Member'} goback={() => this.goback()}>
                <View style={styles.container}>
                    <KeyboardAvoidingView behavior={'padding'} enabled>
                        <ScrollView style={{ paddingVertical: 20, width: '100%' }}>

                            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15, marginTop: 20 }}></Text>
                            <View style={{ marginBottom: 15 }}>
                                <Image style={styles.icon} source={Icons} />

                            </View>
                            <View >
                                <View style={{ padding: 10 }}>

                                    <Text style={{ color: 'black', fontSize: 20 }}>Enter Email Send Code:</Text>
                                </View>
                                <View style={{ padding: 10 }}>

                                    <Input
                                        value={email}
                                        placeholder='     Enter Email'
                                        onChangeText={(e) => this.setState({ email: e })}
                                    />
                                </View>
                            </View>
                            <View style={{}}>
                                <Text>
                                    {data && data.joinCode}
                                </Text>
                            </View>
                            <View style={{ marginTop: 42 }}>
                                <Button
                                    onPress={() => this.submit()}
                                    icon={
                                        <Icon
                                            name="save"
                                            size={25}
                                            color="white"
                                        />
                                    }
                                    title="  SEND"
                                    color='#075e54'
                                />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        height: 200,
        width: 200,
        // borderRadius: 100,
        paddingLeft: 20,
        opacity: 0.8
    },
});

function mapStateToProp(state) {
    return ({
        me: state.authReducers.USER,
        allUser: state.authReducers.ALLUSER,
        userUid: state.authReducers.UID
    })
}
function mapDispatchToProp(dispatch) {
    return ({
        actions: bindActionCreators({
            addEmail
        }, dispatch)
    })
}

export default connect(mapStateToProp, mapDispatchToProp)(InviteCode);

