

export function loadSession() {
    try {
        const serializedState = sessionStorage.getItem("state");

        if (serializedState === null) {
            return undefined;
        }

        return JSON.parse(serializedState);
    } catch (err) {
        console.log(`Failed to load app state from session. ${err}`);
        return undefined;
    }
}


export function saveSession(state) {
    try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem("state", serializedState);
    } catch (err) {
        console.log(`Failed to save app state within session. ${err}`);
    }
}
