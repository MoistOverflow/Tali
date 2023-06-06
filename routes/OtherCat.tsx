import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, Switch} from 'react-native';
import { useEffect, useState } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Link } from "react-router-native";
import db from '../lib/client'

export default function OtherCat({theme, otherCategories, setOtherCategories, setSelCat, setShowBack, setTitle}:any){
    const [modalVisible, setModalVisible] = useState(false);
    const [newCat, setNewCat] = useState({title: '', showEpisodes: false});

    const st = style(theme);


    const submit = async () => {
        const res = await db.from('categories').insert(newCat);
        if (res.data) {
            setOtherCategories([...otherCategories, res.data])
            setModalVisible(false);
            setNewCat({title: '', showEpisodes: false});
        }
    }

    const updateTitle = (title:string) => {
        setNewCat({...newCat, title})
    }

    const handleCheck = () => {
        setNewCat((current:any)=>{return {...current, showEpisodes: !current.showEpisodes}})
    }

    return (
        <View style={st.container}>
            <TouchableOpacity onPress={()=>setModalVisible(true)}>
                <Text style={st.add}>ADD NEW CATEGORY</Text>
            </TouchableOpacity>
            <ScrollView>
                {otherCategories.map((cat:any) => {
                    return (
                        <Link onPress={()=>{setShowBack('categories');setSelCat(cat); setTitle(cat.title);}} to='/other' style={st.category} key={cat.id}>
                            <Text style={st.text}>{cat.title}</Text>
                        </Link>
                    )
                })}
            </ScrollView>
            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            >
                <View style={st.centeredView}>
                    <View style={st.modalView}>
                        <View style={st.row}>
                            <Text style={st.modalBack} onPress={()=>setModalVisible(false)}><Ionicons name="chevron-back" size={20} /></Text>
                            <Text style={st.modalTitle} >Add Movie</Text>
                            <Text style={st.modalSubmit} onPress={submit}>SUBMIT</Text>
                        </View>
                        <View style={st.row}>
                            <Text style={{...st.text, marginHorizontal:20}}>Name</Text>
                            <TextInput style={st.textInput} onChangeText={updateTitle} value={newCat.title} />
                        </View>
                        <View style={st.row}>
                            <Text style={st.switchText}>Show season and episode tracker: </Text>
                            <Switch style={st.switch} onValueChange={handleCheck} value={newCat.showEpisodes}/>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}


const style = (theme:any) => {
    return StyleSheet.create({
        container: {
            justifyContent: 'center',
            width: '100%',
        },
        text: {
            color: theme.text,
        },
        switch: {
            flex: 1,
            marginHorizontal: 20
        },
        switchText: {
            color: theme.text,
            margin: 20,
        },
        add: {
            color: theme.text,
            fontSize: 20,
            textAlign: 'center',
            padding: 10,
            backgroundColor: theme.primary,
        },
        category: {
            color: theme.text,
            fontSize: 20,
            textAlign: 'center',
            padding: 20,
            borderColor: theme.accent,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        catText: {
            color: theme.text,
            width: '100%',
        },
        modalView: {
            margin: 20,
            marginVertical: 300,
            backgroundColor: theme.background,
            borderRadius: 20,
            width: '90%',
            height: 180,
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
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
        },
        centeredView: {
            flex: 1,
            marginTop: 22,
        },
        modalBack: {
            color: theme.text,
            margin: 10,
            width: 60,
        },
        modalSubmit: {
            color: theme.text,
            marginVertical: 10,
            marginHorizontal: 20,
            fontSize: 15,
            width: 60,
        },
        modalTitle: {
            color: theme.text,
            flex: 1,
            textAlign: 'center',
            margin: 10,
            fontSize: 20,
            opacity: 0.7,
        },
        row: {
            flexDirection: 'row',
        },
        textInput: {
            backgroundColor: theme.textInput.background,
            color: theme.text,
            width: '70%',
            borderRadius: 10,
            paddingHorizontal: 10,
            padding: 5,
        },
    });
}