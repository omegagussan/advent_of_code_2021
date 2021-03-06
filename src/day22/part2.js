const fs = require('fs');

const file = fs.readFileSync('./input.txt');
const lines = file.toString().split('\n');

function zip(a,b) {
    return a.map((k, i) => [k, b[i]])
}

function matchRange(line) {
    return [...line.matchAll(/([\d-]+)\.\.([\d-]+)/g)];
}

function cuboidVolume(sign, cube){
    return (cube[1] - cube[0] + 1) * (cube[3] - cube[2] + 1) * (cube[5] - cube[4] + 1) * sign
}

function parseRows() {
    return lines.map(line => {
        let [status, cubeString] = line.split(' ')
        let sign = (status === 'on') ? 1 : -1
        let newCube = cubeString.split(',')
            .map(d => matchRange(d).map(m => m.slice(-2)))
            .flat(2).map(e => +e)
        return [sign, ...newCube]
    });
}

let rows = parseRows();

const cuboids = [];
for (const [nSign, ...newCube] of rows) {
    const compensationIntersectionCubes = []
    for (const [oSign, ...oldCube] of cuboids) {
        const cubeDiff = zip(newCube, oldCube);
        const minDims = cubeDiff.filter((e,i) => i % 2 === 0).map(a => Math.max(...a))
        const maxDims = cubeDiff.filter((e,i) => i % 2 === 1).map(a => Math.min(...a))
        const allDims = zip(minDims, maxDims)
        const noIntersectionCondition = allDims.some(([min, max]) => min > max)
        if (noIntersectionCondition) continue
        compensationIntersectionCubes.push([-oSign, ...allDims.flat()]);
    }
    cuboids.push(...compensationIntersectionCubes);
    if (nSign === 1) cuboids.push([1, ...newCube]);
}

const sum = cuboids.reduce((acc, [s, ...c]) => acc + cuboidVolume(s, c), 0)
console.log(sum);