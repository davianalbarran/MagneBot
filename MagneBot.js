require('dotenv').config({ path: 'safety.env' });
const teamQuery = require('./getTeamData.js');
const eventQuery = require('./getEventData');
const Discord = require('discord.js')
const magneBot = new Discord.Client();
const TOKEN = process.env.TOKEN;
global.magneBot = magneBot;
magneBot.login(TOKEN).catch(e => console.error(e));

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
  try {
    switch (args[0]) {
      case '!teamInfo':
        console.log('teaminfo');
        teamQuery.teamInfo.func(msg, args[1]);
        break;
      case '!simpEventInfo':
      case '!eventInfo':
      case '!eventinfo':
      case '!event':
        console.log('eventInfo');
        eventQuery.eventInfo["event-simple"](msg, args[1], args[2]);
        break;
      case '!ranking':
      case '!rankings':
      case '!rankEventInfo':
      case '!rankInfo':
        console.log('rankInfo');
        eventQuery.eventInfo["event-rankings"](msg, args[1], args[2]);
        break;
      case '!teams':
      case '!teamEvent':
      case '!teamevent':
      case '!team':
        console.log('getting teams at event');
        eventQuery.eventInfo["event-teams"](msg, args[1], args[2]);
        break;
    }
  }
  catch (err) {
    console.log(err)
    throw err;
  }
});