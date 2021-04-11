function referenceConvertionStart(jobs) { //LOOPING THROUGH THE WHOLE JSON
    let newJobs = [];
    for (let i = 0; i < jobs.length; i++) {
        newJobs.push({ "id": `job-${i}`, "data": handleBigArr(jobs[i]['data']) });
    }
    return newJobs;
}

function handleBigArr(job) {// LOOPING THROUGH THE WHOLE JOB ARRAY WHICH IS MADE OF SMALLER ARRAYS
    let newJob = [];
    for (let i = 0; i < job.length; i++) {
        newJob.push(handleSmallArr(job[i], job))
    }
    return newJob;
}

function handleSmallArr(smallArr, job) { //LOOPING THROUGH SMALLER ARRAYS WHICH ARE MADE OF VALUES OR FORMULAS
    let newSmallArr = [];
    for (let i = 0; i < smallArr.length; i++) {
        newSmallArr.push(handleMainObj(smallArr[i], job));
    }
    return newSmallArr;
}

function handleMainObj(mainObject, job) {
    if (Object.keys(mainObject) == 'value' || Object.keys(mainObject) == 'error') {
        return mainObject;
    } else {
        if (Object.keys(mainObject['formula']) == 'reference') {
            return handleReference(mainObject['formula'], job);
        } else {
            return { 'formula': handleFormulaTypes(mainObject['formula'], job) };
        }
    }
}

function handleFormulaTypes(formulaObj, job) {
    if (Object.keys(formulaObj) == 'if') {
        let formulaBody = isBodyArray(formulaObj['if'], job);
        return { 'if': [formulaBody] };
    } else { // jei nera if tik operatorius {and: Array(2)}
        let operator = (Object.keys(formulaObj));
        let formulaBody = isBodyArray(formulaObj[operator], job);

        return { [operator]: [formulaBody] };
    }
}

function isBodyArray(formula, job) {
    if (Array.isArray(formula)) {
        let newFormulaArr = [];
        for (let i = 0; i < formula.length; i++) {
            newFormulaArr.push(handleFormulaBody(formula[i], job))
        }
        return newFormulaArr;
    } else {
        return handleFormulaBody(formula, job);
    }
}

function handleFormulaBody(formula, job) {
    if (Object.keys(formula) == 'value') {
        return formula;
    } else if (Object.keys(formula) == 'reference') {
        return handleReference(formula, job);
    } else {
        const operator = Object.keys(formula);
        let formulaBody = handleLittleFormula(formula[operator], job);
        formulaBody = formulaBody;
        return { [operator]: [formulaBody] };
    }
}


function handleLittleFormula(formulaBody, job) {
    let newFormulaArr = [];
    for (let i = 0; i < formulaBody.length; i++) {
        if (Object.keys(formulaBody[i]) == 'value' || Object.keys(formulaBody[i]) == 'error') {
            newFormulaArr.push(formulaBody[i]);
        } else if (Object.keys(formulaBody[i]) == 'reference') {
            newFormulaArr.push(handleReference(formulaBody[i], job));
        } else {
            console.log('something important is missing');
        }
    }
    return newFormulaArr;
}

function handleReference(referenceObj, job) {
    const reference = referenceObj['reference'];
    const splicedReference = reference.split("");
    let y = (splicedReference[0].charCodeAt()) - 65;
    let x = splicedReference[1] - 1;
    if (Object.keys(job[x][y]) == 'value') {
        return { 'value': job[x][y]['value'] };
    } else if (Object.keys(job[x][y]) == 'formula') {
        if (Object.keys(job[x][y]['formula'] == 'reference')) {
            return handleReference(job[x][y]['formula'], job);
        } else {
            return { 'error': 'formula does not include no reference' }
        }
    } else {
        return { 'error': 'reference not found' };
    }
}

export { referenceConvertionStart }