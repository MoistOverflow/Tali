import { StyleSheet, Text, TouchableOpacity} from 'react-native';

export default function Button({ title='', theme={}, onPress, style={} }:any){
    return (
        <TouchableOpacity onPress={onPress} style={{...cstyle(theme).button, ...style}}>
            <Text style={cstyle(theme).text}>{title}</Text>
        </TouchableOpacity>
    )
}

const cstyle = (theme:any) => {
    return StyleSheet.create({
        button: {
            backgroundColor: theme.primary,
            padding: 10,
            alignContent: 'center',
            textAlign: 'center',
            justifyContent: 'center',
            color: theme.text,
            margin: 10,
            borderRadius: 5,
        },
        text: {
            color: theme.text,
        },
    });
}