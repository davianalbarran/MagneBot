require('dotenv').config({path: 'safety.env'});
const teamQuery = require('./getTeamData.js')
const fetch = require('node-fetch');
const Discord = require('discord.js')
const magneBot = new Discord.Client();
const TOKEN = process.env.TOKEN;
global.magneBot = magneBot;
magneBot.login(TOKEN);

magneBot.on('ready', () => {
    console.info(`Logged in as ${magneBot.user.tag}!`);
  });

  magneBot.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
    if (!channel) return;
    channel.send(`Welcome to Team 3340, ${member}`);
  });

  magneBot.on('message', msg => {
     console.log('recieved a msg.')
     var args = msg.content.split(' ');
   try{
     switch(args[0]){
        case '!teamInfo': 
        console.log('teaminfo')
       teamQuery.teamInfo.func(msg, args[1]);
    }
}
catch(err){
    console.log(err)
    throw err;
}
  })