async function getData() {
    const response = await fetch('https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator/jobs');
    return response.json();
}

const data = await getData();
const jobs = data['jobs'];
const convertedJobs = referenceConvertionStart(jobs);
console.log(JSON.stringify(convertedJobs));

function referenceConvertionStart(jobs) {
    let newJobs = [];
    for (let i = 0; i < jobs.length; i++) {
        newJobs.push(handleBigArr(jobs[i]['data']));
    }
    return newJobs;
}

function handleBigArr(job) {
    let newJob = [];
    for (let i = 0; i < job.length; i++) {
        newJob.push(handleSmallArr(job[i], job))
    }
    return newJob;
}

function handleSmallArr(smallArr, job) {
    let newSmallArr = [];
    for (let i = 0; i < smallArr.length; i++) {
        newSmallArr.push(handleMainObj(smallArr[i], job));
    }
    return newSmallArr;
}

function handleMainObj(mainObj, job) {
    if (Object.keys(mainObj) == 'value' || Object.keys(mainObj) == 'error') {
        return mainObj;
    } else if (Object.keys(mainObj) == 'reference') {
        return handleReference(mainObj, job);
    } else {
        return handleFormulas(mainObj, job);
    }
}

function handleReference(mainObj, job) {
    const reference = mainObj['reference'];
    const splicedReference = reference.split("");
    let y = (splicedReference[0].charCodeAt()) - 65;
    let x = splicedReference[1] - 1;
    if (Object.keys(job[x][y]) == 'value') {
        return { 'value': job[x][y]['value'] };
    } else if (Object.keys(job[x][y]) == 'formula') {
        if (Object.keys(job[x][y]['formula'] == 'reference')) {
            return handleReference(job[x][y]['formula'], job);
        } else {
            return { 'error': 'formula does include something else' }
        }
    } else {
        return { 'error': 'reference not found' };
    }
}

function handleFormulas(formulaObj, job) {
    let smallArr = [];
    if (Object.keys(formulaObj) == 'if') {
        smallArr = formulaObj['if'];
        if (!Array.isArray(smallArr)) {
            smallArr = [smallArr];
        }
        const operator = Object.keys(formulaObj['if']);
        const formulaValues = handleSmallArr(smallArr, job);
        return { 'formula': { 'if': { [operator]: [formulaValues] } } };
    } else {
        smallArr = formulaObj[Object.keys(formulaObj)];
        if (!Array.isArray(smallArr)) {
            smallArr = [smallArr];
        }
        const operator = Object.keys(formulaObj);
        const formulaValues = handleSmallArr(smallArr, job);
        return { 'formula': { [operator]: [formulaValues] } };
    }
}



