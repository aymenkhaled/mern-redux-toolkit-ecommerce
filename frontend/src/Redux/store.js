import { configureStore } from "@reduxjs/toolkit";
import categorieReducer from "../Features/categorieSlice";
import scategorieReducer from "../Features/scategorieSlice";
import articleReducer from "../Features/articleSlice";
import authReducer from "../Features/AuthSlice";
import cartReducer from "../Features/cartSlice";
import orderReducer from "../Features/orderSlice";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import logger from 'redux-logger'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}
const persistedReducer = persistReducer(persistConfig, authReducer)

const store = configureStore({
  reducer: {
    categories: categorieReducer,
    scategories: scategorieReducer,
    articles: articleReducer,
    auth:persistedReducer,
    cart: cartReducer,
    order: orderReducer,
  },

 

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(logger)

})
export default store
