const Discord = require('discord.js');
const fetch = require('node-fetch');

const eventRequest = {
    eventInfo: eventInfo = {
        "help": "Get the queried events' basic info",
        "event-simple":
            (msg, argYear, argKey) => {
                getEventSimpData(argYear, argKey).then(res => {
                    console.log(res);
                    msg.channel.send(`
        ${res.name}
        ----------------------
        Week: ${res.week}
        City: ${res.city}
        State: ${res.state_prov}
        `);
                }).catch(err => {
                    msg.channel.send(err);
                });
            },
        "event-rankings":
            (msg, argYear, argKey) => {
                getEventRankData(argYear, argKey)
                    .catch((e) => {
                        console.log(e);
                        msg.channel.send("That event does not exist.")
                    })
                    .then(res => {
                        console.log(res);
                        res.rankings.forEach(e => {
                            if (e.rank > 8) return;
                            msg.channel.send(`
                Rank: ${e.rank}
                ----------------------
                Team Number: ${e.team_key}
                Record: 
                    Wins: ${e.record.wins}
                    Losses: ${e.record.losses}
                    Ties: ${e.record.ties}
                `);
                        });
                    });
            },
        "event-teams":
            (msg, argYear, argKey) => {
                getEventTeamData(argYear, argKey)
                    .catch((e) => {
                        console.log(e);
                        msg.channel.send("That event does not exist.")
                    })
                    .then(res => {
                        if (typeof res === Error) {
                            throw new Error(res);
                        }
                        let length = res.length;
                        console.log(res);
                        for (let i = 0; i < length; i++) {
                            msg.channel.send(`
                ${res[i].nickname}
                ----------------------
                    Week: ${res[i].week}
                    Team #: ${res[i].team_number}
                    City: ${res[i].city}
                    State: ${res[i].state_prov}
                `);
                        }
                    });
            },
        "event-teams-lim":
            (msg, argYear, argKey, argLim) => {
                getEventTeamData(argYear, argKey, argLim)
                    .catch((e) => {
                        console.log(e);
                        msg.channel.send("That event does not exist.")
                    })
                    .then(res => {
                        if (typeof res === Error) {
                            throw new Error(res);
                        }
                        console.log(res);
                        let length = res.length;
                        for (let i = 0; i < length; i++) {
                            msg.channel.send(`
                ${res[i].nickname}
                ----------------------
                    Week: ${res[i].week}
                    Team #: ${res[i].team_number}
                    City: ${res[i].city}
                    State: ${res[i].state_prov}
                `);
                        }
                    });
            }
    },
    "event-keys": {
        "MountOlive": "njfla",
        "Robbinsville": "njrob",
        "Montgomery": "njski"
    }
}
module.exports = eventRequest;

async function getEventSimpData(year, eKey) {
    let eventKey;
    switch (eKey) {
        case 'MountOlive':
            eventKey = eventRequest["event-keys"].MountOlive;
            break;
        case 'Robbinsville':
            eventKey = eventRequest["event-keys"].Robbinsville;
            break;
        case 'Montgomery':
            eventKey = eventRequest["event-keys"].Montgomery;
            break;
    }
    const headers = {
        'X-TBA-Auth-Key': process.env.AUTH_KEY,
        'content-type': 'application/json'
    }
    try {
        console.log(year + eventKey);
        const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${year + eventKey}`, { headers: headers });
        if (response.status === 404) {
            throw new Error();
        }
        else {
            const formattedRes = await response.json();
            console.log(formattedRes);
            return formattedRes;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getEventRankData(year, eKey) {
    let eventKey;
    switch (eKey) {
        case 'MountOlive':
            eventKey = eventRequest["event-keys"].MountOlive;
            break;
        case 'Robbinsville':
            eventKey = eventRequest["event-keys"].Robbinsville;
            break;
        case 'Montgomery':
            eventKey = eventRequest["event-keys"].Montgomery;
            break;
    }
    const headers = {
        'X-TBA-Auth-Key': process.env.AUTH_KEY,
        'content-type': 'application/json'
    }
    try {
        console.log(year + eventKey);
        const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${year + eventKey}/rankings`, { headers: headers });
        if (response.status === 404) {
            throw new Error();
        }
        else {
            const formattedRes = await response.json();
            console.log(formattedRes);
            return formattedRes;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getEventTeamData(year, eKey, limit) {
    let eventKey;
    switch (eKey) {
        case 'MountOlive':
            eventKey = eventRequest["event-keys"].MountOlive;
            break;
        case 'Robbinsville':
            eventKey = eventRequest["event-keys"].Robbinsville;
            break;
        case 'Montgomery':
            eventKey = eventRequest["event-keys"].Montgomery;
            break;
    }
    const headers = {
        'X-TBA-Auth-Key': process.env.AUTH_KEY,
        'content-type': 'application/json'
    }
    try {
        console.log(year + eventKey);
        const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${year + eventKey}/teams`, { headers: headers });
        if (limit !== null) {
            if (response.status === 404) {
                throw new Error();
            }
            else {
                let formattedRes = await response.json();
                console.log(formattedRes);
                let limRes = [];
                for (let i = 0; i < limit; i++) {
                    limRes[i] = await formattedRes[i];
                    console.log(limRes);
                }
                return limRes;
            }
        }
        else {
            if (response.status === 404) {
                throw new Error();
            }
            else {
                let formattedRes = await response.json();
                console.log(formattedRes);
                return formattedRes;
            }
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}