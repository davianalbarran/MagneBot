const Discord = require('discord.js')
const fetch = require('node-fetch');
module.exports = {
    teamInfo : teamInfo = {
    "help": "Get the queried teams' basic info",
    "func": 
    
    (msg, args)=>{
            getTeamData(args).then(res => {
            console.log(res)
            msg.channel.send(`
            ${res.nickname}
            ----------------------
            School: ${res.school_name}
            Team Number: ${res.team_number}
            State: ${res.state_prov}
            `);
           }).catch(err => {
               msg.channel.send("That team does not exist.")
           })
         }
    }
}
async function getTeamData(team){
    const headers = {
        'X-TBA-Auth-Key': process.env.AUTH_KEY,
        'content-type': 'application/json'
    }
      try{
        const response = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${team}`, {headers: headers})
        const json = await response.json();
        if(await json.key===undefined){
        throw new Error("Team does not exist")
        } 
        return json;
    } catch(error){
        console.log(error);
        throw error;
    }
}

