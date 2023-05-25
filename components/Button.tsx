import { StyleSheet, Text, View} from 'react-native';

export default function Button({ title='', theme={}, onPress, eStyle={} }:any){
    return (
        <Text onPress={onPress} style={{...style(theme).button, ...eStyle}}>{title}</Text>
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
            margin: 10,
            borderRadius: 5,
        },
    });
}