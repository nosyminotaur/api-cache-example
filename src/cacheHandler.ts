const SEPARATOR = '//**//';
const CACHE_INTERVAL = 0.2 * 60 * 1000;

// Useful when creating a new user or similar, where everything starts from scratch.
// Also useful when we need to clear eveything up
function setupCache() {
    localStorage.clear();
}

function store(key: string, value: string) {
    const finalValue = `${value}${SEPARATOR}${Date.now().toString()}`;
    localStorage.setItem(key, finalValue);
}

interface IsValidResponse {
    isValid: boolean,
    value?: string,
}

// Returns true if an object has been stored using the store method
// and have yet not expired
function isValid(key: string): IsValidResponse {
    const value = localStorage.getItem(key);
    if (value === null) {
        return {
            isValid: false,
        };
    }
    const values = value.split(SEPARATOR);
    const timestamp = Number(values[1]);
    if (Number.isNaN(timestamp)) {
        return {
            isValid: false,
        };
    }
    const date = new Date(timestamp);
    if (date.toString() === 'Invalid Date') {
        return {
            isValid: false,
        };
    }
    if ((Date.now() - date.getTime()) < CACHE_INTERVAL) {
        return {
            isValid: true,
            value: values[0],
        };
    }
    localStorage.removeItem(key);
    return {
        isValid: false,
    };
}

export const cache = {
    store, isValid,
};
