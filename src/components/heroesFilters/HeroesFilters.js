import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../store';
import { setActiveFilter, filterHeroes, selectAll } from './heroesFiltersSlice';


import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
	const dispatch = useDispatch();
	const filters = selectAll(store.getState());
	const {activeFilter, filtersLoadingStatus} = useSelector(state => state.filters);

	useEffect(() => {
		dispatch(filterHeroes())
	}, [])

	const setFilters = (filters) => {
		// const clazz = `active`
		return filters.map((item,i) => {
			return <button
						onClick={() => dispatch(setActiveFilter(item.name))}
						key={i}
						className={`btn ${item.className} ${item.name === activeFilter ? 'active' : ''}`}>
					{item.label}
					</button>
		})
	}

	if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

	const element = setFilters(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
					{element}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;
