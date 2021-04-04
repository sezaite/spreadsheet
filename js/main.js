async function getData() {
    const response = await fetch('https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator/jobs');
    return response.json();
}

const data = await getData();

const jobs = data['jobs'];
console.log(jobs);

for (let i = 0; i < jobs.length; i++) {
    mapinti per jobs[i]['data']
    jei value, return value, jei formule, paleidziam f -, kuri tikrins formule
}
}

formules tikrinimas:
tikrini, koks veiksmas
tikrinti, ar referensas ar value
apsirasyti nesuderinamumus