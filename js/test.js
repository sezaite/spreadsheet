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
        console.log(jobs[i]['id']);
        newJobs.push({ "id": `job-${i}`, "data": handleBigArr(jobs[i]['data']) });
    }
    return newJobs;
}

function handleBigArr(job) { //pasiuncia po darba
    let newJob = [];
    for (let i = 0; i < job.length; i++) {
        newJob.push(handleSmallArr(job[i], job)) //gauna po array bloka ir sukisa i viena atnaujinta darba, viskas ok
    }
    return newJob;
}

function handleSmallArr(smallArr, job) { //sitas turi sutvrkyti visa didiji darbo bloka bloka
    //gaunam blokus kuriuos sudaro arba pavieniai objektai (formules arba values), arba arrays is formuliu ir values
    // if (Array.isArray(smallArr) && smallArr.length > 1) { //jei array
    let newSmallArr = [];
    for (let i = 0; i < smallArr.length; i++) {
        newSmallArr.push(handleMainObj(smallArr[i], job)); //kiekviena objekteli is array bloko sutvakys
    }
    return newSmallArr;
}
// } else { //jei pavieniai
//     return handleMainObj(smallArr[0], job); //sutvakys objekta, nes jis tik vienas
// }


function handleMainObj(mainObj, job) { //the main question ar cia value ar formula//REIKIA, KAD GRAZINTU OBJEKTUS
    if (Object.keys(mainObj) == 'value' || Object.keys(mainObj) == 'error') {
        return mainObj; //jei value arba error tai tiesiog grazina viska kaip yra
    } else if (Object.keys(mainObj) == 'reference') {
        return handleReference(mainObj, job);
    } else {
        return handleFormulas(mainObj, job);
    }
}

function handleReference(mainObj, job) { //TURI GRAZINTI OBJEKTUS BL
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
        let formulaContent = formulaObj['formula']['if'];
        let ifContent = handleSmallFormulas(formulaContent, job); //grazina array su visuo, kas eina po if'o, jei yra if'as
        let operator = formulaObj['formula']['if'][Object.keys(formulaObj['formula']['if'])];
        return { 'formula': { 'if': { [operator]: [ifContent] } } };
    } else if (Object.keys(formulaObj['formula']) == 'reference') {
        let formulaContent = formulaObj['formula'];
        let content = handleReference(formulaContent, job);
        return { 'formula': [content] };
    } else {
        let formulaContent = formulaObj['formula'];
        let operator = formulaObj['formula'][Object.keys(formulaObj['formula'])];

        let ifContent = handleSmallFormulas(formulaContent, job);
        return { 'formula': { [operator]: [ifContent] } };
    }


    function handleSmallFormulas(formulaContent, job) {
        if (Array.isArray(formulaContent)) {
            let newArr = [];
            for (let i = 0; i < formulaContent.length; i++) {
                newArr.push(handleMiniArr(formulaContent[i], job));
            }
            return newArr;
        } else {

            return handleMiniArr(formulaContent, job);
        }
    }
}

function handleMiniArr(obj, job) {
    if (Object.keys(obj) == 'value') {
        return obj;
    } else if (Object.keys(obj) == 'reference') {
        return handleReference(obj, job);
    } else {
        const formulaContent = handleSmallArr(obj[Object.keys(obj)], job);
        return { [Object.keys(obj)]: [formulaContent] };
    }
}


