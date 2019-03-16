import React from 'react';
import { View, ScrollView, Image, Text, TextInput, StyleSheet, Button, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Header, Divider } from 'react-native-elements';
import { Constants, Location, Permissions, Contacts } from 'expo';
// import { bindActionCreators } from 'redux';
// import { addMyData } from '../../Store/actions/authAction'


class DropdownView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    invite(items) {
        const { goInvite } = this.props

        goInvite(items)
    }

    componentDidMount() {
        const { myCircles } = this.props

        if (myCircles) {
            this.setState({ myCircles })
        }
    }

    componentWillReceiveProps(props) {
        const { myCircles } = props

        if (myCircles) {
            this.setState({ myCircles })
        }
    }

    getDirection(items) {
        const { getDirection } = this.props

        getDirection(items)
    }

    dropdown(items, index) {
        return (
            <View key={index} style={styles.container}>
                <TouchableOpacity style={{ width: '15%', alignItems: 'center', paddingVertical: 13 }}>
                    <View >
                        <Icon
                            size={20}
                            name={'user'}
                            color={'grey'}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.getDirection(items)} style={{ width: '70%', paddingHorizontal: 10, paddingVertical: 13 }}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>
                            {items && items.circleName}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.invite(items)} style={{ width: '15%', alignItems: 'center', paddingVertical: 13 }}>
                    <View>
                        <Icon
                            size={20}
                            name={'cog'}
                            color={'grey'}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const { myCircles } = this.state
        return (
            <View style={{
                shadowOffset: {
                    width: 3,
                    height: 3,
                },
                shadowOpacity: 1.51,
                shadowRadius: 4.16,
                elevation: 5,
                shadowColor: 'grey',
                borderWidth: 1,
                backgroundColor: 'white'
            }}>
                <ScrollView style={styles.Scroll} contentContainerStyle={{
                }}>
                    {
                        myCircles ?
                            myCircles.map((items, index) => {
                                return this.dropdown(items, index)
                            })
                            :
                            <View style={styles.container}>
                                <Text style={{ textAlign: 'center', alignSelf: 'center' }}>
                                    No Circles
                                </Text>
                            </View>

                    }
                </ScrollView>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => this.props.addCircle()} style={{
                        width: '100%',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingVertical: 13
                    }}>
                        <View style={{ marginHorizontal: 10, borderWidth: 1, paddingVertical: 7, paddingHorizontal: 9, borderRadius: 50, backgroundColor: '#075e54' }}>
                            <Icon
                                size={20}
                                name={'plus'}
                                color={'white'}
                            />
                        </View>
                        <View style={{ flexGrow: 1, paddingHorizontal: 10, alignSelf: 'center', paddingVertical: 13 }}>
                            <Text style={{ fontSize: 17, fontWeight: '100' }}>
                                Create Circle
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    createCircle: {
        borderWidth: 1,
    },
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        backgroundColor: 'white'
    },
    Scroll: {
        // shadowOffset: {
        //     width: 3,
        //     height: 3,
        // },
        // shadowOpacity: 0.51,
        // shadowRadius: 4.16,
        // elevation: 5,
        // shadowColor: 'grey',
        // borderWidth: 1,
        minHeight: 60,
        maxHeight: 170,
    }
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
        // actions: bindActionCreators({
        //     addMyData
        // }, dispatch)
    })
}

export default connect(mapStateToProp, mapDispatchToProp)(DropdownView);

