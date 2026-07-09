import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import {transactionAPI} from '../../services/api';

export const fetchTransactions=createAsyncThunk(
    'transactions/fetchAll',
    async(params,{rejectWithValue})=>{
        try{
            const {data}=await transactionAPI.getTransaction(params);
            return data;
        }
        catch(error){
            return rejectWithValue(error.response.data)
        }
    }
);

export const fetchAnalytics=createAsyncThunk(
    'transactions/fetchAnalytics',
    async(_,{rejectWithValue})=>{
        try{
            const {data}=await transactionAPI.getAnalytics();
            return data;
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
);

const transactionSlice=createSlice({
    name:'transactions',
    initialState:{
        transactions:[],
        analytics:null,
        loading:false,
        error:null,
        currentPage:1,
        totalPages:1
    },
    reducers:{
        addTransaction:(state,action)=>{
            state.transactions.unshift(action.payload)
        },
        clearTransactions:(state,action)=>{
            state.transactions=[];
        },

    },
    extraReducers:(builder)=>{
        builder
          .addCase(fetchTransactions.pending,(state)=>{
            state.loading=true
          })
          .addCase(fetchTransactions.fulfilled,(state,action)=>{
            state.loading=false;
            state.transactions=action.payload.transactions;
            state.currentPage=action.payload.currentPage;
            state.totalPages=action.payload.totalPages
          })
          .addCase(fetchTransactions.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message;
          })
          .addCase(fetchAnalytics.fulfilled,(state,action)=>{
            state.analytics=action.payload.analytics;
          });


    }
});

export const {addTransaction,clearTransactions}=transactionSlice.actions;
export default transactionSlice.reducer