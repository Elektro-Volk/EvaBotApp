import React from 'react';
import { ScreenSpinner } from '@vkontakte/vkui';
import axios from 'axios'

let petTypes;

export function send(group, method, params) {
    return axios.get(`http://elektro-volk.ru/apieva/index.php?group=${group}&method=${method}&${window.location.search.substring(1)}`, { params });
}

export function cSend(group, method, params, props, cb) {
    send(group, method, params).then(r => cb(props.fetchedUser, r.data));
}

export async function initPets() {
    if (!petTypes) petTypes = (await send('pets', 'types')).data;
    //alert(petTypes[0].mname)
}

export function getPetType(typeId) {
    return petTypes[typeId - 1];
}

export function getPetTypes() {
    return petTypes;
}

export function makeAction(group, method, params, th, cb) {
    return () => {
        th.props.openSheet(<ScreenSpinner />);
        cSend(group, method, params, th.props, (a, b) => { th.props.openSheet(null); cb(a, b) });
    }
}

export function makeOnRefresh(group, method, params, th, cb) {
    return () => {
        th.setState({ fetching: true });
        cSend(group, method, params, th.props, (a, b) => { cb(a, b); th.setState({ fetching: false }) });
    }
}
