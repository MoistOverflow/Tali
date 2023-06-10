import { StyleSheet, Text, View, Modal} from 'react-native';
import Button from '../components/Button';
import { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import db from '../lib/client';


export default function Settings({theme, changeTheme, themeMode, clearAll}:any){
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(themeMode);
    const [items, setItems] = useState([
        {label: 'System', value: 'auto'},
        {label: 'Light', value: 'light'},
        {label: 'Dark', value: 'dark'},
        {label: 'Solorized Dark', value: 'solorizedDark'},
        {label: "OLED", value: 'oled'}
    ]);
    const [deleteAllModal, setDeleteAllModal] = useState(false);

    const st = style(theme);

    const test = async () => {
        //const res = await db.from('test').insert({test: 'test'});
        const res2 = await db.from('test').update({row: 'updated again'}).eq({'id': 1});
        console.log(res2);
        //const data = await AsyncStorage.getItem('test');
        const data = await db.from('test').select().eq();
        //console.log(data);
    }


    useEffect(() => {changeTheme(value)}, [value]);


    return (
        <View style={style(theme).container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteAllModal}
            >
                <View style={st.centeredView}>
                    <View style={st.modalView}>
                        <View style={st.modalContainer}>
                            <Text style={{...st.text, margin: 10}}>Are you sure you want to delete all data?</Text>
                            <View style={st.modalButtons}>
                                <Button theme={theme} title="No" onPress={() => setDeleteAllModal(false)} style={{padding:30}}/>
                                <Button theme={theme} title="Yes" onPress={() => {clearAll();setDeleteAllModal(false)}}  style={{backgroundColor: theme.danger, padding:30}}/>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={style(theme).row}>
                <Text style={style(theme).droptext}>Choose Theme: </Text>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={style(theme).dropdown}
                    theme={theme.dropDown}
                />
            </View>
            <Button title="clear all" theme={theme} onPress={()=>setDeleteAllModal(true)}/>
            <Button title="test" theme={theme} onPress={test}/>
        </View>
    )
}

const style = (theme:any) => {
    return StyleSheet.create({
        container: {
            width: '100%',
        },
        droptext: {
            color: theme.text,
            width: '40%',
            marginLeft: '20%',
            padding: 10,
        },
        text: {
            color: theme.text,
        },
        dropdown: {
            backgroundColor: theme.primary,
            color: theme.text,
            width: '35%',
            zIndex: 100,
        },
        row: {
            flexDirection: 'row',
            zIndex: 100,
        },
        centeredView: {
            flex: 1,
            marginTop: 200,
        },
        modalView: {
            margin: 20,
            backgroundColor: theme.background,
            borderRadius: 20,
            width: '90%',
            height: 200,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        modalContainer: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '100%',
        },
    });
}