const Discord = require('discord.js')
const fetch = require('node-fetch');

const eventRequest = {
    eventInfo : eventInfo = {
    "help": "Get the queried events' basic info",
    "event-simple": 
    
    (msg, argYear, argKey)=>{
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
            msg.channel.send("That event does not exist.")
        });
    },
    "event-rankings":
    (msg, argYear, argKey)=>{
        getEventRankData(argYear, argKey).then(res => {
            console.log(res);
            res.rankings.forEach(e => {
                if(e.rank>8) return;
                msg.channel.send(`
                Rank: ${e.rank}
                ----------------------
                Team Number: ${e.team_key}
                Record: 
                    Wins: ${e.record.wins}
                    Losses: ${e.record.losses}
                    Ties: ${e.record.ties}
                `);
                }).catch(err => {
                    msg.channel.send("That event does not exist.")
                });            
            });
    },
    "event-teams":
    (msg, argYear, argKey, argLimit)=>{
        getEventTeamData(argYear, argKey).then(res => {
            console.log(res);
            let limit = 0;
            if(!argLimit) argLimit = 10;
            res.array.forEach(element => {
                if(limit>argLimit) return;
                msg.channel.send(`
                ${element.name}
                ----------------------
                Week: ${element.week}
                City: ${element.city}
                State: ${element.state_prov}
                `);
                }).catch(err => {
                    msg.channel.send("That event does not exist.")
                });
                limit++;
            });
    }
    },
    "event-keys" : {
        "Mount Olive" : "njfla",
        "Robbinsville" : "njrob",
        "Montgomery" : "njski"
    }
}
module.exports = eventRequest;

async function getEventSimpData(year, eKey) {
    let eventKey;
    switch(eKey) {
        case 'Mount Olive':
            eventKey = eventRequest["event-keys"]["Mount Olive"];
        case 'Robbinsville':
            eventKey = eventRequest["event-keys"].Robbinsville;
        case 'Montgomery':
            eventKey = eventRequest["event-keys"].Montgomery;
    }
    const headers = {
        'X-TBA-Auth-Key': process.env.AUTH_KEY,
        'content-type': 'application/json'
    }
    try{
        const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${year+eventKey}`, {headers: headers})
        const json = await response.json();
        if(await json.key===undefined){
            throw new Error("Event cannot be found or is not in our database");
        } 
        return json;
    } catch(error){
        console.log(error);
        throw error;
    }
}

async function getEventRankData(year, eKey) {
    let eventKey;
    switch(eKey) {
        case 'Mount Olive':
            eventKey = eventRequest["event-keys"]["Mount Olive"];
        case 'Robbinsville':
            eventKey = eventRequest["event-keys"].Robbinsville;
        case 'Montgomery':
            eventKey = eventRequest["event-keys"].Montgomery;
    }
    const headers = {
        'X-TBA-Auth-Key': process.env.AUTH_KEY,
        'content-type': 'application/json'
    }
    try{
        const response =  await fetch(`https://www.thebluealliance.com/api/v3/event/${year+eventKey}/rankings`, {headers: headers});
        const json = await response.json();
        if(await json.rankings===undefined){
            throw new Error("Event cannot be found or is not in our database");
        } 
        return json;
    } catch(error){
        console.log(error);
        throw error;
    }
}

async function getEventTeamData(year, eKey, limit) {
    let eventKey;
    switch(eKey) {
        case 'Mount Olive':
            eventKey = eventRequest["event-keys"]["Mount Olive"];
        case 'Robbinsville':
            eventKey = eventRequest["event-keys"].Robbinsville;
        case 'Montgomery':
            eventKey = eventRequest["event-keys"].Montgomery;
    }
    const headers = {
        'X-TBA-Auth-Key': process.env.AUTH_KEY,
        'content-type': 'application/json'
    }
    try{
        const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${year+eventKey}/teams`, {headers: headers})
        const json = await response.json();
        if(await json.team_number===undefined){
            throw new Error("Event cannot be found or is not in our database");
        } 
        return json;
    } catch(error){
        console.log(error);
        throw error;
    }
}