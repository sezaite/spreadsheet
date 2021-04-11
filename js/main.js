import { referenceConvertionStart } from './convertingRefs.js';
import { calculatorStart } from './calculating.js';

async function getData() {
    const response = await fetch('https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator/jobs');
    return response.json();
}

const data = await getData();
const jobs = data['jobs'];
const convertedJobs = referenceConvertionStart(jobs);
// console.log(JSON.stringify(convertedJobs));
const calculatedResult = calculatorStart(convertedJobs);
const postData = {
    'email': 'martyna.sezaite@gmail.com',
    'results': [calculatedResult]
}
const url = data['submissionUrl'];

// GET REQUEST
function getTodos() {
    console.log('GET Request');
}

// POST REQUEST
function addTodo() {
    console.log('POST Request');
}

document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);