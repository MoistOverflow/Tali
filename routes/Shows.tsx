import { StyleSheet, Text, View, ScrollView, Modal, TextInput, Switch, TouchableOpacity} from 'react-native';
import Button from '../components/Button';
import db from '../lib/client'
import { useState, useEffect } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { PreSubmitShowSchema, type PreSubmitShow, ShowSchema, type Show } from '../lib/schemas';


export default function Shows({theme, shows, setShows}:any){
    const [unWatched, setUnWatched] = useState<Show[]>([]);
    const [watching, setWatching] = useState<Show[]>([]);
    const [watched, setWatched] = useState<Show[]>([]);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editShow, setEditShow] = useState<Show>({id: 0, title: '', rating: 0, notes: '', watchState: 0, currentSeason: 0, currentEpisode: 0});

    const st = style(theme);

    const addshow = async (show: PreSubmitShow) => {
        const res = await db.from('shows').insert(show);
        if (res.error) {
            console.log(res.error);
            return
        }
        setShows((currentState:any)=>[...currentState, res.data]);
    }

    const deleteshow = async (id: number) => {
        const res = await db.from('shows').delete().eq({id: id});
        if (res.error) {
            console.log(res.error);
            return
        }
        setShows((currentState:any)=>currentState.filter((show:Show)=>show.id !== id));
        setEdditShow({id: 0, title: '', rating: 0, notes: '', watchState: 0, currentSeason: 0, currentEpisode: 0});
    }

    const updateshow = async () => {
        const res = await db.from('shows').update(editShow).eq({id: editShow.id});
        if (res.error) {
            console.log(res.error);
            return
        }
        setShows((currentState:any)=>currentState.map((m:Show)=>m.id === editShow.id ? editShow : m));
    }

    const setEdditShow = (show: Show) => {
        setEditShow(show);
    }

    const sortshows = async () => {
        const sortedUnWatchedshows = shows.filter((show:Show) => show.watchState===0).sort((a:Show, b:Show) => {
            if (a.title && b.title) {
                return a.title.localeCompare(b.title)
            }
            return 0;
        })
        const sortedWatchingShows = shows.filter((show:Show) => show.watchState===1).sort((a:Show, b:Show) => {
            if (a.title && b.title) {
                return a.title.localeCompare(b.title)
            }
            return 0;
        })
        const sortedWatchedshows = shows.filter((show:Show) => show.watchState === 2).sort((a:Show, b:Show) => {
            if (a.title && b.title) {
                return a.title.localeCompare(b.title)
            }
            return 0;
        })
        setUnWatched(sortedUnWatchedshows);
        setWatching(sortedWatchingShows);
        setWatched(sortedWatchedshows);
    }

    useEffect(() => {sortshows()}, [shows]);

    return (
        <View style={style(theme).container}>
            <AddshowModal theme={theme} addModalVisible={addModalVisible} setAddModalVisible={setAddModalVisible} add={addshow}/>
            <EditshowModal theme={theme} editShow={editShow} setEditShow={setEdditShow} update={updateshow} remove={deleteshow}/>
            {(addModalVisible)?null:
                <TouchableOpacity style={st.buttonOverlay} onPress={()=>setAddModalVisible(true)}>
                    <Text style={st.addButton}><AntDesign name="plus" size={30} /></Text>
                </TouchableOpacity>
            }
            <ScrollView style={st.ScrollView}>
            <View style={st.watchingList}>
                    {(watching.length > 0)?<Text style={{...st.text, fontWeight: 'bold'}}>CURRENTLY WATCHING</Text>:null}
                    {watching.map((show:Show) => {return(<ShowLI show={show} theme={theme} key={show.id} selected={setEditShow}/>)})}
                </View>
                <View style={st.unWatchedList}>
                    {(unWatched.length > 0)?<Text style={{...st.text, fontWeight: 'bold'}}>DIDN'T SEE</Text>:null}
                    {unWatched.map((show:Show) => {return(<ShowLI show={show} theme={theme} key={show.id} selected={setEditShow}/>)})}
                </View>
                <View style={st.watchedList}>
                    {(watched.length > 0)?<Text style={{...st.text, fontWeight: 'bold'}}>COMPLETED SHOWS</Text>:null}
                    {watched.map((show:Show) => {return(<ShowLI show={show} theme={theme} key={show.id} watched={true} selected={setEditShow}/>)})}
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
        showLI:{
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
        delete: {
            color: 'red',
            textAlign: 'center',
            marginTop: 10,
        },
    });
}

function ShowLI({show, theme, watched=false, selected}:any){
    const st = style(theme);
    const rating = show.rating ? show.rating : 0;
    return (
        <TouchableOpacity style={st.showLI} onPress={()=>selected(show)}>
            <Text style={st.title}>{show.title}</Text>
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


function AddshowModal({addModalVisible, setAddModalVisible, add, theme}:any){
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(0);
    const [watchState, setWatchState] = useState(0);
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    const [notes, setNotes] = useState("");
    const st = style(theme);

    const cancel = () => {
        setTitle("");
        setRating(0);
        setWatchState(0);
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
        
        const show = {
            title: titleCase(title),
            rating: rating,
            watchState: watchState,
            currentSeason: season,
            currentEpisode: episode,
            notes: notes,
        }
        const {data, error}:any = PreSubmitShowSchema.safeParse(show);
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
                            <Text style={st.modalTitle} >Add Show</Text>
                            <Text style={st.modalSubmit} onPress={submit}>SUBMIT</Text>
                        </View>
                        <View style={{...st.row, margin: 10, marginTop: 40}}>
                            <Text style={{...st.text, marginTop: 4, flex: 1,}}>Title:</Text>
                            <TextInput style={st.textInput} onChangeText={setTitle} value={title}/>
                        </View>
                        <View style={{...st.row, margin: 10, backgroundColor: theme.lowLight, width: "94%", borderRadius: 30}}>
                            <TouchableOpacity style={(watchState===0)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setWatchState(0)}>
                                <Text style={{...st.text, marginTop: 4}}>Didn't See</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={(watchState===1)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setWatchState(1)}>
                                <Text style={{...st.text, marginTop: 4}}>Currently Watching</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={(watchState===2)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setWatchState(2)}>
                                <Text style={{...st.text, marginTop: 4}}>Completed</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{...st.row, margin: 10}}>
                            <View style={{...st.row, flex: 1, justifyContent: 'center'}}>
                                <Text style={{...st.text, marginTop: 4,}}>Season:</Text>
                                <TextInput style={st.numberInput} keyboardType = 'number-pad' onChangeText={(s)=>setSeason(Number(s))} value={season.toString()}/>
                            </View>
                            <View style={{...st.row, flex: 1, justifyContent: 'center'}}>
                                <Text style={{...st.text, marginTop: 4,}}>Episode:</Text>
                                <TextInput style={st.numberInput} keyboardType = 'number-pad' onChangeText={(s)=>setEpisode(Number(s))} value={episode.toString()}/>
                            </View>
                        </View>
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


function EditshowModal({editShow, setEditShow, update, theme, remove}:any){
    const st = style(theme);
    const season = editShow.currentSeason;

    const cancel = () => {
        setEditShow({id: 0, title: "", rating: 0, watched: false, notes: "", currentSeason: 1, currentEpisode: 1});
    }

    const setRating = (rating:number) => {
        setEditShow((currentState:any)=>({...currentState, rating: rating}));
    }
    const setTitle = (title:string) => {
        setEditShow((currentState:any)=>({...currentState, title: title}));
    }
    const setWatchState = (watchState:number) => {
        setEditShow((currentState:any)=>({...currentState, watchState: watchState}));
    }
    const setSeason = (season:number) => {
        setEditShow((currentState:any)=>({...currentState, currentSeason: Number(season)}));
    }
    const setEpisode = (episode:number) => {
        setEditShow((currentState:any)=>({...currentState, currentEpisode: Number(episode)}));
    }
    const setNotes = (notes:string) => {
        setEditShow((currentState:any)=>({...currentState, notes: notes}));
    }


    const submit = () => {
        update();
        cancel();
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={editShow.id > 0}
        >
            <View style={st.centeredView}>
                <View style={st.modalView}>
                    <View style={st.modalContainer}>
                        <View style={st.row}>
                            <Text style={st.modalBack} onPress={cancel}><Ionicons name="chevron-back" size={20} /></Text>
                            <Text style={st.modalTitle} >Edit Show</Text>
                            <Text style={st.modalSubmit} onPress={submit}>SUBMIT</Text>
                        </View>
                        <View style={{...st.row, margin: 10, marginTop: 40}}>
                            <Text style={{...st.text, marginTop: 4, flex: 1,}}>Title:</Text>
                            <TextInput style={st.textInput} onChangeText={setTitle} value={editShow.title}/>
                        </View>
                        <View style={{...st.row, margin: 10, backgroundColor: theme.lowLight, width: "94%", borderRadius: 30}}>
                            <TouchableOpacity style={(editShow.watchState===0)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setWatchState(0)}>
                                <Text style={{...st.text, marginTop: 4}}>Didn't See</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={(editShow.watchState===1)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setWatchState(1)}>
                                <Text style={{...st.text, marginTop: 4}}>Currently Watching</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={(editShow.watchState===2)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setWatchState(2)}>
                                <Text style={{...st.text, marginTop: 4}}>Completed</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{...st.row, margin: 10}}>
                            <View style={{...st.row, flex: 1, justifyContent: 'center'}}>
                                <Text style={{...st.text, marginTop: 4,}}>Season:</Text>
                                <TextInput style={st.numberInput} keyboardType = 'number-pad' onChangeText={(s)=>setSeason(Number(s))} value={editShow.currentSeason.toString()}/>
                            </View>
                            <View style={{...st.row, flex: 1, justifyContent: 'center'}}>
                                <Text style={{...st.text, marginTop: 4,}}>Episode:</Text>
                                <TextInput style={st.numberInput} keyboardType = 'number-pad' onChangeText={(s)=>setEpisode(Number(s))} value={editShow.currentEpisode.toString()}/>
                            </View>
                        </View>
                        <View style={{...st.row, margin: 10,}}>
                            <Text style={{...st.text, marginTop: 4, flex: 1,}}>Rating:</Text>
                            <RatingStars rating={editShow.rating} theme={theme} onPress={setRating} />
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
                                value={editShow.notes}
                            />
                        </View>
                        <View style={{...st.row, width: '90%', marginLeft: 20, justifyContent: "center"}}>
                            <Text style={st.delete} onLongPress={()=>remove(editShow.id)}>long press to delete</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}


                        