export const mapDynamicState = (stateList, reducerName) => state => {
    let tempState = {};
    const isArray = Array.isArray(stateList);
    if(typeof stateList === 'string' || isArray) {
        if(!isArray) stateList = stateList.split(' ');
        let statePart;
        statePart = reducerName ? state[reducerName + 'Reducer'] : state;
        stateList.forEach(element => tempState[element] = statePart[element]);
    } else if(typeof stateList == 'object') {
        for (const key in stateList) {
            let statePart = stateList[key];
            if(!Array.isArray(statePart)) statePart = statePart.split(' ');
            statePart.forEach(element => tempState[element] = state[key + 'Reducer'][element]);
        }
    }
    tempState['state'] = state;
    return tempState;
}
