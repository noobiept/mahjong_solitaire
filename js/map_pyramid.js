    // each array (inside the main one) corresponds to a grid (and array of 'grids')
    // inside the grid array, we have several objects with the position where we'll put a tile
var PYRAMID = [
        // first grid
    [
            // 4 outside
        { column: 0, line: 0 },
        { column: 18, line: 0 },
        { column: 0, line: 18 },
        { column: 18, line: 18 },

            // 8x8 square
        { column: 2, line: 2 },
        { column: 4, line: 2 },
        { column: 6, line: 2 },
        { column: 8, line: 2 },
        { column: 10, line: 2 },
        { column: 12, line: 2 },
        { column: 14, line: 2 },
        { column: 16, line: 2 },

        { column: 2, line: 4 },
        { column: 4, line: 4 },
        { column: 6, line: 4 },
        { column: 8, line: 4 },
        { column: 10, line: 4 },
        { column: 12, line: 4 },
        { column: 14, line: 4 },
        { column: 16, line: 4 },

        { column: 2, line: 6 },
        { column: 4, line: 6 },
        { column: 6, line: 6 },
        { column: 8, line: 6 },
        { column: 10, line: 6 },
        { column: 12, line: 6 },
        { column: 14, line: 6 },
        { column: 16, line: 6 },

        { column: 2, line: 8 },
        { column: 4, line: 8 },
        { column: 6, line: 8 },
        { column: 8, line: 8 },
        { column: 10, line: 8 },
        { column: 12, line: 8 },
        { column: 14, line: 8 },
        { column: 16, line: 8 },

        { column: 2, line: 10 },
        { column: 4, line: 10 },
        { column: 6, line: 10 },
        { column: 8, line: 10 },
        { column: 10, line: 10 },
        { column: 12, line: 10 },
        { column: 14, line: 10 },
        { column: 16, line: 10 },

        { column: 2, line: 12 },
        { column: 4, line: 12 },
        { column: 6, line: 12 },
        { column: 8, line: 12 },
        { column: 10, line: 12 },
        { column: 12, line: 12 },
        { column: 14, line: 12 },
        { column: 16, line: 12 },

        { column: 2, line: 14 },
        { column: 4, line: 14 },
        { column: 6, line: 14 },
        { column: 8, line: 14 },
        { column: 10, line: 14 },
        { column: 12, line: 14 },
        { column: 14, line: 14 },
        { column: 16, line: 14 },

        { column: 2, line: 16 },
        { column: 4, line: 16 },
        { column: 6, line: 16 },
        { column: 8, line: 16 },
        { column: 10, line: 16 },
        { column: 12, line: 16 },
        { column: 14, line: 16 },
        { column: 16, line: 16 }
    ],

        // second grid
    [
        // 6x6 square
        { column: 4, line: 4 },
        { column: 6, line: 4 },
        { column: 8, line: 4 },
        { column: 10, line: 4 },
        { column: 12, line: 4 },
        { column: 14, line: 4 },

        { column: 4, line: 6 },
        { column: 6, line: 6 },
        { column: 8, line: 6 },
        { column: 10, line: 6 },
        { column: 12, line: 6 },
        { column: 14, line: 6 },

        { column: 4, line: 8 },
        { column: 6, line: 8 },
        { column: 8, line: 8 },
        { column: 10, line: 8 },
        { column: 12, line: 8 },
        { column: 14, line: 8 },

        { column: 4, line: 10 },
        { column: 6, line: 10 },
        { column: 8, line: 10 },
        { column: 10, line: 10 },
        { column: 12, line: 10 },
        { column: 14, line: 10 },

        { column: 4, line: 12 },
        { column: 6, line: 12 },
        { column: 8, line: 12 },
        { column: 10, line: 12 },
        { column: 12, line: 12 },
        { column: 14, line: 12 },

        { column: 4, line: 14 },
        { column: 6, line: 14 },
        { column: 8, line: 14 },
        { column: 10, line: 14 },
        { column: 12, line: 14 },
        { column: 14, line: 14 }
    ],

        // third grid
    [
        // 5x5 square
        { column: 5, line: 5 },
        { column: 7, line: 5 },
        { column: 9, line: 5 },
        { column: 11, line: 5 },
        { column: 13, line: 5 },

        { column: 5, line: 7 },
        { column: 7, line: 7 },
        { column: 9, line: 7 },
        { column: 11, line: 7 },
        { column: 13, line: 7 },

        { column: 5, line: 9 },
        { column: 7, line: 9 },
        { column: 9, line: 9 },
        { column: 11, line: 9 },
        { column: 13, line: 9 },

        { column: 5, line: 11 },
        { column: 7, line: 11 },
        { column: 9, line: 11 },
        { column: 11, line: 11 },
        { column: 13, line: 11 },

        { column: 5, line: 13 },
        { column: 7, line: 13 },
        { column: 9, line: 13 },
        { column: 11, line: 13 },
        { column: 13, line: 13 }
    ],

        // fourth grid
    [
        // 3x3 square
        { column: 7, line: 7 },
        { column: 9, line: 7 },
        { column: 11, line: 7 },

        { column: 7, line: 9 },
        { column: 9, line: 9 },
        { column: 11, line: 9 },

        { column: 7, line: 11 },
        { column: 9, line: 11 },
        { column: 11, line: 11 }
    ],
        // fifth
    [
        // 2x2 square
        { column: 8, line: 8 },
        { column: 10, line: 8 },

        { column: 8, line: 10 },
        { column: 10, line: 10 }
    ],
        // sixth
    [
        { column: 9, line: 9 }
    ],

        // seventh
    [
        { column: 9, line: 9 }
    ]
];