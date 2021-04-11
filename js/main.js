import { referenceConvertionStart } from './convertingRefs.js';
import { calculatorStart } from './calculating.js';

document.getElementById('get').addEventListener('click', e => {
    e.preventDefault();
    axios.get('https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator/jobs').then(res => handleData(res.data)).catch(err => console.error(err));
    return;
});

document.getElementById('post').addEventListener('click', e => {
    e.preventDefault();
    axios.post(urlWix, postData).then(res => console.log(res)).catch(err => console.error(err));
    return;
});



let convertedJobs;
let calculatedResult;
let postData;
let urlWix;
function handleData(data) {
    convertedJobs = referenceConvertionStart(data['jobs']);
    console.log(JSON.stringify(convertedJobs));
    calculatedResult = calculatorStart(convertedJobs);
    postData = {
        'email': 'martyna.sezaite@gmail.com',
        'results': calculatedResult
    };
    postData = JSON.stringify(postData);
    urlWix = (data['submissionUrl']).toString();
    console.log(postData);
}


