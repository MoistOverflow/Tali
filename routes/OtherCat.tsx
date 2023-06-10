import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, Switch} from 'react-native';
import { useEffect, useState } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Link } from "react-router-native";
import db from '../lib/client'

export default function OtherCat({theme, otherCategories, setOtherCategories, setSelCat, setShowBack, setTitle}:any){
    const [modalVisible, setModalVisible] = useState(false);
    const [newCat, setNewCat]:any = useState({id: 0, title: '', showEpisodes: false});
    const [editPop, setEditPop] = useState(false);
    const [catSorted, setCatSorted] = useState(otherCategories);
    //sort aplhabetically using a.title and b.title in a useEffect
    useEffect(()=>{
        setCatSorted(otherCategories.sort((a:any, b:any) => a.title.localeCompare(b.title)))
    },[otherCategories])
    

    const st = style(theme);


    const submit = async () => {
        if (!editPop){
            const res = await db.from('categories').insert(newCat);
            if (res.data) {
                setOtherCategories([...otherCategories, res.data])
                setModalVisible(false);
                setNewCat({title: '', showEpisodes: false});
            }
        }else {
            const res = await db.from('categories').update(newCat).eq({id: newCat.id});
            if (res.data) {
                const updatedList = [...otherCategories.filter((cat:any) => cat.id !== newCat.id), newCat]
                setOtherCategories(updatedList)
                setModalVisible(false);
                setNewCat({title: '', showEpisodes: false});
            }
        }
    }

    const updateTitle = (title:string) => {
        setNewCat({...newCat, title})
    }

    const handleCheck = () => {
        setNewCat((current:any)=>{return {...current, showEpisodes: !current.showEpisodes}})
    }

    const handleAddNew = () => {
        setNewCat({title: '', showEpisodes: false});
        setEditPop(false);
        setModalVisible(true);
    }

    const handleEdit = (cat:any) => {
        setNewCat(cat);
        setEditPop(true);
        setModalVisible(true);
    }

    const handleDelete = async () => {
        const res = await db.from('categories').delete().eq({id: newCat.id});
        if (res.data) {
            setOtherCategories([...otherCategories.filter((c:any) => c.id !== newCat.id)])
        }
        setModalVisible(false);
        setNewCat({title: '', showEpisodes: false});
        setEditPop(false);
    }

    return (
        <View style={st.container}>
            <TouchableOpacity onPress={handleAddNew}>
                <Text style={st.add}>ADD NEW CATEGORY</Text>
            </TouchableOpacity>
            <ScrollView>
                {catSorted.map((cat:any) => {
                    return (
                        <Link onPress={()=>{setShowBack('categories');setSelCat(cat); setTitle(cat.title);}} to='/other' style={st.category} key={cat.id}>
                            <View style={st.row}>
                                <Text style={{...st.text, flex:1, textAlign: 'center', fontSize: 20}}>{cat.title}</Text>
                                <TouchableOpacity style={{padding:10}} onPress={()=>handleEdit(cat)}>
                                    <AntDesign style={st.text} name="edit" size={16} />
                                </TouchableOpacity>
                            </View>
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
                            <Text style={st.modalTitle} >{(editPop)?'Edit':'Add'} Movie</Text>
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
                        {(editPop)?<Text style={st.delete} onLongPress={handleDelete}>DELETE</Text>:null}
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
        delete: {
            color: 'red',
            textAlign: 'center',
            marginVertical: 0,
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
            textAlign: 'center',
            padding: 14,
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