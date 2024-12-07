import { configureStore, createSlice } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const walletSlice = createSlice({
  name: "wallet",
  initialState: { address: "" },
  reducers: {
    setWalletAddress: (state, action) => {
      state.address = action.payload;
    },
    clearWalletAddress: (state) => {
      state.address = "";
    },
  },
});

const networkSlice = createSlice({
  name: "network",
  initialState: { network: "kinto" },
  reducers: {
    setNetwork: (state, action) => {
      state.network = action.payload;
    },
    clearNetwork: (state) => {
      state.network = "";
    },
  },
});

export const { setWalletAddress, clearWalletAddress } = walletSlice.actions;

export const { setNetwork, clearNetwork } = networkSlice.actions;

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  wallet: walletSlice.reducer,
  network: networkSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
