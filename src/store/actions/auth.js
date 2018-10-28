import { auth } from '../action-type';

const {
    LOGIN,
} = auth;

export const login = username => ({ type: LOGIN, payload: username });
