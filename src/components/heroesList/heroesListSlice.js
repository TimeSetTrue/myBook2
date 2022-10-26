import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

import {useHttp} from '../../hooks/http.hook';

const heroesAdapter = createEntityAdapter();

const initialState = heroesAdapter.getInitialState({
	heroesLoadingStatus: 'idle'
})

export const fetchHeroes = createAsyncThunk(
	'heroes/fetchHeroes',
	async () => {
		const {request} = useHttp();
		return await request("http://localhost:3001/heroes");
	}
)

const heroesListSlice = createSlice({
	name: 'heroes',
	initialState,
	reducers: {
		onAddHero: (state, action) => {heroesAdapter.addOne(state, action.payload)},
		onDeleted: (state, action) => {heroesAdapter.removeOne(state, action.payload)}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
			.addCase(fetchHeroes.fulfilled, (state, action) => {
				heroesAdapter.setAll(state, action.payload);
				state.heroesLoadingStatus = 'idle'
			})
			.addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error'})
			.addDefaultCase(() => {})
	}
})

const {actions, reducer} = heroesListSlice;

const {selectAll} = heroesAdapter.getSelectors(state => state.heroes)

export const filteredHeroesSelector = createSelector(
	selectAll,
	(state) => state.filters.activeFilter,
	(heroes, filters) => {
		if(filters === 'all') {
			return heroes;
		} else {
			return heroes.filter(item => item.element === filters)
		}
	}
)

export default reducer;
export const {
	heroesFetching,
	heroesFetched,
	heroesFetchingError,
	onAddHero,
	onDeleted
} = actions;
