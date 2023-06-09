import { StyleSheet, Text, View} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Link } from "react-router-native";

export default function TitleBar({ title='', theme={} , showBack="", setShowBack, setTitle }:any){
    const st = style(theme);

    const handleBack = () =>{
        setTitle(showBack)
        setShowBack("")
    }

    return (
        <View style={style(theme).container}>
            {showBack ? <Link onPress={handleBack} to={`/${showBack}`}><Text style={st.back}><Ionicons name="chevron-back" size={16} />{showBack}</Text></Link> : null}
            <Text style={st.title}>{title}</Text>
            {showBack ? <View><Text style={{...st.back, ...st.hidden}}><Ionicons name="chevron-back" size={16} />{showBack}</Text></View> : null}
        </View>
    )
}

const style = (theme:any) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            backgroundColor: theme.background,
            alignItems: 'center',
            marginBottom: 20,
            paddingTop: 40,
            paddingBottom: 10,
            shadowColor: '#52006A',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 20,
            flexDirection: 'row',
        },
        title: {
            color: theme.text,
            fontWeight: 'bold',
            fontSize: 20,
            textAlign: 'center',
            flex: 1,
            textTransform: 'capitalize',
        },
        back: {
            marginTop: 6,
            color: theme.text,
            fontSize: 16,
            fontWeight: '400',
            textAlign: 'left',
            marginLeft:0,
            marginRight:0,
            padding: 0,
            flex: 1,
        },
        hidden: {
            opacity: 0,
        },
    });
}