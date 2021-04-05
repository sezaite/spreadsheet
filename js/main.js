async function getData() {
    const response = await fetch('https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator/jobs');
    return response.json();
}

const data = await getData();

const jobs = data['jobs'];
let newArr = [];
// console.log(Object.keys(jobs));
for (let i = 0; i < jobs.length; i++) {//loopina per viss darbus
    for (let j = 0; j < jobs[i]['data'].length; j++) { //loopina per vieno is darbu data visas values
        for (let k = 0; k < jobs[i]['data'][j].length; k++) {
            handleReferences(jobs[i]['data']);
            if (Object.keys(jobs[i]['data'][j][k]) == 'formula') {
                console.log(`radau formule: ${Object.keys(jobs[i]['data'][j][k])}`);
                const replacedFormula = handleFormula(convertedJob);
            } else {
                console.log(`formules nera, yra tik ${Object.keys(jobs[i]['data'][j][k])} `);
            }
        }
    }
}

function handleFormula(formula, job) {
    const convertedJob = handleReferences(job)
    return { 'value': calculatedValue }
}

function handleReferences(job) {

}



// N O T E S :
//
    //jobs[i]['data'] - konkretus darbas
    //jobs[i]['data'][j] - konkretaus darbo viena is value (pvz.: value: {number:5} arba value:{number:7}, {formula: })
    //Object.keys(jobs[i]['data'][j][k] - reiksme: formula arba value




// newArr.push(jobs[i].map())
// mapinti per jobs[i]
// ['data'] jei value, return value, jei formule, paleidziam f -, kuri tikrins formule
// mapinant per jobus reikia mapinti per jobu data, jei jobo[i]['data']value neincludina formula, tai grazini viska taip, kaip yra
// }
// }

// formules tikrinimas:
// tikrini, koks veiksmas
// tikrinti, ar referensas ar value