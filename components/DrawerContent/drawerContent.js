import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
    Image,
    TouchableOpacity,
} from 'react-native';
import BackIcon from '../../assets/back.png'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
// import { logout } from '../../store/action/action'
import { StackActions, NavigationActions } from 'react-navigation';
import HomeIcon from '../../assets/home-icon.png'
// import Icon from '../../assets/person-dummy.jpg'
import IconFont from 'react-native-vector-icons/FontAwesome'
import { Icon } from 'react-native-elements'
import ServiceIcon from '../../assets/services.png'


class DrawerContent extends Component {
    constructor() {
        super()

        this.state = {
            data: null
        }
    }

    closeDrawer() {
        this.props.navigation.closeDrawer()

    }

    componentDidMount() {
        console.log('componentDid Mount')
        if (this.props.user) {
            this.setState({ data: this.props.user })
        }
    }

    componentWillReceiveProps(props) {
        if (props.user) {
            this.setState({ data: props.user })
        }
    }

    addServices() {
        this.props.navigation.navigate('Services')
    }

    Home() {
        this.props.navigation.navigate('Home')
    }

    Logout() {
        const { logout } = this.props.actions

        logout().then(() => {
            const resetToHome = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'SignIn' }),
                ],
            });
            this.props.navigation.dispatch(resetToHome)
        })
    }

    notification() {
        this.props.navigation.navigate('notification')

    }

    MyProfile() {
        this.props.navigation.navigate('MyProfile')
    }

    messages() {
        this.props.navigation.navigate('Messages')
    }

    contact() {
        this.props.navigation.navigate('Contact')
    }

    render() {
        const { data } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.backIcon}>
                    <TouchableOpacity onPress={() => this.closeDrawer()}>
                        <Image
                            style={styles.ImageIcon}
                            source={BackIcon}
                        />
                    </TouchableOpacity>
                    <View style={styles.avatar}>
                        <Image
                            style={styles.avtr}
                            source={data ? { uri: data && data.profilePic } : Icon}
                        />
                    </View>
                    <View style={styles.name}>
                        <Text style={{ fontSize: 18, color: "white", fontWeight: '500' }}>
                            {
                                data &&
                                data.name
                            }
                        </Text>
                    </View>
                </View>
                <View style={styles.drawerRoutes}>
                    <TouchableOpacity onPress={() => this.Home()}>
                        <View style={styles.RouteName}>
                            <View style={{ alignSelf: 'center', marginRight: 10 }}>
                                <Image
                                    style={styles.drawerIcons}
                                    source={HomeIcon}
                                />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'grey' }}>
                                    Home
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.addServices()}>
                        <View style={styles.RouteName}>
                            <View style={{ alignSelf: 'center', marginRight: 10 }}>
                                <Image
                                    style={styles.drawerIcons}
                                    source={ServiceIcon}
                                />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'grey' }}>
                                    Add Services
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.MyProfile()}>
                        <View style={styles.RouteName}>
                            <View style={{ alignSelf: 'center', marginRight: 10 }}>
                                <Icon
                                    size={25}
                                    style={styles.drawerIcons}
                                    name={'settings'}
                                />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'grey' }}>
                                    Profile
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.contact()}>
                        <View style={styles.RouteName}>
                            <View style={{ alignSelf: 'center', marginRight: 10 }}>
                                <Icon
                                    size={25}
                                    style={styles.drawerIcons}
                                    name={'contacts'}
                                />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'grey' }}>
                                    Contact
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ borderWidth: 1, borderColor: 'lightgrey' }}>

                    </View>
                    <TouchableOpacity onPress={() => this.notification()}>
                        <View style={styles.RouteName}>
                            <View style={{ alignSelf: 'center', marginRight: 10 }}>
                                <Icon
                                    size={25}
                                    style={styles.drawerIcons}
                                    name={'notifications'}
                                />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'grey' }}>
                                    Notification
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.messages()}>
                        <View style={styles.RouteName}>
                            <View style={{ alignSelf: 'center', marginRight: 10 }}>
                                <Icon
                                    size={25}
                                    style={styles.drawerIcons}
                                    name={'chat'}
                                />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'grey' }}>
                                    Messages
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.Logout()}>
                        <View style={styles.RouteName}>
                            <View style={{ alignSelf: 'center', marginRight: 10 }}>
                                <Icon
                                    size={25}
                                    style={styles.drawerIcons}
                                    name={'lock'}
                                />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'grey' }}>
                                    Logout
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    drawerIcons: {
        width: 30,
        height: 30,
    },
    avatar: {
        paddingTop: 5,
        width: '100%',
        backgroundColor: '#075e54',
    },
    avtr: {
        // borderWidth: 1,
        width: 100,
        height: 100,
        marginLeft: 20,
        borderRadius: 50
    },
    RouteName: {
        flexDirection: 'row',
        // borderWidth: 2,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    drawerRoutes: {
        // flex: 1,
        width: '100%',
        paddingVertical: 10
        // borderWidth: 2,
    },
    name: {
        paddingVertical: 15,
        paddingHorizontal: 17,
        // borderWidth: 2,
        width: '100%',
        backgroundColor: '#075e54',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    ImageIcon: {
        width: 25,
        height: 40,
        marginRight: 20,
        marginVertical: 15
    },
    backIcon: {
        width: '100%',
        // height: 40,
        backgroundColor: '#075e54',
        alignItems: 'flex-end',
    }
});

function mapStateToProps(state) {
    return ({
        user: state.authReducers.USER,
    })
}

function mapDispatchToProps(dispatch) {
    return ({
        actions: bindActionCreators({
            // logout
        }, dispatch)
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);

// export default DrawerContent;