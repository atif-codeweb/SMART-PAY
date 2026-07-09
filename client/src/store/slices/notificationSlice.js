import {createSlice} from '@reduxjs/toolkit';

const notificationSlice=createSlice({
    name:'notification',
    initialState:{
        notifications:[]
    },
    reducers:{
        showNotification:(state,action)=>{
            const notification={
                id:Date.now(),
                type:action.payload.type||'info',
                message:action.payload.message,
                duration:action.payload.duration||3000
            }
            state.notifications.push(notification);
        },
        removeNotification:(state,action)=>{
            state.notifications=state.notifications.filter(
                (notif)=>notif.id!==action.payload
            );
        },
        clearNotification:(state)=>{
            state.notifications=[];
        }
    }
});

export const {showNotification,removeNotification,clearNotification}=notificationSlice.actions;
export default notificationSlice.reducer;