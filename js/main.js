async function getData() {
    const response = await fetch('https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator/jobs');
    return response.json();
}

const data = await getData();

const jobs = data['jobs'];

for (let i = 0; i < jobs.length; i++) {//loopina per viss darbus
    for (let j = 0; j < jobs[i]['data'].length; j++) { //loopina per vieno is darbu data visas values
        for (let k = 0; k < jobs[i]['data'][j].length; k++) { //loopina per values sudedamasias dalis, kurios yra arba values, arba formules
            if (Object.keys(jobs[i]['data'][j][k]) == 'formula') {
                if (Object.keys(jobs[i]['data'][j][k]['formula']) != 'reference') {
                    handleJobReferences(jobs[i]['data'][j][k]['formula'])
                    //siunciu sum:referensai
                    //yra operatorius, todel reiks ir taisyti referensus, ir skaiciuoti
                } else {
                    handleJobReferences(jobs[i]['data'][j][k]); //siunciu formula:referensai
                }
            }
        }
    }
}

function handleJobReferences(job) {
    for (let i = 0; i < job.length; i++) {
        if (Object.keys(job[i]) == 'formula') {
            for (let j = 0; j < job[i].length; j++) {
                if (Object.keys(job[i][j]) == 'reference') {
                    replaceReference(job, job[i][j])
                }
            }
        }

    }
}
function replaceReference(job, reference) {
    const splicedReference = reference.split("");
    let x = charCodeAt(splicedReference[0] - 65);
    let y = splicedReference[1] - 1;
    if (Object.keys(job[x][y]) == 'value') {
        return job[x][y];
    } else if (Object.keys(job[x][y]) == 'reference') {
        return replaceReference(job, job[x][y])
    } else {
        console.error('Error: reference error!')
        return false;
    }

}

    // function convertReferencesIntoValues(job) {
    //     //gaunu darbo visas formules ir values. array, sudaryta is array, kuriu vidus - objektai 
    //     // [[{}, {}], [{}, {}]]
    //     //ieskau formula laukelio
    //     //formula laukelyje ieskau reference laukelio
    //     //reference ieskau a1 notaciju
    //     //a1 notacija isskaidau ir paverciu charais
    //     //ziuriu, ar egzsistuoja job[a] ir job[1]
    //     //jei egzistuoja, replace
    //     //jei ne, grazinu klaida
    //     console.log(job);
    //     for (let i = 0; i < job.length; i++)
    //         job
    // }


// N O T E S :
//
    //jobs[i]['data'] - konkretus darbas
    //jobs[i]['data'][j] - konkretaus darbo viena is value (pvz.: value: {number:5} arba value:{number:7}, {formula: }). cia yra tas lygmuo, kur keisis skaiciai (c1, c2, c3)
    //Object.keys(jobs[i]['data'][j][k] - reiksme: formula arba value. lygmuo kuriame keisis raides (a1 b1 c1)




// newArr.push(jobs[i].map())
// mapinti per jobs[i]
// ['data'] jei value, return value, jei formule, paleidziam f -, kuri tikrins formule
// mapinant per jobus reikia mapinti per jobu data, jei jobo[i]['data']value neincludina formula, tai grazini viska taip, kaip yra
// }
// }

// formules tikrinimas:
// tikrini, koks veiksmas
// tikrinti, ar referensas ar value