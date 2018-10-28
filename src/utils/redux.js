export const _mapDynamicState = (stateList, reducerName) => state => {
    let tempState = {};
    if(!Array.isArray(stateList)) stateList = stateList.split(' ');
    stateList.forEach(element => tempState[element] = state[reducerName + 'Reducer'][element]);
    return tempState;
}

// TODO make it work...
export const _mapDynamicDispatch = array => dispatch => {
    let tempDispatch = {};
    array.forEach(element => {
        if(Array.isArray(element))
            tempDispatch[element[0]] = (arg, id) => dispatch(element[0](arg, id));
        else
            tempDispatch[element] = arg => dispatch(element(arg));
    });
    console.log(tempDispatch)
    return tempDispatch;
}