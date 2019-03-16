import React from 'react';
import { View, ScrollView, Image, Text, TextInput, StyleSheet, Button, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Header, Divider } from 'react-native-elements';
import { Constants, Location, Permissions, Contacts } from 'expo';
import Container from '../../container/Container';
import { bindActionCreators } from 'redux';
import { leaveCircle, deleteCircle } from '../../Store/actions/authAction'
import Icons from '../../../assets/person-dummy.jpg'
import Leave from '../../../assets/leave.png'


class Invite extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        const { getParam } = this.props.navigation
        const { allUser } = this.props
        const data = getParam('data')
        console.log(data, 'datat ahsdjsjh')
        this.setState({ data })

        if (allUser) {
            var arr = []
            allUser.map((items) => {
                if (items.UID === data.userUid) {
                    this.setState({ admin: items })
                }
            })

            allUser.map((items) => {
                if (data.members.indexOf(items.UID) !== -1) {
                    arr.push(items)
                    this.setState({ members: arr })
                }
            })
        }

    }

    componentWillReceiveProps(props) {
        const { getParam } = props.navigation
        const { allUser } = props
        const data = getParam('data')
        console.log(data, 'datat ahsdjsjh')
        this.setState({ data })

        if (allUser) {
            var arr = []
            allUser.map((items) => {
                if (items.UID === data.userUid) {
                    this.setState({ admin: items })
                }
            })

            allUser.map((items) => {
                if (data.members.indexOf(items.UID) !== -1) {
                    arr.push(items)
                    this.setState({ members: arr })
                }
            })
        }

    }

    goback() {
        this.props.navigation.dispatch(NavigationActions.back())
    }

    leaveGroup(item) {
        const { leaveCircle } = this.props.actions
        const { data, members } = this.state

        leaveCircle(item.UID, data.joinCode).then(() => {
            if (members) {
                members.map((member, index) => {
                    if (member.UID === item.UID) {
                        members.splice(index, 1)
                        this.setState({ members })
                        const { navigate } = this.props.navigation

                        navigate('Home')
                    }
                })
            }
        })
    }

    deleteAdmin() {
        const { data } = this.state
        const { deleteCircle } = this.props.actions

        deleteCircle(data.joinCode).then(() => {
            const { navigate } = this.props.navigation
            const { circles } = this.props

            // circles.map((item, index) => {
            //     if (item.data.joinCode === data.joinCode) {
            //         console.log(item,'aksjdkjabdk')
            //         circles.splice(index, 1)
            //     }
            // })
            navigate('Home')
        })
    }

    member(items) {
        const { userUid } = this.props
        return (
            <TouchableOpacity>
                <View style={styles.message}>
                    <View style={styles.ImageDiv}>
                        <Image
                            style={{ width: '100%', height: '100%' }}
                            // source={items.displayPic ? { uri: items.displayPic } : Icons}
                            source={items && items.profilePic ? { uri: items.profilePic } : Icons}
                        />
                    </View>
                    <View style={styles.name}>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Text style={{ fontSize: 20, fontWeight: '600', color: 'black' }}>
                                {items && items.name}
                            </Text>
                            {
                                items && items.UID === userUid &&
                                <Text style={{ fontSize: 20, fontWeight: '600', color: 'black' }}>
                                    {items && items.UID === userUid && ' (You)'}
                                </Text>
                            }
                        </View>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Text style={{ fontSize: 13, marginLeft: 5, fontWeight: '300', color: 'grey' }}>
                                {'Member'}
                            </Text>
                        </View>
                    </View>
                    {
                        items && items.UID === userUid &&
                        <View style={{ alignSelf: 'center' }}>
                            <TouchableOpacity style={{
                                paddingVertical: 10,
                                paddingHorizontal: 10,
                            }} onPress={() => this.leaveGroup(items)}>
                                <Image
                                    style={{ width: 25, height: 25 }}
                                    source={Leave}
                                />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </TouchableOpacity>
        )
    }

    admin() {
        const { admin } = this.state
        const { userUid } = this.props
        return (
            <TouchableOpacity>
                <View style={[styles.message, { borderBottomColor: '#075e54', borderBottomWidth: 2 }]}>
                    <View style={styles.ImageDiv}>
                        <Image
                            style={{ width: '100%', height: '100%' }}
                            // source={items.displayPic ? { uri: items.displayPic } : Icons}
                            source={admin && admin.profilePic ? { uri: admin.profilePic } : Icons}
                        />
                    </View>
                    <View style={styles.name}>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Text style={{ fontSize: 20, fontWeight: '600', color: 'black' }}>
                                {admin && admin.name}
                            </Text>
                            {
                                admin && admin.UID === userUid &&
                                <Text style={{ fontSize: 20, fontWeight: '600', color: 'black' }}>
                                    {admin && admin.UID === userUid && ' (You)'}
                                </Text>
                            }
                        </View>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Icon
                                size={15}
                                name={'star'}
                                color={'pink'}
                            />
                            <Text style={{ fontSize: 13, marginLeft: 5, fontWeight: '300', color: 'pink' }}>
                                {'Circle Owner'}
                            </Text>
                        </View>
                    </View>
                    {
                        admin && admin.UID === userUid &&
                        <View style={{ alignSelf: 'center' }}>
                            <TouchableOpacity style={{
                                paddingVertical: 10,
                                paddingHorizontal: 10,
                            }} onPress={() => this.deleteAdmin()}>
                                <Icon name={'trash'} color={'red'} size={20} />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </TouchableOpacity>
        )
    }

    goInvite() {
        const { navigate } = this.props.navigation
        const { data } = this.state
        navigate('InviteCode', { data })
    }

    render() {
        const { admin, data, members } = this.state
        return (
            <Container center={false} right={false} back={true} title={data && data.circleName} goback={() => this.goback()}>
                <ScrollView >
                    <View style={{ flexGrow: 1 }}>
                        {
                            admin &&
                            this.admin()
                        }
                        {
                            members ?
                                members.map((item) => {
                                    return this.member(item)

                                })
                                :
                                <View style={{ alignSelf: 'center' }}>
                                    <Text style={{ color: 'grey', fontSize: 14, marginTop: 10 }}>
                                        no members
                                    </Text>
                                </View>
                        }
                    </View>
                </ScrollView>
                <View style={styles.inviteMember}>
                    <TouchableOpacity onPress={() => this.goInvite()} style={styles.container}>
                        <View style={{
                            flexDirection: 'row',
                            alignSelf: 'center',
                            backgroundColor: '#075e54'
                        }}
                        >
                            <Icon
                                size={18}
                                name={'plus'}
                                color={'white'}
                            />
                            <Text style={{ marginLeft: 5, color: 'white' }}>
                                Invite A Member
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    inviteMember: {
        width: '100%',
        paddingVertical: 15,
        alignItems: 'center'
    },
    message: {
        flexDirection: 'row',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 5
    },
    forward: {
        // borderWidth: 1,
        paddingHorizontal: 10,
        // alignItems: 'center',
        alignSelf: 'center',
    },
    name: {
        flexGrow: 1,
        // borderWidth: 1,
        alignSelf: 'center',
        paddingHorizontal: 10
    },
    ImageDiv: {
        width: 70,
        height: 70,
        overflow: 'hidden',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#075e54'
    },
    container: {
        borderWidth: 1,
        backgroundColor: '#075e54',
        alignItems: 'center',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: '50%',
        justifyContent: 'center',
    },
});

function mapStateToProp(state) {
    return ({
        me: state.authReducers.USER,
        allUser: state.authReducers.ALLUSER,
        userUid: state.authReducers.UID,
        circles: state.authReducers.CIRCLES,
    })
}
function mapDispatchToProp(dispatch) {
    return ({
        actions: bindActionCreators({
            leaveCircle, deleteCircle
        }, dispatch)
    })
}

export default connect(mapStateToProp, mapDispatchToProp)(Invite);

