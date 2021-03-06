const fs = require('fs');

const file = fs.readFileSync('./input.txt');
const line = file.toString().split(',').map(e => +e);
const sortedLine = line.sort((a,b) => a-b);

function inclusiveRange(from, to) {
    return [...Array(to +1).keys()].slice(from)
}

function costOfDistance(distance){
    return (distance*(distance+1))/2;
}

const minCost = inclusiveRange(sortedLine[0], sortedLine.slice(-1)[0]).reduce((min, i) => {
    const cost = sortedLine.reduce((sum, elem) => sum += costOfDistance(Math.abs(elem-i)), 0);
    return Math.min(min, cost);
}, Number.MAX_SAFE_INTEGER);
console.log(minCost);
