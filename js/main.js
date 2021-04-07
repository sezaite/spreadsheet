async function getData() {
    const response = await fetch('https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator/jobs');
    return response.json();
}

const data = await getData();

const jobs = data['jobs'];

for (let i = 0; i < jobs.length; i++) {//loopina per visus darbus kaip kad job1
    for (let j = 0; j < jobs[i]['data'].length; j++) { //loopina per vieno is job visa data array, kuri sudaryta is kitu smulkesniu arrays, kuriu viduje yra formules arba values // sita perduoti i referencu funkcijas kaip job'a (tipas - array)
        for (let k = 0; k < jobs[i]['data'][j].length; k++) { //loopina per array vidu, kurias sudaro objektai: values, arba formules, kuriu reiksmes irgi objektai. 
            //ATSIJOJAM VALUES NUO FORMULU:
            let mainObject = jobs[i]['data'][j][k];
            if (Object.keys(mainObject) == 'formula') { //jeigu objekto key yra formule, reiskia, reikes kazka keisti (nes value paliekam kaip yra)
                //ATSIJOJAM TAS FORMULES, KURIOS BE OPERATORIU:
                if (Object.keys(mainObject['formula']) == 'reference') { //
                    const newValue = replaceReference(mainObject['formula']['reference'], jobs[i]['data']);

                    if (Object.keys(newValue) == 'error') {
                        mainObject = { 'error': newValue['error'] };
                    } else if (Object.keys(newValue) == 'reference') {
                        mainObject['formula'] = { 'reference': newValue['reference'] };
                        replaceReference(mainObject['formula']['reference'], jobs[i]['data']);
                    } else {
                        mainObject = { 'value': newValue['value'] };
                        alert(JSON.stringify(mainObject['value'], jobs[i]));
                    }
                    //FORMULES SU OPERATORIAIS:
                } else {

                    // jobs[i]['data'][j][k]['formula'] = handleJobReferences(jobs[i]['data'][j][k]['formula'], jobs[i]['data']);
                    //siunciu operatorius:referensai
                    //yra operatorius, todel reiks ir taisyti referensus, ir skaiciuoti




                }
            }
        }
    }
}


function replaceReference(reference, job) {
    console.log('reference is' + reference);
    const splicedReference = reference.split("");
    let y = (splicedReference[0].charCodeAt()) - 65;
    let x = splicedReference[1] - 1;
    console.log(x, y);
    if (Object.keys(job[x][y]) == 'value') {
        return { 'value': job[x][y] };
    } else if (Object.keys(job[x][y]['formula']) == 'reference') {
        return { 'reference': job[x][y]['formula']['reference'] }
        // job[x][y]['formula']['reference'] 
        // return replaceReference(job[x][y]['formula']['reference'], job);
    } else {
        console.error('Error: reference error!')
        return { 'error': 'referene not found' };
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