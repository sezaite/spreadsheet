const fetch = require("node-fetch");
async function getData() {
    const response = await fetch('https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator/jobs');
    return response.json();
}
const fs = require('fs');
getData()
    .then(data => {
        fs.writeFileSync('student-2.json', data);
        console.log('The file has been saved!');
    });

