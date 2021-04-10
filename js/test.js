


for (let i = 0; i < jobs.length; i++) {
    let job = jobs[i]['data'];
    for (let j = 0; j < job.length; j++) {
        for (let k = 0; k < job[j].length; k++) {
            let mainObject = job[j][k];
            if (Object.keys(mainObject) == 'formula') {
                //HANDLE FORMULAS WITH NO OPERATORS:
                if (Object.keys(mainObject['formula']) == 'reference') {
                    let newValue = replaceReference(mainObject['formula']['reference'], job);
                    if (Object.keys(newValue) == 'error') {
                        job[j][k] = { 'error': newValue['error'] };
                    } else {
                        job[j][k] = { 'value': newValue['value'] };
                    }
                    // ^ IKI CIA VISKAS OK 
                } else if (Object.keys(mainObject['formula']) == 'if') {
                    for (let l = 0; l < mainObject['formula']['if'].length; l++) {
                        if (Object.keys(mainObject['formula']['if'][l]) == 'reference') {
                            let newValue = replaceReference(mainObject['formula']['if'][l]['reference'], job);
                            if (Object.keys(newValue) == 'error') {
                                job[j][k] = { 'error': newValue['error'] };
                            } else {
                                job[j][k]['formula']['if'][l] = { 'value': newValue['value'] };
                            }
                        } else { // JEI SU if ir su OPERATORIUMI 
                            let newValue = handleReferencesWithOperators(mainObject['formula']['if'][l][Object.keys(mainObject['formula']['if'][l])]);
                            if (Object.keys(newValue) == 'error') {
                                job[j][k] = { 'error': newValue['error'] };
                            } else {
                                job[j][k]['formula']['if'][l][] = { 'value': newValue['value'] };
                            }
                        }



                        {

                        }


                    }

                }
                let newFormula = handleReferencesWithOperators(mainObject['formula']['if']);

                for (let l = 0; l < afterOperatorArr.length; l++) {
                    if (Object.keys(afterOperatorArr[l]) == 'reference') {
                        let newValue = replaceReference(afterOperatorArr[l]['reference'], job);
                        if (Object.keys(newValue) == 'error') {
                            job[j][k] = { 'error': newValue['error'] };
                        } else {
                            newFormula.push({ 'value': newValue['value'] });
                        }
                    } else {
                        newFormula.push(afterOperatorArr[l]);
                    }
                    job[j][k]['formula'][Object.keys(job[j][k]['formula'])] = newFormula;
                }
            }
        } else {
            let newFormula = [];
            let afterOperatorArr = mainObject['formula'][Object.keys(mainObject['formula'])];
            if (!Array.isArray(afterOperatorArr)) {
                afterOperatorArr = [afterOperatorArr];
            }
            for (let l = 0; l < afterOperatorArr.length; l++) {
                if (Object.keys(afterOperatorArr[l]) == 'reference') {
                    let newValue = replaceReference(afterOperatorArr[l]['reference'], job);
                    if (Object.keys(newValue) == 'error') {
                        job[j][k] = { 'error': newValue['error'] };
                    } else {
                        newFormula.push({ 'value': newValue['value'] });
                    }
                } else {
                    newFormula.push(afterOperatorArr[l]);
                }
                job[j][k]['formula'][Object.keys(job[j][k]['formula'])] = newFormula;
            }
        }
    }
}
}


function getValues() {

}
function handleReferencesWithOperators(opArray, job) {
    if (!Array.isArray(opArray)) {
        opArray = [opArray];
    }
    let newValue = [];
    for (let i = 0; i < opArray.length; i++) {
        if (Object.keys(opArray[i]) == 'reference') {
            newValue.push(replaceReference(opArray[i]['reference'], job));
        } else {
            newValue.push(opArray[i]);
        }
        return newValue;
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


{
    "id": "job-16", "data": [
        [{ "value": { "number": 2 } },
        { "value": { "number": 1.5 } },



        {
            "formula": {
                "if": [{ "is_greater": [{ "reference": "A1" }, { "reference": "B1" }] },

                { "reference": "A1" }, { "reference": "B1" }]
            }
        }



        ]
    ]
}

// job[i] loopo pradzioje - naujas tuscias arr, i kuri pushinsim sutvarkytus job[i][j]
//job[i][j] loopo pradzioje - naujas tuscias arr, i kuri pushinsim sutvarkytus job[i][j][k] (main obj)

// jei keys(job[i][j][k]) == 'value' - tiesiog push

// jei keys(job[i][j][k]['formula']) == 'reference' - paleisti referensu gaudymo masina 
// jei ne
//jei if, nuskaptuoti ifa ir pasigauti references ir values array, loopinti per ja
//pasigauti references ir values array, loopinti per ja kaip per value ir reference

for (let i = 0; i < jobs.length; i++) {
    let job = jobs[i]['data'];
    for (let j = 0; j < job.length; j++) {
        for (let k = 0; k < job[j].length; k++) {
            let mainObject = job[j][k];
            if (Object.keys(mainObject) == 'formula') {
            }
        }
    }
}