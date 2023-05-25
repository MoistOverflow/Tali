import { StyleSheet, Text, View, Button} from 'react-native';

export default function Settings({theme, changeTheme}:any){
    return (
        <View style={style(theme).container}>
            <Text style={style(theme).text}>This is settings</Text>
            <Text onPress={changeTheme} style={style(theme).button}>change theme</Text>
        </View>
    )
}

const style = (theme:any) => {
    return StyleSheet.create({
        container: {
        },
        button: {
            backgroundColor: theme.primary,
            padding: 10,
            alignContent: 'center',
            color: theme.text,
            width: 120,
            margin: 10,
            borderRadius: 5,
        },
        text: {
            color: theme.text,
        }
    });
}