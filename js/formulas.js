function whichOperation(cell) {
    const key = Object.keys(cell['formula']).toString();
    switch (key) {
        case "sum":
            sum((cell['formula']['sum']).flat());
            break;
        case "multiply":
            multiply(cell['formula']['multiply']);
            break;
        case 'divide':
            divide(cell['formula']['divide']);
            break;
        case 'is_greater':
            is_greater(cell['formula']['is_greater']);
            break;
        case 'is_equal':
            is_equal(cell['formula']['is_equal']);
            break;
        case 'not':
            notOp(cell['formula'][Object.keys(cell['formula'])]);
            break;
        case 'or':
            orOp(cell['formula']['or']);
            break;
        case 'and':
            andOp(cell['formula']['and']);
            break;
        case 'concat':
            concat(cell['formula']['concat']);
            break;
        case 'if':
            ifOp(cell['formula']['if']);
            break;
        default:
            console.log('something went wrong');
    }
}

function sum(...args) {
    console.log('laba diena');
    let sum = 0;
    for (let i = 0; i < args.length; i++) {
        console.log(args[i]);
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