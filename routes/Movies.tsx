import { StyleSheet, Text, View, ScrollView, Modal, TextInput, Switch, TouchableOpacity} from 'react-native';
import Button from '../components/Button';
import db from '../lib/client'
import { useState, useEffect } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { preSubmitMovieSchema, type PreSubmitMovie, MovieSchema, type Movie } from '../lib/schemas';


export default function Movies({theme, movies, setMovies}:any){
    const [unWatchedMovies, setUnWatchedMovies] = useState<Movie[]>([]);
    const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editMovie, setEditMovie] = useState<Movie>({id: 0, title: '', rating: 0, notes: '', watched: false});

    const st = style(theme);

    const addMovie = async (movie: PreSubmitMovie) => {
        const res = await db.from('movies').insert(movie);
        if (res.error) {
            console.log(res.error);
            return
        }
        setMovies((currentState:any)=>[...currentState, res.data]);
    }

    const deleteMovie = async (id: number) => {
        const res = await db.from('movies').delete().eq({id: id});
        if (res.error){
            console.log(res.error);
            return
        }
        setMovies((currentState:any)=>currentState.filter((movie:Movie)=>movie.id !== id));
        setEditMovie({id: 0, title: '', rating: 0, notes: '', watched: false});
    }

    const updateMovie = async () => {
        const res = await db.from('movies').update(editMovie).eq({id: editMovie.id});
        if (res.error){
            console.log(res.error);
            return
        }
        setMovies((currentState:any)=>currentState.map((m:Movie)=>m.id === editMovie.id ? editMovie : m));
    }

    const setEdditMovie = (movie: Movie) => {
        setEditMovie(movie);
    }

    const sortMovies = async () => {
        const unWatchedMovies = movies.filter((movie:Movie) => !movie.watched)
        const sortedUnWatchedMovies = unWatchedMovies.sort((a:Movie, b:Movie) => {
            if (a.title && b.title) {
                return a.title.localeCompare(b.title)
            }
            return 0;
        })
        const watchedMovies = movies.filter((movie:Movie) => movie.watched)
        const sortedWatchedMovies = watchedMovies.sort((a:Movie, b:Movie) => {
            if (a.title && b.title) {
                return a.title.localeCompare(b.title)
            }
            return 0;
        })
        setUnWatchedMovies(sortedUnWatchedMovies);
        setWatchedMovies(sortedWatchedMovies);
    }

    useEffect(() => {sortMovies()}, [movies]);

    return (
        <View style={style(theme).container}>
            <AddMovieModal theme={theme} addModalVisible={addModalVisible} setAddModalVisible={setAddModalVisible} add={addMovie}/>
            <EditMovieModal theme={theme} editMovie={editMovie} setEdditMovie={setEdditMovie} update={updateMovie} remove={deleteMovie}/>
            {(addModalVisible)?null:
                <TouchableOpacity style={st.buttonOverlay} onPress={()=>setAddModalVisible(true)}>
                    <Text style={st.addButton}><AntDesign name="plus" size={30} /></Text>
                </TouchableOpacity>
            }
            <ScrollView style={st.ScrollView}>
                <View style={st.unWatcehdList}>
                    {(unWatchedMovies.length > 0)?<Text style={{...st.text, fontWeight: 'bold'}}>DIDN'T SEE</Text>:null}
                    {unWatchedMovies.map((movie:Movie) => {return(<MovieLI movie={movie} theme={theme} key={movie.id} selected={setEdditMovie}/>)})}
                </View>
                <View style={st.watchedList}>
                    {(watchedMovies.length > 0)?<Text style={{...st.text, fontWeight: 'bold'}}>COMPLETED MOVIES</Text>:null}
                    {watchedMovies.map((movie:Movie) => {return(<MovieLI movie={movie} theme={theme} key={movie.id} watched={true} selected={setEdditMovie}/>)})}
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
            height: 410,
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
        unWatcehdList: {
            width: '100%',
        },
        watchedList: {
            width: '100%',
            marginTop: 40,
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
        movieLI:{
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
    });
}

function MovieLI({movie, theme, watched=false, selected}:any){
    const st = style(theme);
    const rating = movie.rating ? movie.rating : 0;
    return (
        <TouchableOpacity style={st.movieLI} onPress={()=>selected(movie)}>
            <Text style={st.title}>{movie.title}</Text>
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


function AddMovieModal({addModalVisible, setAddModalVisible, add, theme}:any){
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(0);
    const [watched, setWatched] = useState(false);
    const [notes, setNotes] = useState("");
    const st = style(theme);

    const cancel = () => {
        setTitle("");
        setRating(0);
        setWatched(false);
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
        
        const movie = {
            title: titleCase(title),
            rating: rating,
            watched: watched,
            notes: notes,
        }
        const {data, error}:any = preSubmitMovieSchema.safeParse(movie);
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
                            <Text style={st.modalTitle} >Add Movie</Text>
                            <Text style={st.modalSubmit} onPress={submit}>SUBMIT</Text>
                        </View>
                        <View style={{...st.row, margin: 10, marginTop: 40}}>
                            <Text style={{...st.text, marginTop: 4, flex: 1,}}>Title:</Text>
                            <TextInput style={st.textInput} onChangeText={setTitle} value={title}/>
                        </View>
                        <View style={{...st.row, margin: 10, backgroundColor: theme.lowLight, width: "94%", borderRadius: 30}}>
                            <TouchableOpacity style={(watched===false)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setWatched(false)}>
                                <Text style={{...st.text, marginTop: 4}}>Didn't See</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={(watched===true)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setWatched(true)}>
                                <Text style={{...st.text, marginTop: 4}}>Completed</Text>
                            </TouchableOpacity>
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
                                numberOfLines={6}
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


function EditMovieModal({editMovie, setEdditMovie, update, theme, remove}:any){
    const st = style(theme);

    const cancel = () => {
        setEdditMovie({id: 0, title: "", rating: 0, watched: false, notes: ""});
    }

    const setRating = (rating:number) => {
        setEdditMovie((currentState:any)=>({...currentState, rating: rating}));
    }
    const setTitle = (title:string) => {
        setEdditMovie((currentState:any)=>({...currentState, title: title}));
    }
    const setWatched = (watch:boolean) => {
        setEdditMovie((currentState:any)=>({...currentState, watched: watch}));
    }
    const setNotes = (notes:string) => {
        setEdditMovie((currentState:any)=>({...currentState, notes: notes}));
    }


    const submit = () => {
        update();
        cancel();
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={editMovie.id > 0}
        >
            <View style={st.centeredView}>
                <View style={{...st.modalView, height: 440,}}>
                    <View style={st.modalContainer}>
                        <View style={st.row}>
                            <Text style={st.modalBack} onPress={cancel}><Ionicons name="chevron-back" size={20} /></Text>
                            <Text style={st.modalTitle} >Edit Movie</Text>
                            <Text style={st.modalSubmit} onPress={submit}>UPDATE</Text>
                        </View>
                        <View style={{...st.row, margin: 10, marginTop: 40}}>
                            <Text style={{...st.text, marginTop: 4, flex: 1,}}>Title:</Text>
                            <TextInput style={st.textInput} onChangeText={setTitle} value={editMovie.title}/>
                        </View>
                        <View style={{...st.row, margin: 10, backgroundColor: theme.lowLight, width: "94%", borderRadius: 30}}>
                            <TouchableOpacity style={(editMovie.watched===false)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setWatched(false)}>
                                <Text style={{...st.text, marginTop: 4}}>Didn't See</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={(editMovie.watched===true)?{...style(theme).threeSwitch, ...style(theme).threeSwitchSelected}:{...style(theme).threeSwitch}} onPress={()=>setWatched(true)}>
                                <Text style={{...st.text, marginTop: 4}}>Completed</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{...st.row, margin: 10,}}>
                            <Text style={{...st.text, marginTop: 4, flex: 1,}}>Rating:</Text>
                            <RatingStars rating={editMovie.rating} theme={theme} onPress={setRating} />
                        </View>
                        <View style={{width: '100%', margin: 0, marginTop: 10, marginHorizontal: 10}}>
                            <Text style={{...st.text, marginTop: 4,}}>Notes:</Text>
                            <TextInput 
                                editable
                                multiline
                                numberOfLines={5}
                                maxLength={400}
                                style={{...st.textArea}}
                                onChangeText={setNotes}
                                value={editMovie.notes}
                            />
                        </View>
                        <View style={{...st.row, width: '90%', marginLeft: 20, justifyContent: "flex-start"}}>
                            <Button title="delete" onPress={()=>remove(editMovie.id)} theme={theme} style={{backgroundColor: theme.danger, paddingHorizontal: 25, margin: 0}}/>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}