import { StyleSheet, Text, View, ScrollView, Modal, TextInput, TouchableOpacity} from 'react-native';
import Button from '../components/Button';
import db from '../lib/client'
import { useState, useEffect } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import {PreSubmitOtherSchema, type Other, type PreSubmitOther } from '../lib/schemas';


export default function Other({theme, selCat, others, setOthers, setSelCat}:any){
    const [tbd, setTbd] = useState<Other[]>([]);
    const [inProgress, setInProgress] = useState<Other[]>([]);
    const [completed, setCompleted] = useState<Other[]>([]);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editOther, setEditOther] = useState<Other>({id: 0, title: '', rating: 0, notes: '', completeState: 0, currentSeason: 0, currentEpisode: 0, category: Number(selCat.id)});

    const st = style(theme);

    const addOther = async (other: PreSubmitOther) => {
        const res = await db.from('others').insert(other);
        if (res.error) {
            console.log(res.error);
            return
        }
        setOthers((currentState:any)=>[...currentState, res.data]);
    }

    const deleteOther = async (id: number) => {
        const res = await db.from('others').delete().eq({id: id});
        if (res.error) {
            console.log(res.error);
            return
        }
        setOthers((currentState:any)=>currentState.filter((other:Other)=>other.id !== id));
        setEdditOther({id: 0, title: '', rating: 0, notes: '', completeState: 0, currentSeason: 0, currentEpisode: 0, category: selCat.id});
    }

    const updateOther = async () => {
        const res = await db.from('others').update(editOther).eq({id: editOther.id});
        if (res.error) {
            console.log(res.error);
            return
        }
        setOthers((currentState:any)=>currentState.map((m:Other)=>m.id === editOther.id ? editOther : m));
    }

    const setEdditOther = (other: Other) => {
        setEditOther(other);
    }

    const sortOthers = async () => {
        const sortedUnWatchedshows = others.filter((other:Other) => other.completeState===0).sort((a:Other, b:Other) => {
            if (a.title && b.title) {
                return a.title.localeCompare(b.title)
            }
            return 0;
        })
        const sortedWatchingShows = others.filter((other:Other) => other.completeState===1).sort((a:Other, b:Other) => {
            if (a.title && b.title) {
                return a.title.localeCompare(b.title)
            }
            return 0;
        })
        const sortedWatchedshows = others.filter((other:Other) => other.completeState===2).sort((a:Other, b:Other) => {
            if (a.title && b.title) {
                return a.title.localeCompare(b.title)
            }
            return 0;
        })
        setTbd(sortedUnWatchedshows);
        setInProgress(sortedWatchingShows);
        setCompleted(sortedWatchedshows);
    }

    useEffect(() => {sortOthers()}, [others]);
    useEffect(()=>{return()=>{setSelCat({id:0});setOthers([])}},[])

    return (
        <View style={style(theme).container}>
            <AddOtherModal theme={theme} addModalVisible={addModalVisible} setAddModalVisible={setAddModalVisible} add={addOther} selCat={selCat}/>
            <EditshowModal theme={theme} editOther={editOther} setEditOther={setEdditOther} update={updateOther} remove={deleteOther} selCat={selCat}/>
            {(addModalVisible)?null:
                <TouchableOpacity style={st.buttonOverlay} onPress={()=>setAddModalVisible(true)}>
                    <Text style={st.addButton}><AntDesign name="plus" size={30} /></Text>
                </TouchableOpacity>
            }
            <ScrollView style={st.ScrollView}>
            <View style={st.watchingList}>
                    {(inProgress.length > 0)?<Text style={{...st.text, fontWeight: 'bold'}}>In Progress</Text>:null}
                    {inProgress.map((other:Other) => {return(<OtherLI other={other} theme={theme} key={other.id} selected={setEditOther}/>)})}
                </View>
                <View style={st.unWatchedList}>
                    {(tbd.length > 0)?<Text style={{...st.text, fontWeight: 'bold'}}>TBD</Text>:null}
                    {tbd.map((other:Other) => {return(<OtherLI other={other} theme={theme} key={other.id} selected={setEditOther}/>)})}
                </View>
                <View style={st.watchedList}>
                    {(completed.length > 0)?<Text style={{...st.text, fontWeight: 'bold'}}>COMPLETED</Text>:null}
                    {completed.map((other:Other) => {return(<OtherLI other={other} theme={theme} key={other.id} watched={true} selected={setEditOther}/>)})}
                </View>
            </ScrollView>
        </View>
    )
}


const style = (theme:any) => {
    return StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
            paddingBottom: 60,
            height: '100%',
        },
        row: {
            flexDirection: 'row',
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
        centeredView: {
            flex: 1,
            marginTop: 22,
        },
        modalView: {
            margin: 20,
            backgroundColor: theme.background,
            borderRadius: 20,
            width: '90%',
            height: 520,
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
        buttonOverlay: {
            position: 'absolute',
            zIndex: 98,
            right: 20,
            bottom: 200,
            backgroundColor: theme.primary,
            borderRadius: 100,
            width: 50,
            height: 50,
        },
        addButton: {
            color: theme.text,
            zIndex: 99,
            textAlign: 'center',
            paddingTop: 10,
        },
        ScrollView: {
            marginBottom: 100,
        },
        watchingList: {
            width: '100%',
            marginBottom: 40,
        },
        unWatchedList: {
            width: '100%',
            marginBottom: 40,
        },
        watchedList: {
            width: '100%',
        },
        text: {
            color: theme.text,
            marginHorizontal: 10,
        },
        starView: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
        },
        star: {
            color: theme.text,
            marginHorizontal: 3,
        },
        starD: {
            color: 'grey',
            marginHorizontal: 3,
        },
        otherLI:{
            margin: 6,
            marginVertical: 10,
            marginLeft: "auto",
            width: "100%",
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
        },
        title: {
            color: theme.text,
            marginHorizontal: 4,
            flex: 1,
            marginLeft: 50,
            fontSize: 20,
        },
        textInput: {
            backgroundColor: theme.textInput.background,
            color: theme.text,
            width: '70%',
            borderRadius: 10,
            paddingHorizontal: 10,
            padding: 5,
        },
        modalTitle: {
            color: theme.text,
            flex: 1,
            textAlign: 'center',
            margin: 10,
            fontSize: 20,
            opacity: 0.7,
        },
        switch: {
            backgroundColor: theme.background,
            paddingHorizontal: 10,
            zIndex: 99,
        },
        textArea: {
            backgroundColor: theme.textInput.background,
            color: theme.text,
            width: '90%',
            margin: 10,
            borderRadius: 10,
            padding: 5,
            textAlignVertical: 'top',
        },
        threeSwitch: {
            flex: 1,
            paddingVertical: 10,
            opacity: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        threeSwitchSelected: {
            borderRadius: 30,
            backgroundColor: theme.highLight,
            alignItems: 'center',
            justifyContent: 'center',
        },
        numberInput: {
            backgroundColor: theme.textInput.background,
            color: theme.text,
            borderRadius: 10,
            paddingHorizontal: 10,
            padding: 5,
        },
    });
}

function OtherLI({other, theme, watched=false, selected}:any){
    const st = style(theme);
    const rating = other.rating ? other.rating : 0;
    return (
        <TouchableOpacity style={st.otherLI} onPress={()=>selected(other)}>
            <Text style={st.title}>{other.title}</Text>
            <RatingStars rating={rating} theme={theme}/>
        </TouchableOpacity>
    )
}

function RatingStars({rating, theme, disabled=false, onPress }:any){
    const st = style(theme);

    const handlePress = (i:number) => {
        if (onPress) {
            if (i === rating) {
                onPress(0);
            } else {
                onPress(i);
            }
        }
    }

    const stars = []
    if (!disabled){
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars.push(<Text key={i} style={st.star} onPress={()=>handlePress(i+1)}><AntDesign name="star" size={22} /></Text>)
            } else {
                stars.push(<Text key={i} style={st.star} onPress={()=>handlePress(i+1)}><AntDesign name="staro" size={22} /></Text>)
            }
        }    
    } else {
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars.push(<Text key={i} style={st.starD}><AntDesign name="star" size={22} /></Text>)
            } else {
                stars.push(<Text key={i} style={st.starD}><AntDesign name="staro" size={22} /></Text>)
            }
        }    
    }
    return (
        <View style={st.starView}>
            {stars}
        </View>
    )
}


function AddOtherModal({addModalVisible, setAddModalVisible, add, theme, selCat}:any){
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(0);
    const [completeState, setCompleteState] = useState(0);
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    const [notes, setNotes] = useState("");
    const st = style(theme);

    const cancel = () => {
        setTitle("");
        setRating(0);
        setCompleteState(0);
        setSeason(1);
        setEpisode(1);
        setNotes("");
        setAddModalVisible(false);
    }


    function titleCase(str:any) {
        str = str.split(' ');
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
        }


    const submit = () => {
        
        const other= {
            title: titleCase(title),
            rating: rating,
            completeState: completeState,
            currentSeason: season,
            currentEpisode: episode,
            notes: notes,
            category: selCat.id
        }
        const {data, error}:any = PreSubmitOtherSchema.safeParse(other);
        if (error) {
            console.log(error);
            return;
        }
        add(data);
        cancel();
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={addModalVisible}
        >
            <View style={st.centeredView}>
                <View style={st.modalView}>
                    <View style={st.modalContainer}>
                        <View style={st.row}>
                            <Text style={st.modalBack} onPress={cancel}><Ionicons name="chevron-back" size={20} /></Text>
                            <Text style={st.modalTitle} >Add {selCat.title}</Text>
                            <Text style={st.modalSubmit} onPress={submit}>SUBMIT</Text>
                        </View>
                        <View style={{...st.row, margin: 10, marginTop: 40}}>
                            <Text style={{...st.text, marginTop: 4, flex: 1,}}>Title:</Text>
                            <TextInput style={st.textInput} onChangeText={setTitle} value={title}/>
                        </View>
                            <View style={{...st.row, margin: 10, backgroundColor: theme.lowLight, width: "94%", borderRadius: 30}}>
                                <TouchableOpacity style={(completeState===0)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setCompleteState(0)}>
                                    <Text style={{...st.text, marginTop: 4}}>TBD</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={(completeState===1)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setCompleteState(1)}>
                                    <Text style={{...st.text, marginTop: 4}}>In Progress</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={(completeState===2)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setCompleteState(2)}>
                                    <Text style={{...st.text, marginTop: 4}}>Completed</Text>
                                </TouchableOpacity>
                            </View>
                        {(selCat.showEpisodes)?
                            <View style={{...st.row, margin: 10}}>
                                <View style={{...st.row, flex: 1, justifyContent: 'center'}}>
                                    <Text style={{...st.text, marginTop: 4,}}>Season:</Text>
                                    <TextInput style={st.numberInput} keyboardType = 'number-pad' onChangeText={(s)=>setSeason(Number(s))} value={season.toString()}/>
                                </View>
                                <View style={{...st.row, flex: 1, justifyContent: 'center'}}>
                                    <Text style={{...st.text, marginTop: 4,}}>Episode:</Text>
                                    <TextInput style={st.numberInput} keyboardType = 'number-pad' onChangeText={(s)=>setEpisode(Number(s))} value={episode.toString()}/>
                                </View>
                            </View>:null}
                        <View style={{...st.row, margin: 10,}}>
                            <Text style={{...st.text, marginTop: 4, flex: 1,}}>Rating:</Text>
                            <RatingStars rating={rating} theme={theme} onPress={setRating} />
                        </View>
                        <View style={{width: '100%', margin: 10}}>
                            <Text style={{...st.text, marginTop: 4,}}>Notes:</Text>
                            <TextInput 
                                editable
                                multiline
                                numberOfLines={8}
                                maxLength={400}
                                style={st.textArea}
                                onChangeText={setNotes}
                                value={notes}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}


function EditshowModal({editOther, setEditOther, update, theme, remove, selCat}:any){
    const st = style(theme);

    const cancel = () => {
        setEditOther({id: 0, title: "", rating: 0, watched: false, notes: "", currentSeason: 1, currentEpisode: 1, category: selCat.id});
    }

    const setRating = (rating:number) => {
        setEditOther((currentState:any)=>({...currentState, rating: rating}));
    }
    const setTitle = (title:string) => {
        setEditOther((currentState:any)=>({...currentState, title: title}));
    }
    const setCompleteState = (completeState:number) => {
        setEditOther((currentState:any)=>({...currentState, completeState: completeState}));
    }
    const setSeason = (season:number) => {
        setEditOther((currentState:any)=>({...currentState, currentSeason: Number(season)}));
    }
    const setEpisode = (episode:number) => {
        setEditOther((currentState:any)=>({...currentState, currentEpisode: Number(episode)}));
    }
    const setNotes = (notes:string) => {
        setEditOther((currentState:any)=>({...currentState, notes: notes}));
    }


    const submit = () => {
        update();
        cancel();
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={editOther.id > 0}
        >
            <View style={st.centeredView}>
                <View style={st.modalView}>
                    <View style={st.modalContainer}>
                        <View style={st.row}>
                            <Text style={st.modalBack} onPress={cancel}><Ionicons name="chevron-back" size={20} /></Text>
                            <Text style={st.modalTitle} >Edit {selCat.title}</Text>
                            <Text style={st.modalSubmit} onPress={submit}>SUBMIT</Text>
                        </View>
                        <View style={{...st.row, margin: 10, marginTop: 40}}>
                            <Text style={{...st.text, marginTop: 4, flex: 1,}}>Title:</Text>
                            <TextInput style={st.textInput} onChangeText={setTitle} value={editOther.title}/>
                        </View>
                        <View style={{...st.row, margin: 10, backgroundColor: theme.lowLight, width: "94%", borderRadius: 30}}>
                            <TouchableOpacity style={(editOther.completeState===0)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setCompleteState(0)}>
                                <Text style={{...st.text, marginTop: 4}}>TBD</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={(editOther.completeState===1)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setCompleteState(1)}>
                                <Text style={{...st.text, marginTop: 4}}>In Progress</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={(editOther.completeState===2)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setCompleteState(2)}>
                                <Text style={{...st.text, marginTop: 4}}>Completed</Text>
                            </TouchableOpacity>
                        </View>
                        {(selCat.showEpisodes)?
                            <View style={{...st.row, margin: 10}}>
                                <View style={{...st.row, flex: 1, justifyContent: 'center'}}>
                                    <Text style={{...st.text, marginTop: 4,}}>Season:</Text>
                                    <TextInput style={st.numberInput} keyboardType = 'number-pad' onChangeText={(s)=>setSeason(Number(s))} value={editOther.currentSeason.toString()}/>
                                </View>
                                <View style={{...st.row, flex: 1, justifyContent: 'center'}}>
                                    <Text style={{...st.text, marginTop: 4,}}>Episode:</Text>
                                    <TextInput style={st.numberInput} keyboardType = 'number-pad' onChangeText={(s)=>setEpisode(Number(s))} value={editOther.currentEpisode.toString()}/>
                                </View>
                            </View>:null}
                        <View style={{...st.row, margin: 10,}}>
                            <Text style={{...st.text, marginTop: 4, flex: 1,}}>Rating:</Text>
                            <RatingStars rating={editOther.rating} theme={theme} onPress={setRating} />
                        </View>
                        <View style={{width: '100%', margin: 10, marginBottom: 0,}}>
                            <Text style={{...st.text, marginTop: 4,}}>Notes:</Text>
                            <TextInput 
                                editable
                                multiline
                                numberOfLines={6}
                                maxLength={400}
                                style={st.textArea}
                                onChangeText={setNotes}
                                value={editOther.notes}
                            />
                        </View>
                        <View style={{...st.row, width: '90%', marginLeft: 20, justifyContent: "flex-start"}}>
                            <Button title="delete" onPress={()=>remove(editOther.id)} theme={theme} style={{backgroundColor: theme.danger, paddingHorizontal: 25, margin: 0,}}/>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}