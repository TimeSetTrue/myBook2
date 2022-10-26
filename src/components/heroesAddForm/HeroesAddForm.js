import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import store from '../../store';

import {useHttp} from '../../hooks/http.hook';
import {onAddHero, heroesFetchingError} from '../heroesList/heroesListSlice';
import {selectAll} from '../heroesFilters/heroesFiltersSlice';
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const MyTextInput = ({label, ...props}) => {
	const [field, meta] = useField(props);
	return (
		<div className="mb-3">
			<label htmlFor={props.name} className="form-label">{label}</label>
			<Field {...field} {...props}/>
			{meta.touched && meta.error ? (
			<div className="error">{meta.error}</div>
			) : null}
		</div>
	)
}


const HeroesAddForm = () => {
	const dispatch = useDispatch();
	const filters = selectAll(store.getState());
	const {request} = useHttp();
	const {filtersLoadingStatus} = useSelector(state => state.filters);

	const onSubmitHero = useCallback((values) => {

		const newHero = {
			id: uuidv4(),
			name: values.name,
			description: values.description,
			element: values.element
		}
		request('http://localhost:3001/heroes', "POST", JSON.stringify(newHero))
			.then(res => console.log(res, 'Отправка успешна'))
			.then(dispatch(onAddHero(newHero)))
			.catch(() => dispatch(heroesFetchingError()))
	}, [request])

	const setOptionsForm = (filters) => {
		return filters.map((item, i) => {
			if(item.name === 'all') {
				return null;
			} else {
				return <option key={i} value={item.name}>{item.label}</option>
			}
		})
	}

	// if (filtersLoadingStatus === "loading") {
    //     return <Spinner/>;
    // } else if (filtersLoadingStatus === "error") {
    //     return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    // }

	const element = setOptionsForm(filters);

    return (
		<Formik
		initialValues={{
			name: '',
			description: '',
			element: ''
		}}
		validationSchema={Yup.object({
			name: Yup.string().required('Обязательное поле'),
			description: Yup.string().required('Обязательное поле'),
			element: Yup.string().required('Обязательное поле')
		})}
		onSubmit={(values, action) => {
			onSubmitHero(values);
			action.resetForm({
				name: '',
				description: '',
				element: ''
			})
		}}
		>
			<Form className="border p-4 shadow-lg rounded">
				<MyTextInput
					label="Имя нового героя"
					required
					type="text"
					name="name"
					className="form-control"
					id="name"
					placeholder="Как меня зовут?" />
				<MyTextInput
					label="Описание"
					as="textarea"
					required
					name="description"
					className="form-control"
					id="text"
					placeholder="Что я умею?"
					style={{"height": '130px'}} />
				<div className="mb-3">
					<label htmlFor="element" className="form-label">Выбрать элемент героя</label>
					<Field as="select"
						required
						className="form-select"
						id="element"
						name="element">
						<option >Я владею элементом...</option>
						{element}
					</Field>
				</div>
				<ErrorMessage name="element" component="div" />

				<button type="submit" className="btn btn-primary">Создать</button>
			</Form>
		</Formik>
    )
}

export default HeroesAddForm;
