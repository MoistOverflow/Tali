import { Link } from "react-router-native";
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons, FontAwesome5, Entypo, Ionicons } from '@expo/vector-icons';

export default function Navbar({theme}:any){
    return (
        <View style={style(theme).navabar}>
            <Link to="/" style={{flex: 1}}>
                <Text style={style(theme).navButton}><Entypo name="home" size={24} /></Text>
            </Link>
            <Link to='/movies' style={{flex: 1}}>
                <Text style={style(theme).navButton}><MaterialIcons name="movie" size={24} /></Text>
            </Link>
            <Link to='/shows' style={{flex: 1}}>
                <Text style={style(theme).navButton}><Entypo name="tv" size={24} /></Text>
            </Link>
            <Link to='/other' style={{flex: 1}}>
                <Text style={style(theme).navButton}><FontAwesome5 name="dice-d6" size={24} /></Text>
            </Link>
            <Link to='/settings' style={{flex: 1}}>
                <Text style={style(theme).navButton}><Ionicons name="settings" size={24} /></Text>
            </Link>
        </View>
    )
}


const style = (theme:any) => {
    return StyleSheet.create({
        container: {
        },
        text: {
            color: theme.text,
        },
        navabar: {
            marginTop: "auto",
            flexDirection: 'row',
            width: '100%',
        },
        navButton: {
            height: 60,
            textAlign: 'center',
            paddingTop: 20,
            paddingBottom: 10,
            color: theme.text,
            backgroundColor:theme.accent,
        },
    });
}