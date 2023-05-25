import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import {darkTheme} from '../lib/theme';
import { color } from '@rneui/themed/dist/config';


export default function Home({theme}:any){
    return (
        <View style={style(theme).container}>
            <Text style={style(theme).text}>This is home</Text>
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