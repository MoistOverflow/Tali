import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View} from 'react-native';
import { NativeRouter, Route, Routes } from "react-router-native";
import Navbar from './components/Navbar';
import Home from './routes/Home';
import Movies from './routes/Movies';
import Shows from './routes/Shows';
import Other from './routes/Other';
import Settings from './routes/Settings';
import {darkTheme, lightTheme} from './lib/theme';
import { useEffect, useState } from 'react';


export default function App() {
  let [theme, setTheme] = useState(darkTheme);

  const changeTheme = () => {
    if (theme === darkTheme){
      setTheme(lightTheme);
    } else {
      setTheme(darkTheme);
    }
  }
  return (
    <View style={{...styles.mainContainer, backgroundColor: theme.background}}>
      <NativeRouter>
          <Routes>
            <Route path="/" element={<Home theme={theme}/>}/>
            <Route path="/movies" element={<Movies theme={theme}/>} />
            <Route path="/shows" element={<Shows theme={theme}/>} />
            <Route path="/other" element={<Other theme={theme}/>} />
            <Route path="/settings" element={<Settings theme={theme} changeTheme={changeTheme}/>} />
          </Routes>
          <Navbar theme={theme}/>
          <StatusBar style={theme.statusbar} />
      </NativeRouter>
    </View>
  );
}




const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 40,
    flex: 1,
    flexDirection: 'column',
  },
});