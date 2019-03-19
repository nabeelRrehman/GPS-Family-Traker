import {
    createStackNavigator,
    createDrawerNavigator,
    createAppContainer,
} from 'react-navigation';
import LogIn from '../src/screens/login/authentication'
import Home from '../src/screens/dashboard/dashboard'
import AddCircle from '../src/screens/addCircle/AddCircle';
import Invite from '../src/screens/invite/Invite';
import InviteCode from '../src/screens/inviteCode/InviteCode';
import JoinCode from '../src/screens/joinCode/JoinCode';
import DrawerContent from '../components/DrawerContent/drawerContent'

const StackNavigator = createStackNavigator({
    LogIn: { screen: LogIn },
    Home: { screen: Home },
    AddCircle: { screen: AddCircle },
    Invite: { screen: Invite },
    InviteCode: { screen: InviteCode },
    JoinCode: { screen: JoinCode },
}, {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
            drawerLockMode: 'locked-closed'
        },
    });

const DrawerNavigator = createDrawerNavigator({
    Home: {
        screen: StackNavigator
    },
},
    {
        drawerPosition: 'left',
        initialRouteName: 'Home',
        drawerWidth: 250,
        // drawerBackgroundColor: 'blue'
        contentComponent: DrawerContent,
        // drawerLockMode: 'locked-open'
    }
)

const Navigation = createAppContainer(DrawerNavigator)
export default Navigation;