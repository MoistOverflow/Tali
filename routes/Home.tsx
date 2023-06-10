import { StyleSheet, Text, View } from 'react-native';


export default function Home({theme}:any){
    const st = style(theme);


    return (
        <View style={st.container}>
            <View style={{...st.row, justifyContent: 'center'}}>
                <Text style={st.text}>NEWS FEED COMING SOON!</Text>
            </View>
        </View>
    )
}


const style = (theme:any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            marginBottom: 180,
            width: '100%',
        },
        text: {
            color: theme.text,
            opacity: 0.5,
        },
        row: {
            flexDirection: 'row',
        },
    });
}