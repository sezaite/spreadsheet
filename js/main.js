import { referenceConvertionStart } from './convertingRefs.js';
import { calculatorStart } from './calculating.js';

document.getElementById('get').addEventListener('click', e => {
    e.preventDefault();
    axios.get('https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator/jobs').then(res => handleData(res.data)).catch(err => console.error(err));
    return;
});





let convertedJobs;
let calculatedResult;
let postData;
let urlWix;
function handleData(data) {
    convertedJobs = referenceConvertionStart(data['jobs']);
    console.log(convertedJobs);
    calculatedResult = calculatorStart(convertedJobs);
    console.log(calculatedResult);
    postData = {
        'email': 'martyna.sezaite@gmail.com',
        'results': [calculatedResult]
    };
    // postData = JSON.stringify(postData);
    urlWix = data['submissionUrl'];
    console.log(postData);
}


