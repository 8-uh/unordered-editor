export function createReducer (initialState, actionTypes) {
  return (state = initialState, action) => {
    if (actionTypes[action.type]) {
      if (action.payload) {
        return Object.assign({}, state, action.payload)
      }
    }
    return state
  }
}
