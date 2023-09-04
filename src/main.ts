import { Client, GatewayIntentBits } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.MessageContent, 
  GatewayIntentBits.GuildPresences, 
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildVoiceStates 
]});

const commands: { [key: string]: (message: any) => void } = {
  '안녕': (message) => message.channel.send('안녕하세요!'),
  '들어와': (message) => {
    if (message.member.voice.channel) {
      joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      });
      message.channel.send('음성 채널에 들어왔어요!');
    } else {
      message.channel.send('우선 음성 채널에 들어와야해요!');
    }
  },
  '나가': (message) => {
    if (message.member.voice.channel) {
      joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      }).destroy();
      message.channel.send('음성 채팅을 나갔어요!');
    } else {
      message.channel.send('우선 음성 채널에 들어와야해요!');
    }
  }
};

client.once('ready', () => {
    console.log('봇 준비 완료');
    // @ts-ignore
    client.user.setPresence({
        status: 'online',
        activities: [{
        name: '수업시간에 게임'
    }]
  });
});

client.on('messageCreate', message => {
  if (message.content.startsWith(';;') && commands.hasOwnProperty(message.content.substring(2))) {
    message.content = message.content.substring(2);
    const channelName = 'name' in message.channel ? message.channel.name : 'Direct Message';
    console.log(`'${message.guild}' 서버의 '${message.author.username}(유저 아이디: ${message.author.id})'님이 '${channelName}' 채널에서 '${message.content}' 명령어를 사용하셨어요!`);
    commands[message.content](message);
  }
});

client.login(token);