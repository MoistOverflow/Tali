import { StyleSheet, Text, View, Modal, Alert} from 'react-native';
import Button from '../components/Button';
import { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import db from '../lib/client';
import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
const { StorageAccessFramework } = FileSystem;



export default function Settings({theme, changeTheme, themeMode, clearAll, resyncData}:any){
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

    const handleExport = async () => {
        const dataToExport = await db.fileExport()
        const data = JSON.stringify(dataToExport);
        // export dataToExport in json format to a file using react-native-fs
        if (Platform.OS === 'android') {
            const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                // Gets SAF URI from response
                const uri = permissions.directoryUri;
                // Writes file to SAF URI
                await StorageAccessFramework.createFileAsync(uri, 'tali', 'application/json').then(async (fileUri) => {
                    await  StorageAccessFramework.writeAsStringAsync(fileUri, data, { encoding: FileSystem.EncodingType.UTF8 }).catch((err) => console.log(err))
                })
            }
        }
    };

    const handleImport = async () => {
        StorageAccessFramework.requestDirectoryPermissionsAsync().then(async (permissions) => {
            if (permissions.granted) {
                const uri = permissions.directoryUri;
                const fileUri = await StorageAccessFramework.readDirectoryAsync(uri).then((res) => {
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].endsWith('tali.json')) {
                            return res[i];
                        }
                    }
                })
                if (fileUri) {
                    const data = await StorageAccessFramework.readAsStringAsync(fileUri).then((res) => res);
                    const dataToImport = JSON.parse(data);
                    const res = await db.fileImport(dataToImport);
                    if (res) {
                        resyncData();
                    } else {
                        Alert.alert('Error importing data', 'File seems to be corrupted');
                        clearAll();
                    }
                }
            }
        })
    }


    useEffect(() => {changeTheme(value)}, [value]);


    return (
        <View style={st.container}>
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
            <View style={st.row}>
                <Text style={st.droptext}>Choose Theme: </Text>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={st.dropdown}
                    theme={theme.dropDown}
                />
            </View>
            <View style={{...st.row, zIndex:0}}>
                <Button theme={theme} title="Export Data" onPress={handleExport} style={{padding:30, flex:1}}/>
                <Button theme={theme} title="Import Data" onPress={handleImport} style={{padding:30, flex:1}}/>
            </View>
            <View style={{...st.row, zIndex:0}}>
                <Button theme={theme} title="Delete All Data" onPress={() => setDeleteAllModal(true)} style={{width:'100%'}}/>
            </View>
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
            margin: 20,
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