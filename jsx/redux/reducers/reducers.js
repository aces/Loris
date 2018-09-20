let defaultState = {
  examplePropOne: 'example',
  examplePropTwo: 'test'
};

const reducers = (state = defaultState, action) => {
  switch (action.type) {
    case 'EXAMPLE':
      return {
        ...state,
        examplePropOne: 'newPropOne'
      };
    case 'EXAMPLE_TWO':
      return {
        ...state,
        examplePropTwo: action.payload
      };
    default: return state;
  }
};

export default reducers;
