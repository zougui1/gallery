export const _mapDynamicState = (stateList, reducerName) => state => {
    let tempState = {};
    const isArray = Array.isArray(stateList);
    if(typeof stateList === 'string' || isArray) {
        if(!isArray) stateList = stateList.split(' ');
        stateList.forEach(element => tempState[element] = state[reducerName + 'Reducer'][element]);
    } else if(typeof stateList == 'object') {
        for (const key in stateList) {
            let statePart = stateList[key];
            if(!Array.isArray(statePart)) statePart = statePart.split(' ');
            statePart.forEach(element => tempState[element] = state[key + 'Reducer'][element]);
        }
    }
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