import React from 'react';
import { View, ScrollView, Image, Text, TextInput, StyleSheet, Button, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import firebase from '../../config/Firebase';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Dimensions, Linking, Platform, AppState } from 'react-native';
import { Input, Header, Divider } from 'react-native-elements';
import { Constants, Location, Permissions, Notifications, IntentLauncherAndroid } from 'expo';
import { bindActionCreators } from 'redux';
import { addMyData, expoToken } from '../../Store/actions/authAction'
import Container from '../../container/Container';
import Dropdown from '../../component/dropdown/Dropdown'
import MarkerImage from '../../../assets/Map-Marker.png'
import Icons from '../../../assets/person-dummy.jpg'
const { width, height } = Dimensions.get('window');
import moment from "moment";
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import Leave from '../../../assets/leave.png'
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

async function getToken() {
    // Remote notifications do not work in simulators, only on device
    let { status } = await Permissions.askAsync(
        Permissions.NOTIFICATIONS,
    );
    if (status !== 'granted') {
        return;
    }
    var value = await Notifications.getExpoPushTokenAsync();

    return value
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dropDown: false,
            isLocationModalVisible: false,
            appState: AppState.currentState,
            get: false,
            group: '',
            currentLocation: {
                lat: 0,
                lng: 0
            },
            options: {
                timeInterval: 5000,
            },
            latitude: null,
            longitude: null,
            error: null,
        };
    }

    handleNotification = ({ origin, data }) => {
        console.log(
            `Push notification ${origin} with data: ${(data)}`,
        );
    };

    location = (location) => {
    }

    componentWillMount() {
        if (!Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
    }

    componentDidMount() {
        const { options } = this.state
        const { circles, flag, userUid } = this.props
        if (!Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
        if (userUid) {
            getToken().then((res) => {
                const { expoToken } = this.props.actions
                console.log(res, 'res expo token')
                expoToken(res, userUid)
            })
            this.listener = Notifications.addListener(this.handleNotification);
        }

        if (circles && circles.length) {
            var arr = []
            var count = 0
            console.log(circles, 'circles here')
            // this.setState({ circles })
            circles.map((items) => {
                if (items.data.userUid === userUid) {
                    count = count + 1
                    arr.push(items.data)
                    this.setState({ circleNum: count, circles: arr })
                } else {
                    if (items.data.members && items.data.members.length && items.data.members.indexOf(userUid) !== -1) {
                        count = count + 1
                        arr.push(items.data)
                        this.setState({ circleNum: count, circles: arr })
                    }
                }
            })
        }

    }

    componentWillUnmount() {
        // AppState.removeEventListener('change', this._handleAppStateChange);
        navigator.geolocation.clearWatch(this.watchId);
    }

    componentWillReceiveProps(props) {
        const { circles, flag, userUid } = props

        if (circles && circles.length) {
            var arr = []
            var count = 0
            console.log(circles, 'circles here')
            // this.setState({ circles })
            circles.map((items) => {
                if (items.data.userUid === userUid) {
                    count = count + 1
                    arr.push(items.data)
                    this.setState({ circleNum: count, circles: arr })
                } else {
                    if (items.data.members && items.data.members.length && items.data.members.indexOf(userUid) !== -1) {
                        count = count + 1
                        arr.push(items.data)
                        this.setState({ circleNum: count, circles: arr })
                    }
                }
            })
        }
        if (userUid) {
            getToken().then((res) => {
                const { expoToken } = this.props.actions

                expoToken(res, userUid)
            })
            this.listener = Notifications.addListener(this.handleNotification);
        }
    }

    _getLocationAsync = async () => {
        const { uid } = this.state
        const { me, userUid } = this.props;
        // try {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
            console.log("permission not granted ")

        }
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                console.log(position, 'position watch')
                let address = Promise.resolve(Location.reverseGeocodeAsync(position.coords))

                address.then((value) => {
                    let arr = value.map(name => {
                        var obj = {
                            direction: {
                                country: name.country,
                                city: name.city,
                                address: name.name,
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                time: position.timestamp
                            },
                        }
                        const { addMyData } = this.props.actions
                        addMyData(obj, userUid)
                    })
                })
                this.setState({
                    position,
                    currentLocation: { lat: position.coords.latitude, lng: position.coords.longitude },
                    error: null,
                    // isLocationModalVisible: false,
                    get: true
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 2000, maximumAge: 0, distanceFilter: 1 },

        );
        // } catch (error) {
        //     let status = Location.getProviderStatusAsync()
        //     if (!status.LocationServicesEnabled) {
        //         this.setState({ isLocationModalVisible: true })
        //     }
        // }


    };

    static navigationOptions = { header: null }

    addCircle() {
        const { navigate } = this.props.navigation

        navigate('AddCircle')
        this.setState({ dropDown: false })
    }

    showDropDown() {
        const { dropDown } = this.state
        this.setState({ dropDown: !dropDown })
    }

    goInvite(items) {
        const { navigate } = this.props.navigation
        const data = items
        navigate('Invite', { data })

        this.setState({ dropDown: false })

    }

    updateLocation(change) {
        console.log(change, 'my chage')
    }

    openMenu() {
        this.props.navigation.openDrawer()
    }

    getDirection(item) {
        const { allUser } = this.props
        if (allUser) {
            var arr = []
            var count = 0
            allUser.map((users, index) => {
                count++
                if (item.members.indexOf(users.UID) !== -1) {
                    // console.log(users, 'users here get dir')
                    arr.push(users)
                    this.setState({ markersMember: arr })
                }
                else if (users.UID === item.userUid) {
                    // console.log(users,'admin marker ')
                    this.setState({ markersAdmin: users })
                }
                if (count === index) {
                }
            })
        }
        this.setState({ dropDown: false, group: item.circleName })
    }

    markerMem(item, index) {
        const direction = item.direction
        return (
            <MapView.Marker
                key={index}
                coordinate={{
                    latitude: direction.latitude,
                    longitude: direction.longitude,
                }}
                title={item.name}
            >
                <View style={[styles.marker, { position: 'relative' }]}>
                    <TouchableOpacity onPress={() => console.log('pressed')}>
                        <Image
                            source={MarkerImage}
                        />
                        <View style={{
                            width: 55,
                            height: 56,
                            borderRadius: 50,
                            overflow: 'hidden',
                            position: 'absolute',
                            top: 5,
                            right: 3
                        }}>
                            <Image
                                style={{ width: '100%', height: '100%' }}
                                source={item && { uri: item.profilePic }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </MapView.Marker >

        )
    }

    openSetting = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:')
        } else {
            IntentLauncherAndroid.startActivityAsync(
                IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
            )
        }
        this.setState({ openSetting: false })
    }

    markerAdmin(item, index) {
        console.log(item, 'itttttttttt')
        return (
            <MapView.Marker
                key={index}
                title={item.name}
                coordinate={{
                    latitude: item.direction.latitude,
                    longitude: item.direction.longitude,
                }}
            >
                <View style={[styles.marker, { position: 'relative' }]}>
                    <TouchableOpacity onPress={() => console.log('pressed')}>
                        <Image
                            source={MarkerImage}
                        />
                        <View style={{
                            width: 55,
                            height: 56,
                            borderRadius: 50,
                            overflow: 'hidden',
                            position: 'absolute',
                            top: 5,
                            right: 3
                        }}>
                            <Image
                                style={{ width: '100%', height: '100%' }}
                                source={item && item.profilePic ? { uri: item.profilePic } : Icons}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </MapView.Marker >

        )
    }

    showDetails(item) {
        // const direction = {
        //     latitude: item.direction.latitude,
        //     longitude: item.direction.longitude,
        //     time: item.direction.time,
        //     address: item.direction.address,
        //     country: item.direction.country,
        //     city: item.direction.city,
        // }
        // this.setState({
        //     markersAdmin: {
        //         direction,
        //         profilePic: item.profilePic,
        //         name: item.name
        //     }
        // })
    }

    listMember(item, index) {
        return (
            <TouchableOpacity onPress={() => this.showDetails(item)}>
                <View key={index} style={styles.message}>
                    <View style={styles.ImageDiv}>
                        <Image
                            style={{ width: '100%', height: '100%' }}
                            // source={items.displayPic ? { uri: items.displayPic } : Icons}
                            source={item && item.profilePic ? { uri: item.profilePic } : Icons}
                        />
                    </View>
                    <View style={styles.name}>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Text style={{ fontSize: 13, fontWeight: '400', color: 'grey' }}>
                                {item.name}
                            </Text>
                        </View>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Text style={{
                                width: 160,
                                fontSize: 14,
                                fontWeight: '300',
                                color: 'black',

                            }}>
                                {`${item.direction.address}, ${item.direction.city}, ${item.direction.country}`}
                            </Text>
                        </View>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Text style={{ fontSize: 11, fontWeight: '300', color: 'grey' }}>
                                {` Last tracked ${moment(new Date(item.direction.time)).fromNow()}`}
                            </Text>
                        </View>
                    </View>
                    <View style={{ alignSelf: 'center', marginHorizontal: 2 }}>
                        <TouchableOpacity style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                        }}>
                            <Icon
                                size={25}
                                color={'grey'}
                                name={'message'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignSelf: 'center', marginHorizontal: 2 }}>
                        <TouchableOpacity style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                        }}>
                            <Image
                                style={{ width: 25, height: 25 }}
                                source={Leave}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    render() {
        const { get, currentLocation, user, dropDown, circles, markersAdmin, markersMember, isLocationModalVisible, group, openSetting } = this.state
        const items = {
            direction: {
                latitude: currentLocation.lat,
                longitude: currentLocation.lng
            }
        }
        return (
            <Container openDrawer={() => this.openMenu()} showDropDown={() => this.showDropDown()} addCircle={() => this.addCircle()} title={group ? group : `Circles(${circles && circles.length ? circles.length : 0})`} rightIcon={true}>
                <View style={{ flex: 1 }}>
                    {
                        get ?
                            < MapView
                                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                style={styles.map}
                                onUserLocationChange={(change) => this.updateLocation(change)}
                                region={{
                                    latitude: markersAdmin ? markersAdmin.direction && markersAdmin.direction.latitude : currentLocation.lat,
                                    longitude: markersAdmin ? markersAdmin.direction && markersAdmin.direction.longitude : currentLocation.lng,
                                    latitudeDelta: LATITUDE_DELTA,
                                    longitudeDelta: LONGITUDE_DELTA,
                                }}
                            >
                                {
                                    !markersAdmin &&
                                    !markersMember &&
                                    this.markerAdmin(items, 0)
                                }
                                {
                                    markersAdmin &&
                                    this.markerAdmin(markersAdmin, 0)
                                }
                                {
                                    markersMember &&
                                    markersMember.map((items, index) => {
                                        return this.markerMem(items, index)
                                    })
                                }
                            </MapView >
                            :
                            <View style={styles.container}>
                                <Text style={{ fontSize: 18, fontWeight: '700', }} >Location Not Available!</Text>
                            </View>
                    }
                    {
                        dropDown &&
                        <View style={styles.DropDown}>
                            <Dropdown getDirection={(items) => this.getDirection(items)} myCircles={circles} addCircle={() => this.addCircle()} goInvite={(items) => this.goInvite(items)} />
                        </View>
                    }
                </View>
                <TouchableOpacity>
                    <View style={{ width: '100%', paddingVertical: 5 }}>
                        <View style={{ width: '10%', borderWidth: 1, borderColor: '#075e54', alignSelf: 'center' }}>

                        </View>
                    </View>
                </TouchableOpacity>
                {
                    markersMember &&
                    <ScrollView style={styles.scroll}>
                        {
                            markersAdmin &&
                            this.listMember(markersAdmin, 0)
                        }
                        {
                            markersMember.map((items, index) => {
                                return this.listMember(items, index)
                            })
                        }
                    </ScrollView>
                }

            </Container >
        );
    }
}

const styles = StyleSheet.create({
    nameDetail: {
        borderWidth: 1
    },
    DropDown: {
        position: 'absolute',
        top: 0
    },
    scroll: {
        minHeight: 60,
        maxHeight: 170,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    marker: {
    },
    message: {
        flexDirection: 'row',
        borderTopColor: 'grey',
        borderTopWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 5,
    },
    name: {
        flexGrow: 1,
        // borderWidth: 1,
        alignSelf: 'center',
        paddingHorizontal: 10
    },
    ImageDiv: {
        width: 50,
        height: 50,
        overflow: 'hidden',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#075e54',
        alignSelf: 'center'
    },
});

function mapStateToProp(state) {
    return ({
        user: state.authReducers.USER,
        allUser: state.authReducers.ALLUSER,
        userUid: state.authReducers.UID,
        circles: state.authReducers.CIRCLES,
        modifyCircle: state.authReducers.MODIFYCIRCLE,
        flag: state.authReducers.FLAG,
    })
}
function mapDispatchToProp(dispatch) {
    return ({
        actions: bindActionCreators({
            addMyData, expoToken
        }, dispatch)
    })
}

export default connect(mapStateToProp, mapDispatchToProp)(Home);

