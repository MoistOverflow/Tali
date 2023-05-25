import { StyleSheet, Text, View} from 'react-native';
import Button from '../components/Button';

export default function Settings({theme, changeTheme}:any){
    return (
        <View style={style(theme).container}>
            <Text style={style(theme).text}>This is settings</Text>
            <Button title="Change Theme" theme={theme}  onPress={changeTheme} eStyle={{}}/>
        </View>
    )
}

const style = (theme:any) => {
    return StyleSheet.create({
        container: {
        },
        text: {
            color: theme.text,
        }
    });
}