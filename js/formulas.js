function whichOperation(cell) {
    console.log(Object.keys(cell['formula']));
    switch (Object.keys(cell['formula'])) {
        case "sum":
            sum(cell['formula'][Object.keys(cell['formula'])])
            break;
        case "multiply":
            operation = multiply;
            break;
        case 'divide':
            multiply(cell['formula'][Object.keys(cell['formula'])])
            break;
        case 'is_greater':
            divide(cell['formula'][Object.keys(cell['formula'])])
            break;
        case 'is_equal':
            is_greater(cell['formula'][Object.keys(cell['formula'])])
            break;
        case 'not':
            is_equal(cell['formula'][Object.keys(cell['formula'])])
            break;
        case 'or':
            orOp(cell['formula'][Object.keys(cell['formula'])])
            break;
        case 'and':
            andOp(cell['formula'][Object.keys(cell['formula'])])
            break;
        case 'concat':
            concat(cell['formula'][Object.keys(cell['formula'])])
            break;
        case 'if':
            ifOp(cell['formula'][Object.keys(cell['formula'])])
            break;
        default:
            console.log('something went wrong');
    }
}

function sum(...args) {
    let sum = 0;
    for (let i = 0; i < args.length; i++) {
        sum += args[i];
    }
    return sum;
}


function multiply(...args) {
    let multiplied = 0;
    for (let i = 0; i < args.length; i++) {
        multiplied *= args[i];
    }
    return multiplied;
}

function divide(...args) {
    let divided = 0;
    for (let i = 0; i < args.length; i++) {
        divided /= args[i];
    }
    return divided;
}

function is_greater(a, b) {
    return a > b;
}

function is_equal(a, b) {
    return a === b;
}

function notOp(arg) {
    return !arg;
}

function orOp(...args) {
    for (let i = 0; i < args.length; i++) {
        if (args[i]) {
            return true;
        }
    }
}

function andOp(...args) {
    for (let i = 0; i < args.length; i++) {
        if (!args[i]) {
            return false;
        }
    }
    return true;
}

function concat(...args) {
    let text = '';
    for (let i = 0; i < args.length; i++) {
        text += array[i];
    }
    return text;
}

function ifOp(formula) {
    let result = whichOperation(formula['if'][0]);
    return result ? formula['if'][1] : formula['if'][2];
}


export { whichOperation }