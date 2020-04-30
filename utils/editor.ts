import Dynamic from '@ironbay/dynamic'
import React, { useState, useEffect } from 'react'

function reducer(state, [path, value]) {
	const next = JSON.parse(JSON.stringify(state))
	if (path.length === 0) {
		return { ...next, ...value }
	}
	Dynamic.put(next, path, value)
	return next
}

export function editor(initial_data) {
	const [state, updateState] = React.useReducer(reducer, initial_data)
	const updateForm = (path) =>
		React.useCallback(({ target: { value } }) => {
			updateState([path, value])
		}, [])
	const mergeForm = React.useCallback((path, value, cb = () => true) => {
		if (path.constructor === Object) {
			value = path
			path = []
		}
		updateState([path, value])
		cb()
	}, [])
	return [state, updateForm, mergeForm]
}