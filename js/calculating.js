import { whichOperation } from './formulas.js';

function calculatorStart(convertedJobs) {
    let finalArr = [];
    for (let i = 0; i < convertedJobs.length; i++) {
        finalArr.push({ "id": `job-${i}`, "data": handleJobs(convertedJobs[i]['data']) });
    }
    return finalArr;
}

function handleJobs(job) {
    let newJob = [];
    for (let i = 0; i < job.length; i++) {
        newJob.push(handleJobArrayBlocks(job[i], job));
    }
    return newJob;
}

function handleJobArrayBlocks(jobBlock, job) {
    let newJobBlock = [];
    for (let i = 0; i < jobBlock.length; i++) {
        newJobBlock.push(handleCells(jobBlock[i]), job)
    }
    return newJobBlock;
}

function handleCells(cell, job) {
    if (Object.keys(cell) == 'value') {
        return cell;
    } else {
        return whichOperation(cell);

    }
}

// {
//     "formula":

//     { "if": [{ "is_greater": [{ "reference": "A1" }, { "reference": "B1" }] }, { "reference": "A1" }, { "reference": "B1" }] }

// }

export { calculatorStart };