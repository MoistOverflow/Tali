import { StyleSheet, Text, View} from 'react-native';

export default function TitleBar({ title='', theme={} }:any){
    return (
        <View style={style(theme).container}>
            <Text style={style(theme).text}>{title}</Text>
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
        },
        text: {
            color: theme.text,
            fontWeight: 'bold',
            fontSize: 20,
        },
    });
}