import { GET_LINKS } from '../constant';

const initState = [];

export default function addReducer(preState = initState, action) {
    const { type, data } = action;
    switch (type) {
        case GET_LINKS:
            return data;
        default:
            return preState;
    }
}
