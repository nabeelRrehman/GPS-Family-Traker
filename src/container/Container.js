import React from 'react';
import { View, ScrollView, Image, Text, TextInput, StyleSheet, Button, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import { Input, Header, Divider } from 'react-native-elements';
import { DrawerActions } from 'react-navigation';
import { Constants, Location, Permissions, Contacts } from 'expo';
// import { bindActionCreators } from 'redux';


class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    addCircle() {
        const { addCircle } = this.props

        addCircle()
    }

    goBack() {
        const { back, goback, openJoin } = this.props

        if (back) {
            goback()
        } else {
            openJoin()
        }

    }

    showDrop() {
        const { center } = this.props

        if (!center) {
            const { showDropDown } = this.props

            showDropDown()
        }
    }

    render() {
        const { children, left, center, right, back, title, rightIcon } = this.props
        return (
            <View style={styles.container}>
                <View>
                    <Header
                        containerStyle={{
                            backgroundColor: '#075e54',
                            justifyContent: 'space-around',
                        }}
                        leftComponent={!left ? { icon: back ? 'arrow-back' : 'menu', color: '#fff', onPress: () => this.goBack() } : null}
                        centerComponent={!center ? { text: title, style: { color: '#fff', fontSize: 20 }, onPress: () => this.showDrop() } : null}
                        rightComponent={!right ? { icon: rightIcon ? 'group-add' : null, color: '#fff', onPress: () => this.addCircle() } : null}
                    />
                </View>
                {
                    children
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    statusBar: {
        backgroundColor: "#075e54",
        height: Constants.statusBarHeight,
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
        // actions: bindActionCreators({
        //     addUser
        // }, dispatch)
    })
}

export default connect(mapStateToProp, mapDispatchToProp)(Container);

