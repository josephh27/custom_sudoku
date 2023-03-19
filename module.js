export const addPlayerLeaderboard = (newRecord) => {
    const fs = require('fs');
    let data = fs.readFileSync('records.json');
    let myObject = JSON.parse(data);
    myObject.push(newRecord);
    fs.writeFile('records.json', JSON.stringify(myObject), err => {
        //Error checking
        if (err) throw err;
    });
} 