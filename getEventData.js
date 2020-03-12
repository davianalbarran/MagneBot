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
                getEventTeamData(msg, argYear, argKey)
                    .catch((e) => {
                        console.log(e);
                        msg.channel.send(e.message);
                    })
                    .then(res => {
                        if (typeof res === Error) {
                            throw new Error(res);
                        }
                    });
            },
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

async function getEventTeamData(message, year, eKey) {
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
    const filter = (msg) => {
        let pages = ['1', '2', '3'];
        return pages.some((elem) => msg.content === elem);
    };
    const messCollect = message.channel.createMessageCollector(filter, { time: 60000 });
    try {
        console.log(year + eventKey);
        const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${year + eventKey}/teams`, { headers: headers });
        if (response.status !== 200) {
            throw new Error('Cannot find event at that year!');
        }
        else {
            let formattedRes = await response.json();
            console.log(formattedRes);
            messCollect.on('collect', (mess) => {
                let messInt = (parseInt(mess.content) === 1) ? 0 : (parseInt(mess.content) === 2) ? 10 : 20;
                for (let i = 0 + messInt; i < 10 + messInt; i++) {
                    mess.channel.send(`
                ${formattedRes[i].nickname}
                ----------------------
                    Team #: ${formattedRes[i].team_number}
                    City: ${formattedRes[i].city}
                    State: ${formattedRes[i].state_prov}
                `);
                }
            });
            messCollect.on('end', () => {
                for (let i = 30; i < formattedRes.length; i++) {
                    message.channel.send(`
                ${formattedRes[i].nickname}
                ----------------------
                    Team #: ${formattedRes[i].team_number}
                    City: ${formattedRes[i].city}
                    State: ${formattedRes[i].state_prov}
                `);
                }
                message.channel.send('Ending process...');
            });
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}