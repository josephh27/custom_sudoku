const recordHolderContainer = document.querySelector("[record-holder-container]");
const recordTemplate = document.querySelector("#leaderboard-template");


let players = [
    {"name": "Kaido", "time": "01:36"},
    {"name": "Khan", "time": "01:56"},
    {"name": "Shiden", "time": "02:36"},
    {"name": "Takashi", "time": "01:06"}
];

export const addFloodLeaderboard = (newAdd) => {
    players = localStorage.getItem('floodingLeaderboard') ? JSON.parse(localStorage.getItem('floodingLeaderboard')) : players;
    players.push(newAdd);
    localStorage.setItem('floodingLeaderboard', JSON.stringify(players));
} 


export const refreshLeaderboard = () => {
        while (recordHolderContainer.firstChild) {
            recordHolderContainer.removeChild(recordHolderContainer.firstChild);
        }

        let data = localStorage.getItem('floodingLeaderboard') ? JSON.parse(localStorage.getItem('floodingLeaderboard')): players
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
        localStorage.setItem('floodingLeaderboard', JSON.stringify(data));
    }

    
