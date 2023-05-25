import { StyleSheet, Text, View } from 'react-native';

export default function Movies({theme}:any){
    return (
        <View style={style(theme).container}>
            <Text style={style(theme).text}>This is movie</Text>
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