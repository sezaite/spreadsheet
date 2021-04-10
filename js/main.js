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
        newJobs.push({ "id": `job-${i}`, "data": handleBigArr(jobs[i]['data']) });
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
    if (Object.keys(formulaObj['formula']) == 'if') {
        let smallArr = formulaObj['formula']['if'];
        if (!Array.isArray(smallArr)) {
            smallArr = [smallArr];
        }
        let ifContent = handleSmallFormulas(smallArr, job); //grazina array su visuo, kas eina po if'o, jei yra if'as
        return { 'formula': { 'if': [ifContent] } };
    } else {
        let smallArr = formulaObj['formula'];
        if (!Array.isArray(smallArr)) {
            smallArr = [smallArr];
        }
        let ifContent = handleSmallFormulas(smallArr, job);
        return { 'formula': [ifContent] };
    }



    function handleSmallFormulas(smallArr, job) {
        let newArr = [];
        for (let i = 0; i < smallArr.length; i++) {
            if (Object.keys(smallArr[i]) == 'value') {
                newArr.push(smallArr[i]);
            } else if (Object.keys(smallArr[i]) == 'reference') {
                newArr.push(handleReference(smallArr[i], job));
            } else {
                const formulaContent = handleSmallArr(smallArr[i][Object.keys(smallArr[i])], job); //cia man grazina sutvarkyta small arr
                console.log(Object.keys(smallArr[i]));
                console.log(formulaContent);
                newArr.push({ [Object.keys(smallArr[i])]: [formulaContent] });
                console.log({ [Object.keys(smallArr[i])]: [formulaContent] });
            }

        }
        return newArr;
    }
}


    //formula objektas kurio value yra objektas kurio value array kurio sudedamosios dalys yra objektai
    // {
    //     "formula": {
    //         "if": [{ "is_greater": [{ "reference": "A1" }, { "reference": "B1" }] }, { "reference": "A1" }, { "reference": "B1" }
    //         ]
    //     }
    // }

    // {
    //     "formula": {
    //         ["is_equal": [{ "reference": "A1" }, { "reference": "B1" }]]
    //     }
    // };