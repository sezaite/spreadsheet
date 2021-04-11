function whichOperation(cell) {
    const key = Object.keys(cell['formula']).toString();
    switch (key) {
        case "sum":
            return sum((cell['formula']['sum'][0]));
        case "multiply":
            return multiply(cell['formula']['multiply'][0]);
        case 'divide':
            return divide(cell['formula']['divide'][0]);
        case 'is_greater':
            console.log(cell);
            return is_greater(cell['formula']['is_greater'][0]);
        case 'is_equal':
            return is_equal(cell['formula']['is_equal'][0]);
        case 'not':
            return notOp(cell['formula']['not'][0]);
        case 'or':
            orOp(cell['formula']['or'][0]);
        case 'and':
            return andOp(cell['formula']['and'][0]);
        case 'concat':
            return concat(cell['formula']['concat'][0]);
        case 'if':
            return ifOp(cell['formula']['if'][0]);
        default:
            console.log(key);
            console.log(cell);
            console.log('something went wrong');
    }
}

function sum(args) {
    let sum = 0;
    for (let i = 0; i < args.length; i++) {
        if (Object.keys(args[i]['value']) !== 'number') {
            return { 'error': 'type does not match' }
        }
        sum += args[i]['value'];
    }
    return { 'value': { 'number': [sum] } };
}


function multiply(args) {
    let multiplied = 0;
    for (let i = 0; i < args.length; i++) {
        if (Object.keys(args[i]['value']) !== 'number') {
            return { 'error': 'type does not match' }
        }
        multiplied *= args[i]['value'];
    }
    return { 'value': { 'number': [multiplied] } };
}

function divide(args) {
    let divided = 0;
    for (let i = 0; i < args.length; i++) {
        if (Object.keys(args[i]['value']) !== 'number') {
            return { 'error': 'type does not match' }
        }
        divided /= args[i]['value'];
    }
    return { 'value': { 'number': [divided] } };
}
//GALI TEKTI VISUR PRIRASYTI TO STRING
function is_greater(args) {
    let a = args[0];
    let b = args[1];
    // console.log(Object.keys(a['value']));
    // console.log(Object.keys(b['value']));
    if (Object.keys(a['value']) !== 'number' || Object.keys(b['value']) !== 'number') {
        return { 'error': 'type does not match' }
    }
    return { 'value': { 'boolean': [a['value'] > b['value']] } };
}

function is_equal(args) {
    let a = args[0];
    let b = args[1];
    if (Object.keys(a['value']) !== 'number' || Object.keys(b['value']) !== 'number') {
        return { 'error': 'type does not match' }
    }
    return { 'value': { 'boolean': [a['value'] > b['value']] } };
}

function notOp(args) {
    if (Object.keys(args['value']) !== 'boolean') {
        return { 'error': 'type does not match' }
    }
    return { 'value': { 'boolean': [!(args['value'])] } };
}

function orOp(args) {
    for (let i = 0; i < args.length; i++) {
        if (Object.keys(args[i]['value']) === 'boolean') {
            continue
        } else {
            return { 'error': 'type does not match' }
        }
    }
    for (let i = 0; i < args.length; i++) {
        if (args[i]['value']) {
            return { 'value': { 'boolean': true } };
        }
        return { 'value': { 'boolean': false } };
    }
}

function andOp(args) {
    for (let i = 0; i < args.length; i++) {
        if (Object.keys(args[i]['value']) === 'boolean') {
            continue
        } else {
            return { 'error': 'type does not match' }
        }
    }
    for (let i = 0; i < args.length; i++) {
        if (!(args[i]['value'])) {
            return { 'value': { 'boolean': false } };
        }
        return { 'value': { 'boolean': true } };
    }
}

function concat(args) {
    let text = '';
    for (let i = 0; i < args.length; i++) {
        if (Object.keys(args[i]['value']) !== 'text') {
            return { 'error': 'type does not match' }
        }
        text += args[i]['value'];
    }
    return { 'value': { 'text': [text] } };
}

function ifOp(formula) {
    let formulaOp = (Object.keys(formula[0])).toString();
    let formulaBod = formula[0][formulaOp][0]; //sitas per stipriai uznestintas, todel pridejau nuliuka
    let formulaObj = { 'formula': { [formulaOp]: [formulaBod] } };

    let answer = whichOperation(formulaObj);
    return answer ? formula[1] : formula[2];
}


export { whichOperation }