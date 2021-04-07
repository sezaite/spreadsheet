async function getData() {
    const response = await fetch('https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator/jobs');
    return response.json();
}

const data = await getData();
const jobs = data['jobs'];

for (let i = 0; i < jobs.length; i++) {
    let job = jobs[i]['data'];
    for (let j = 0; j < job.length; j++) {
        for (let k = 0; k < job[j].length; k++) {
            let mainObject = job[j][k];
            if (Object.keys(mainObject) == 'formula') {
                if (Object.keys(mainObject['formula']) == 'reference') {
                    let newValue = replaceReference(mainObject['formula']['reference'], job);
                    if (Object.keys(newValue) == 'error') {
                        job[j][k] = { 'error': newValue['error'] };
                    } else {
                        job[j][k] = { 'value': newValue['value'] };
                    }
                } else {
                    let afterOperatorArr = mainObject['formula'][Object.keys(mainObject['formula'])];
                    for (let l = 0; l < afterOperatorArr.length; l++) {
                        if (Object.keys(afterOperatorArr[l]) == 'reference') {
                            let newValue = replaceReference(afterOperatorArr[l]['reference'], job);
                            if (Object.keys(newValue) == 'error') {
                                job[j][k] = { 'error': newValue['error'] };
                            } else {
                                job[j][k]['formula'][Object.keys(job[j][k]['formula'])] = { 'value': newValue['value'] };
                            }
                        } else {
                            console.log('ten buvo value');
                        }

                    }
                }
            } else {
                //jei ne formules, o VALUES
                //nieko nedaryti

            }
        }
    }
}

console.log(JSON.stringify(jobs))

function replaceReference(reference, job) {
    const splicedReference = reference.split("");
    let y = (splicedReference[0].charCodeAt()) - 65;
    let x = splicedReference[1] - 1;
    if (Object.keys(job[x][y]) == 'value') {
        return { 'value': job[x][y]['value'] };
    } else if (Object.keys(job[x][y]) == 'formula') {
        if (Object.keys(job[x][y]['formula'] == 'reference')) {
            return replaceReference(job[x][y]['formula']['reference'], job);
        } else {
            return { 'error': 'formula does include something else' }
        }
    } else {
        return { 'error': 'referene not found' };
    }
}
// S T E P S :

// A) JEI REFERENCES
// 1) pagriebti mainObject['formula']['reference'] ir pasiusti stringa referensu tvarkytojui kartu su darbu (job);


// N O T E S :

    //job = jobs[i]['data'] - konkretus darbas, array tipas. viskas, kas eina po 'data', didzioji array; 

    //job[j] = mazasis array, sudarytas is didziuju objektu. reprezentuos referenso skaicius  A1 - job[0];

    // mainObject = job[j][k] - didieji objektai, kuriu key visuomet arba formula, arba value. outputs:
    //    {"value":{"boolean":false}};
    //    {"formula":{"not":{"reference":"A1"}}};
    //    {"formula":{"reference":"E1"}};
    //    {"formula":{"and":[{"reference":"A2"},{"reference":"B2"}]}};

    //mainObject['formula'] - referensai arba operatoriai. mazesnieji OBJEKTAI. outputs:
    //     {"and":[{"reference":"A1"},{"reference":"B1"}]};
    //     {"reference":"C1"};
    //     {"concat":[{"value":{"text":"Hello"}},{"value":{"text":", "}},{"value":{"text":"World!"}}]}

    //mainObject['formula']['reference'] - referensai, bet ne formules. raide ir skaicius - stringai. galutine reiksme



    // else if (Object.keys(newValue) == 'reference') {
    //     console.log('darbo numeris: ' + jobs[i]['id'])
    //     console.log(JSON.stringify(mainObject['formula']['reference']) + ' pakeista i ' + JSON.stringify(newValue));
    //     mainObject['formula']['reference'] = newValue['reference'];
    //     console.log(JSON.stringify(mainObject['formula']));
    //     newValue = replaceReference(mainObject['formula']['reference'], job);
    // }


