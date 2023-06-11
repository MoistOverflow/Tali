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
            padding: 12,
            alignContent: 'center',
            textAlign: 'center',
            justifyContent: 'center',
            color: theme.text,
            margin: 5,
            borderRadius: 10,
        },
        text: {
            textAlign: 'center',
            color: theme.text,
        },
    });
}