export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const EVENT_KEY = {
    backspace: 8,
    tab: 9,
    enter: 13,
    esc: 27,
    space: 32,
    end: 35,
    home: 36,
    leftArrow: 37,
    upArrow: 38,
    rightArrow: 39,
    downArrow: 40,
    del: 46,

    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,

    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,

    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
};

/**
 * Get a random integer number in the range (inclusive).
 */
export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random float number in the range (inclusive).
 */
export function getRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

/**
 * Rounds a number to a specified decimal case.
 */
export function round(num: number, dec: number) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

/**
 * Converts a time (in milliseconds) to a string (with the number of days/hours...).
 */
export function timeToString(dateMilliseconds: number) {
    // :: convert to days/hours :: //

    //in milliseconds
    var second = 1000;
    var minute = 60 * second;
    var hour = 60 * minute;
    var day = 24 * hour;

    var minutesLeft = 0;
    var hoursLeft = 0;
    var daysLeft = 0;
    var secondsLeft = 0;

    //count the days
    while (dateMilliseconds > day) {
        daysLeft++;

        dateMilliseconds -= day;
    }

    //count the hours
    while (dateMilliseconds > hour) {
        hoursLeft++;

        dateMilliseconds -= hour;
    }

    //count the minutes
    while (dateMilliseconds > minute) {
        minutesLeft++;

        dateMilliseconds -= minute;
    }

    //and the seconds
    secondsLeft = round(dateMilliseconds / 1000, 2);

    // :: construct the string :: //

    var theDate = [
        ["day", daysLeft],
        ["hour", hoursLeft],
        ["minute", minutesLeft],
        ["second", secondsLeft],
    ];

    var constructDate = function (dateTmp: string, numberOf: number) {
        // day to days, hour to hours...
        if (numberOf !== 1) {
            dateTmp += "s";
        }

        return numberOf + " " + dateTmp + " ";
    };

    // limit the number of units to be shown (days/hours, or hours/minutes or minutes/seconds, and not days/hours/minutes for example)
    var totalUnits = 2;

    var date = "";
    var i;

    for (i = 0; i < theDate.length; i++) {
        // reached the limit of the units
        if (totalUnits === 0) {
            break;
        }

        const unit = theDate[i][0] as string;
        const value = theDate[i][1] as number;

        // only show when there's something relevant to be shown
        // (for example: 0 days 2 hours 2 minutes... no point showing the days part)
        if (value !== 0) {
            date += constructDate(unit, value);
            totalUnits--;
        }
    }

    return date;
}

/**
 * Capitalize a single word (first letter uppercase).
 */
export function capitalize(word: string) {
    if (word.length === 0) {
        return word;
    }

    return word[0].toUpperCase() + word.slice(1);
}

/**
 * Get the width of an element (including margins).
 */
export function outerWidth(element: HTMLElement) {
    const width = element.offsetWidth;
    const style = window.getComputedStyle(element);

    const left = parseInt(style.marginLeft!, 10);
    const right = parseInt(style.marginRight!, 10);

    return width + left + right;
}

/**
 * Get the height of an element (including margins).
 */
export function outerHeight(element: HTMLElement) {
    const height = element.offsetHeight;
    const style = window.getComputedStyle(element);

    const top = parseInt(style.marginTop!, 10);
    const bottom = parseInt(style.marginBottom!, 10);

    return height + top + bottom;
}
