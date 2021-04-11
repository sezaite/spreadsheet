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
        newJob.push(handleJobArrayBlocks(job[i]));
    }
    return newJob;
}

function handleJobArrayBlocks(jobBlock) {
    let newJobBlock = [];
    for (let i = 0; i < jobBlock.length; i++) {
        newJobBlock.push(handleCells(jobBlock[i]))
    }
    return newJobBlock;
}

function handleCells(cell) {
    if (Object.keys(cell) == 'value') {
        return cell;
    } else {
        return whichOperation(cell);

    }
}

export { calculatorStart };