import { StyleSheet, Text, View} from 'react-native';

export default function Button({ title='', theme={}, onPress, style={} }:any){
    return (
        <Text onPress={onPress} style={{...cstyle(theme).button, ...style}}>{title}</Text>
    )
}

const cstyle = (theme:any) => {
    return StyleSheet.create({
        container: {
        },
        button: {
            backgroundColor: theme.primary,
            padding: 10,
            alignContent: 'center',
            color: theme.text,
            margin: 10,
            borderRadius: 5,
        },
    });
}