import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

import {useHttp} from '../../hooks/http.hook';

const filterAdapter = createEntityAdapter();

const initialState = filterAdapter.getInitialState({
	filtersLoadingStatus : 'idle',
	activeFilter: 'all'
})

// const initialState = {
//     filters: [],
// 	activeFilter: 'all',
// 	,
// 	filteredHeroes: []
// }

export const filterHeroes = createAsyncThunk(
	'heroes/filterHeroes',
	async () => {
		const {request} = useHttp();
		return await request('http://localhost:3001/filters');
	}
)

const heroesFiltersSlicer = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		setActiveFilter: (state, action) => {state.activeFilter = action.payload}
	},
	extraReducers: (builder) => {
		builder
			.addCase(filterHeroes.pending, state => {state.filtersLoadingStatus = 'loading'})
			.addCase(filterHeroes.fulfilled, (state, action) => {
				filterAdapter.setAll(state, action.payload);
				state.filtersLoadingStatus = 'idle'
			})
			.addCase(filterHeroes.rejected, state => {state.filtersLoadingStatus = 'error'})
			.addDefaultCase(() => {})
	}
})

const {actions, reducer} = heroesFiltersSlicer;

export const {selectAll} = filterAdapter.getSelectors(state => state.filters)

export default reducer;
export const {
	filtersFetching,
	filtersFetched,
	filtersFetchingError,
	setActiveFilter
} = actions;
