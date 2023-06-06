export type Theme = {
    name: string;
    text: string,
    background: string,
    primary: string,
    secondary: string,
    accent: string,
    statusbar: 'light' | 'dark',
    textInput: {
        background: string,
    }
    switch: {
        track: {
            true: string,
            false: string,
        },
        thumb: {
            true: string,
            false: string,
        },
    }
    danger: string,
    success: string,
    warning: string,
    lowLight: string,
    highLight: string,
    dropDown: "LIGHT" | "DARK",
}

export const dark: Theme = {
    name: 'dark',
    text: "#edecf3",
    background: "#0f0e16",
    primary: "#60496f",
    secondary: "#1f141e",
    accent: "#31202f",
    statusbar: 'light',
    textInput: {
        background: "#1f141e",
    },
    switch: {
        track: {
            true: "#60496f",
            false: "#1f141e",
        },
        thumb: {
            true: "#edecf3",
            false: "#edecf3",
        },
    },
    danger: "#ff0000",
    success: "#00ff00",
    warning: "#ffff00",
    lowLight: "rgba(31,20,30,0.2)",
    highLight: "rgba(96,73,111,0.4)",
    dropDown: "DARK",
}

export const light: Theme = {
    name: 'light',
    text: "#0e1b17",
    background: "#e1efea",
    primary: "#519e85",
    secondary: "#ebf5f1",
    accent: "#5dac92",
    statusbar: 'dark',
    textInput: {
        background: "#ebf5f1",
    },
    switch: {
        track: {
            true: "#519e85",
            false: "#ebf5f1",
        },
        thumb: {
            true: "#0e1b17",
            false: "#0e1b17",
        },
    },
    danger: "#ff0000",
    success: "#00ff00",
    warning: "#ffff00",
    lowLight: "rgba(14,27,23,0.2)",
    highLight: "rgba(81,158,133,0.4)",
    dropDown: "LIGHT",
}

export const solorizedDark: Theme = {
    name: 'solorizedDark',
    text: "#fbfdfe",
    background: "#0d1c26",
    primary: "#234d67",
    secondary: "#081117",
    accent: "#2a5b7a",
    statusbar: 'light',
    textInput: {
        background: "#081117",
    },
    switch: {
        track: {
            true: "#234d67",
            false: "#081117",
        },
        thumb: {
            true: "#fbfdfe",
            false: "#fbfdfe",
        },
    },
    danger: "#ff0000",
    success: "#00ff00",
    warning: "#ffff00",
    lowLight: "rgba(8,17,23,0.2)",
    highLight: "rgba(35,77,103,0.4)",
    dropDown: "DARK",
}


export const oled: Theme = {
    name: 'oled',
    text: "#ffffff",
    background: "#000000",
    primary: "#2f2f2f",
    secondary: "#1f1f1f",
    accent: "#000000",
    statusbar: 'light',
    textInput: {
        background: "#000000",
    },
    switch: {
        track: {
            true: "#000000",
            false: "#000000",
        },
        thumb: {
            true: "#ffffff",
            false: "#ffffff",
        },
    },
    danger: "#ff0000",
    success: "#00ff00",
    warning: "#ffff00",
    lowLight: "rgba(0,0,0,0.2)",
    highLight: "rgba(0,0,0,0.4)",
    dropDown: "DARK",
}