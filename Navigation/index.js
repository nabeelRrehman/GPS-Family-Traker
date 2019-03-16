import { createStackNavigator, createAppContainer } from 'react-navigation';
import LogIn from '../src/screens/login/authentication'
import Home from '../src/screens/dashboard/dashboard'
import AddCircle from '../src/screens/addCircle/AddCircle';
import Invite from '../src/screens/invite/Invite';
import InviteCode from '../src/screens/inviteCode/InviteCode';
import JoinCode from '../src/screens/joinCode/JoinCode';


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



const Navigation = createAppContainer(StackNavigator)
export default Navigation;