const fs = require('fs');

const file = fs.readFileSync('./input.txt');
const lines = file.toString().split('\n');

function akey(x,y,z){
    return [x,y,z].join(',')
}

function matchRange(line) {
    return [...line.matchAll(/([\d-]+)\.\.([\d-]+)/g)];
}

function inclusiveRange(from, to) {
    return [...Array((to-from) +1).keys()].map(k => k + from)
}

function setGrid(grid, setStatus, xRange, yRange, zRange){
    for (let x of xRange){
        for (let y of yRange){
            for (let z of zRange){
                grid.set(akey(x,y,z), setStatus)
            }
        }
    }
}

function getGridOn(grid){
    let allStates = [...grid.values()]
    return allStates.filter(v => v === 1).length
}

let grid = new Map()
//init
for (let line of lines){
    let [status, cubeString] = line.split(' ')
    let cubeRanges = cubeString.split(',').map(d => matchRange(d).map(m => m.slice(-2))).flat().map(a => a.map(e => +e))
    let shouldInit = !cubeRanges.flat().some(e => Math.abs(e) > 50)
    if(shouldInit) {
        let [xRange, yRange, zRange] = cubeRanges.map(([from, to]) => inclusiveRange(from, to))
        setGrid(grid, status === 'on' ? 1 : 0, xRange, yRange, zRange)
    }
}
let gridOn = getGridOn(grid)
console.log(gridOn)