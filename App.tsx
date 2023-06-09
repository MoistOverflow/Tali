import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Appearance} from 'react-native';
import { NativeRouter, Route, Routes } from "react-router-native";
import Navbar from './components/Navbar';
import Home from './routes/Home';
import Movies from './routes/Movies';
import Shows from './routes/Shows';
import Other from './routes/Other';
import Settings from './routes/Settings';
import OtherCat from './routes/OtherCat';
import {dark, light, solorizedDark, oled} from './lib/theme';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TitleBar from './components/TitleBar';
import db from './lib/client';

const findTheme = async () => {
  const theme = await AsyncStorage.getItem('theme');
  if(theme === 'dark') {
    return dark;
  } else if(theme === 'light') {
    return light;
  } else if(theme === 'solorizedDark') {
    return solorizedDark;
  } else if(theme === 'oled') {
    return oled;
  } else {
    const system = Appearance.getColorScheme();
    if (system === 'dark') {
    return dark;
    } else {
      return light;
    }
  }
}

const findThemeMode = async () => {
  const theme = await AsyncStorage.getItem('theme');
  if (theme){
    return theme;
  } else {
    return 'auto';
  }
}

export default function App() {
  let [theme, setTheme] = useState(light);
  let [themeMode, setThemeMode] = useState('auto');
  let [title, setTitle] = useState('Home');
  let [showBack, setShowBack] = useState('');
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [selCat, setSelCat] = useState({id:0});
  const [otherCategories, setOtherCategories] = useState([]);
  const [others, setOthers] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      const theme = await findTheme();
      const themeMode = await findThemeMode();
      setTheme(theme);
      setThemeMode(themeMode);
      Appearance.addChangeListener(({ colorScheme }) => {
        const theme = (colorScheme === 'dark') ? dark : light;
        setTheme(theme);
      })
      const movies = await db.from('movies').select().eq();
      if (movies.data) {
        setMovies(movies.data);
      }
      const shows = await db.from('shows').select().eq();
      if (shows.data) {
        setShows(shows.data);
      }
      const otherCategories = await db.from('categories').select().eq();
      if (otherCategories.data) {
        setOtherCategories(otherCategories.data);
      }
    }
    fetchData()
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const other = await db.from('others').select().eq({category: selCat.id});
      if (other.data) {
        setOthers(other.data);
      }
    }
    fetchData()
  }, [selCat]);
  
  const changeTheme = async (mode:string ) => {
    switch(mode) {
      case 'dark':
        setThemeMode('dark');
        setTheme(dark);
        await AsyncStorage.setItem('theme', 'dark');
        break;
      case 'light':
        setThemeMode('light');
        setTheme(light);
        await AsyncStorage.setItem('theme', 'light');
        break;
      case 'solorizedDark':
        setThemeMode('solorizedDark');
        setTheme(solorizedDark);
        await AsyncStorage.setItem('theme', 'solorizedDark');
        break;
      case 'oled':
        setThemeMode('oled');
        setTheme(oled);
        await AsyncStorage.setItem('theme', 'oled');
        break;
      default:
        setThemeMode('auto');
        const system = Appearance.getColorScheme();
        if (system === 'dark') {
          setTheme(dark);
        } else {
          setTheme(light);
        }
        await AsyncStorage.setItem('theme', "auto");
        break;
    }
  }

  const clearAll = async () => {
    await AsyncStorage.clear();
    setMovies([]);
    setShows([]);
    setOtherCategories([]);
    setOthers([]);
  }

  return (
    <View style={{...styles.mainContainer, backgroundColor: theme.background}}>
      <NativeRouter>
      <TitleBar title={title} theme={theme} showBack={showBack} setShowBack={setShowBack} setTitle={setTitle} setSelCat={setSelCat}/>
          <Routes>
            <Route path="/" element={<Home theme={theme}/>}/>
            <Route path="/movies" element={<Movies theme={theme} movies={movies} setMovies={setMovies} />} />
            <Route path="/shows" element={<Shows theme={theme} shows={shows} setShows={setShows}/>}/>
            <Route path="/categories" element={<OtherCat theme={theme} otherCategories={otherCategories} setOtherCategories={setOtherCategories} setSelCat={setSelCat} setShowBack={setShowBack} setTitle={setTitle} setOthers={setOthers}/>} />
            <Route path="/other" element={<Other theme={theme} selCat={selCat} others={others} setOthers={setOthers} setSelCat={setSelCat}/>} />
            <Route path="/settings" element={<Settings theme={theme} changeTheme={changeTheme} themeMode={themeMode} clearAll={clearAll}/>} />
          </Routes>
          <Navbar theme={theme} setTitle={setTitle} setShowBack={setShowBack}/>
          <StatusBar style={theme.statusbar} />
      </NativeRouter>
    </View>
  );
}




const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 0,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'baseline',
  },
});