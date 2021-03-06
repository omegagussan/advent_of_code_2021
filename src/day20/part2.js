const fs = require('fs');

const file = fs.readFileSync('./input.txt');
let lines = file.toString().split('\n');
let [algo, _, ...image] = lines
image = image.filter(a => a !== '')
const ROWS = image.length;
const COLS = image[0].length;
let rowRange = Array.from(Array(ROWS).keys()).map(e => +e)
let colRange = Array.from(Array(COLS).keys()).map(e => +e)

const print = (matrixDict, label='grid') => {
    let matrix = Object.entries(matrixDict).map(e => [e[1], e[0].split(',')]);
    let [maxRow, maxCol] = matrix.reduce((acc, val) => [Math.max(acc[0], val[1][0]), Math.max(acc[1], val[1][1])], [0, 0])
    let [minRow, minCol] = matrix.reduce((acc, val) => [Math.min(acc[0], val[1][0]), Math.min(acc[1], val[1][1])], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER])
    let grid = new Array(maxRow - minRow + 1).fill(0).map(() => new Array(maxCol - minCol + 1).fill(0));
    matrix.forEach(([v, [r,c]]) => {grid[r-minRow][c-minCol]=v});
    console.log('----' + label + '------')
    grid.forEach(l => console.log(l.join('') + '\n'))
}

const getSize = (matrixDict) => {
    let matrix = Object.entries(matrixDict).map(e => [e[1], e[0].split(',')]);
    let [maxRow, maxCol] = matrix.reduce((acc, val) => [Math.max(acc[0], val[1][0]), Math.max(acc[1], val[1][1])], [0, 0])
    let [minRow, minCol] = matrix.reduce((acc, val) => [Math.min(acc[0], val[1][0]), Math.min(acc[1], val[1][1])], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER])
    console.log(maxRow, minRow, maxCol, minCol)
}

function countLit(grid) {
    let lit = 0
    for (let [_, val] of Object.entries(grid)) {
        if (val === '#') {
            lit += 1
        }
    }
    return lit;
}

function key(r, c){
    return r + ',' + c
}

let grid = image.reduce((acc, row, rowIdx) => {
    let rowArray = [...row]
    for (const [colIdx, v] of rowArray.entries()){
        acc[key(rowIdx, colIdx)] = v
    }
    return acc;
}, {});

function getGridOr(grid, k, char){
    return grid[k] ? grid[k] : char
}

const algoDict = algo.split('').reduce((acc, val, idx) => {
    acc[idx] = val
    return acc;
}, {});

//OBS! Order matters we need to go from smallest to biggest as picture is upsides down
const N_PATTERN = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1,-1], [1,0], [1, 1]]
function getNeighbourKeys(currKey){
    let [row, col] = currKey.split(',').map(e=>+e)
    return N_PATTERN.map(([a,b]) =>key(row+a, col+b))
}

function getImageFromCenter(grid, key, char){
    return getNeighbourKeys(key).map(k => getGridOr(grid, k, char))
}

function pass(grid, expand=true, fillerChar) {
    rowRange = [rowRange[0] - 1, ...rowRange, rowRange.slice(-1)[0] + 1]
    colRange = [colRange[0] - 1, ...colRange, colRange.slice(-1)[0] + 1]
    const inserts = {}
    for (const r of rowRange) {
        for (const c of colRange) {
            let k = key(r, c)
            let binary = getImageFromCenter(grid, k, fillerChar).map(e => e === '#' ? 1 : 0).join('')
            let int = Number.parseInt(binary, 2)
            inserts[k] = algoDict[int]
        }
    }
    return inserts
}

const isAlternating = algoDict[0] === '#'
for (let i=0; i < 50; i++){
    if (i === 0){grid = pass(grid, true,'.');}
    else if (i % 2 === 1){grid = pass(grid, false, isAlternating ? '#' : '.');}
    else {grid = pass(grid, false, '.');}
}
console.log(countLit(grid));
