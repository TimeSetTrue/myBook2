import {configureStore} from '@reduxjs/toolkit';
import heroes from '../components/heroesList/heroesListSlice';
import filters from '../components/heroesFilters/heroesFiltersSlice';

const store = configureStore({
	reducer: {heroes, filters},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
	devTools: process.env.NODE_ENV !== 'production',
})


export default store;
