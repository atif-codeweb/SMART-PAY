import {createSlice} from '@reduxjs/toolkit';

const themeSlice=createSlice({
    name:'theme',
    initialState:{
        darkMode:localStorage.getItem('darkMode')==='true',
    },
    reducers:{
        toggleTheme:(state)=>{
            state.darkMode=!state.darkMode;
            localStorage.setItem('darkMode',state.darkMode);
            if(state.darkMode){
                document.documentElement.classList.add('dark');
            }
            else{
                document.documentElement.classList.remove('dark')
            }

        }
    }
});

export const {toggleTheme}=themeSlice.actions;
export default themeSlice.reducer;