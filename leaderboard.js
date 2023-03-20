const leaderboard = document.querySelector(".leaderboard");
const recordHolderContainer = document.querySelector("[record-holder-container]");
const recordTemplate = document.querySelector("#leaderboard-template");
const recordHolder = document.querySelector("[record-holder]");


let players = [
    {"name": "Kaido", "time": "01:36"},
    {"name": "Khan", "time": "01:56"},
    {"name": "Shiden", "time": "02:36"},
    {"name": "Takashi", "time": "01:06"}
];

const addPlayerLeaderboard = (newAdd) => {
    players.push(newAdd);
} 


refreshLeaderboard = () => {
        while (recordHolderContainer.firstChild) {
            recordHolderContainer.removeChild(recordHolderContainer.firstChild);
        }

        let data = localStorage.getItem('leaderboard') ? JSON.parse(localStorage.getItem('leaderboard')): players
        data = data.sort((a, b) => {
            if (a['time'] > b['time']) return 1;
            if (a['time'] < b['time']) return -1;
            return 0;
        })
        
        data.map(player => {
            const recordsTemplate = recordTemplate.content.cloneNode(true).children[0];
            const timeTemplate = recordTemplate.content.cloneNode(true).children[1];
            recordsTemplate.textContent = player.name;
            timeTemplate.textContent = player.time;
            recordHolderContainer.append(recordsTemplate);
            recordHolderContainer.append(timeTemplate);
        })
        localStorage.setItem('leaderboard', JSON.stringify(players));
    }

    
