async function getData() {
    const response = await fetch('https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator/jobs');
    return response.json();
}

const data = await getData();
const jobs = data['jobs'];
const convertedJobs = referenceConvertionStart(jobs);
console.log(JSON.stringify(convertedJobs));

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
        console.log('Objektas: ' + Object.keys(mainObject));
        return mainObject;
    } else {
        console.log('Objektas: ' + Object.keys(mainObject));
        return { 'formula': handleFormulaTypes(mainObject['formula'], job) };
    }
}

function handleFormulaTypes(formulaObj, job) {
    if (Object.keys(formulaObj) == 'reference') { //basos formules su referensais
        return handleReference(formulaObj, job);
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