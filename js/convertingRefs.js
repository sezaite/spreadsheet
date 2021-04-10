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
        let formulaBody = handleFormulaBody(formulaObj['if'], job);
        return { 'if': [formulaBody] };
    } else { // jei nera if tik operatorius {and: Array(2)}
        let operator = Object.keys(formulaObj);
        let formulaBody = handleFormulaBody(formulaObj[operator], job); //COA KAZKAS NE TO ATSITINKA, formula body tampa undefined

        return { [operator]: [formulaBody] };
    }
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

function handleFormulaBody(formula, job) {
    let newFormulaArr = [];
    for (let i = 0; i < formula.length; i++) {
        if (Object.keys(formula[i]) == 'value') {
            newFormulaArr.push(formula[i]);
        } else if (Object.keys(formula[i]) == 'reference') {
            newFormulaArr.push(handleReference(formula[i], job));
        } else {
            const operator = Object.keys(formula[i]);
            let formulaBody = handleLittleFormula(formula[i][operator], job);
            formulaBody = formulaBody;
            newFormulaArr.push({ [operator]: [formulaBody] });
        }
        return newFormulaArr.flat();
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

export { referenceConvertionStart }