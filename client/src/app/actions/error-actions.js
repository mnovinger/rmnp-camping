export const FETCH_ERROR = 'FETCH_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export function fetchError() {
    return {
        type: FETCH_ERROR
    };
}

export function clearError() {
    return {
        type: CLEAR_ERROR
    };
}