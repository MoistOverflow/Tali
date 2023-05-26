import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Appearance} from 'react-native';
import { NativeRouter, Route, Routes } from "react-router-native";
import Navbar from './components/Navbar';
import Home from './routes/Home';
import Movies from './routes/Movies';
import Shows from './routes/Shows';
import Other from './routes/Other';
import Settings from './routes/Settings';
import {dark, light} from './lib/theme';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TitleBar from './components/TitleBar';

const findTheme = async () => {
  const theme = await AsyncStorage.getItem('theme');
  if(theme === 'dark') {
    return dark;
  } else if(theme === 'light') {
    return light;
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

  useEffect(() => {
    const fetchData = async () => {
      const theme = await findTheme();
      const themeMode = await findThemeMode();
      setTheme(theme);
      setThemeMode(themeMode);
    }
    fetchData()
  }, []);
  
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
  return (
    <View style={{...styles.mainContainer, backgroundColor: theme.background}}>
      <TitleBar title={title} theme={theme}/>
      <NativeRouter>
          <Routes>
            <Route path="/" element={<Home theme={theme}/>}/>
            <Route path="/movies" element={<Movies theme={theme}/>} />
            <Route path="/shows" element={<Shows theme={theme}/>} />
            <Route path="/other" element={<Other theme={theme}/>} />
            <Route path="/settings" element={<Settings theme={theme} changeTheme={changeTheme} themeMode={themeMode}/>} />
          </Routes>
          <Navbar theme={theme} setTitle={setTitle}/>
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