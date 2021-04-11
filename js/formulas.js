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
            return is_greater(cell['formula']['is_greater'][0]);
        case 'is_equal':
            return is_equal(cell['formula']['is_equal'][0]);
        case 'not':
            return notOp(cell['formula']['not'][0]);
        case 'or':
            return orOp(cell['formula']['or'][0]);
        case 'and':
            return andOp(cell['formula']['and'][0]);
        case 'concat':
            return concat(cell['formula']['concat'][0]);
        case 'if':
            return ifOp(cell['formula']['if'][0]);
        default:
            console.log(cell);
            console.log('something went wrong');
    }
}

function sum(args) {
    let sum = 0;
    for (let i = 0; i < args.length; i++) {
        if (Object.keys(args[i]['value']) != 'number') {
            console.log(Object.keys(args[i]['value']));
            return { 'error': 'type does not match' }
        }
        sum += args[i]['value']['number'];
    }
    return { 'value': { 'number': sum } };
}

function multiply(args) {
    let multiplied = 1;
    for (let i = 0; i < args.length; i++) {
        if (Object.keys(args[i]['value']) != 'number') {
            return { 'error': 'type does not match' }
        }
        multiplied *= args[i]['value']['number'];
    }
    return { 'value': { 'number': multiplied } };
}

function divide(args) {
    let a = args[0];
    let b = args[1];
    if (Object.keys(a['value']) != 'number' || Object.keys(b['value']) != 'number') {
        return { 'error': 'type does not match' }
    }
    let divided = a['value']['number'] / b['value']['number'];
    return { 'value': { 'number': divided } };
}

function is_greater(args) {
    let a = args[0];
    let b = args[1];
    if (Object.keys(a['value']) != 'number' || Object.keys(b['value']) != 'number') {
        return { 'error': 'type does not match' }
    }
    return { 'value': { 'boolean': a['value']['number'] > b['value']['number'] } };
}

function is_equal(args) {
    let a = args[0];
    let b = args[1];
    if (Object.keys(a['value']) != 'number' || Object.keys(b['value']) != 'number') {
        return { 'error': 'type does not match' }
    }
    return { 'value': { 'boolean': a['value']['number'] == b['value']['number'] } };
}

function notOp(args) {
    if (Object.keys(args['value']) != 'boolean') {
        return { 'error': 'type does not match' }
    }
    return { 'value': { 'boolean': !args['value']['boolean'] } }
}

function orOp(args) {
    console.log(args);
    let truthCount = 0;
    for (let i = 0; i < args.length; i++) {
        console.log(args[i]['value']);
        if (Object.keys(args[i]['value']) != 'boolean') {
            return { 'error': 'type does not match' }
        }
        if (args[i]['value']['boolean'] == true) {
            truthCount++;
            continue;
        } else {
            continue;
        }
    }
    return truthCount > 0 ? { 'value': { 'boolean': true } } : { 'value': { 'boolean': false } };
}

function andOp(args) {
    for (let i = 0; i < args.length; i++) {
        if (Object.keys(args[i]['value']) != 'boolean') {
            return { 'error': 'type does not match' }
        }
        if (args[i]['value']['boolean']) {
            continue;
        } else {
            return { 'value': { 'boolean': false } };
        }
    }

    return { 'value': { 'boolean': true } }
}

function concat(args) {
    let text = '';
    for (let i = 0; i < args.length; i++) {
        if (Object.keys(args[i]['value']) != 'text') {
            return { 'error': 'type does not match' }
        }
        text += args[i]['value']['text'];
    }
    return { 'value': { 'text': text } };
}

function ifOp(formula) {
    let formulaOp = (Object.keys(formula[0])).toString();
    let formulaBod = formula[0][formulaOp][0]; //sitas per stipriai uznestintas, todel pridejau nuliuka
    let formulaObj = { 'formula': { [formulaOp]: [formulaBod] } };

    let answer = whichOperation(formulaObj);
    return answer ? formula[1] : formula[2];
}

export { whichOperation }