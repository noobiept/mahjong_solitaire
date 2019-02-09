import { Score } from "./high_score";

export interface Data {
    mahjong_high_score?: Score; // all the high-scores
    mahjong_sound_muted?: boolean; // whether the sound is muted or not
    mahjong_selected_map?: number; // last selected map position in the main menu
}

/**
 * Calls the `callback` with a dictionary that has all the requested keys/values from `localStorage`.
 */
export function getData(keys: (keyof Data)[], callback: (data: Data) => void) {
    var data: Data = {};

    for (var a = 0; a < keys.length; a++) {
        var key = keys[a];
        var value = localStorage.getItem(key);

        data[key] = value && JSON.parse(value);
    }

    callback(data);
}

/**
 * Sets the given key/value into `localStorage`. Calls the `callback` when its done.
 * Converts the value to string (with json).
 */
export function setData(items: Data, callback?: () => void) {
    for (var key in items) {
        if (items.hasOwnProperty(key)) {
            const dataKey = key as keyof Data;
            const item = items[dataKey];

            localStorage.setItem(key, JSON.stringify(item));
        }
    }

    if (callback) {
        callback();
    }
}

/**
 * Remove the given keys from the `localStorage`.
 */
export function removeData(keys: (keyof Data)[]) {
    for (let a = 0; a < keys.length; a++) {
        const key = keys[a];
        localStorage.removeItem(key);
    }
}
