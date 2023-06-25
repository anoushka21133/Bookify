const Discord = require('discord.js');
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent
  ]
})


client.on("ready", () => {
  console.log("I'm in");
  console.log(client.user.username);
});

// client.on("messageCreate", (msg) => {
//   if (msg.author.id != client.user.id) {
//     msg.channel.send(msg.content.split("").reverse().join(""));
//   }
// });

client.on('messageCreate', (message) => {
  console.log(`[${message.author.tag}]: ${message.content}`);

  if (message.content === 'hello' || message.content === 'hi' || message.content === 'Hello' || message.content === 'Hi') {
    if (message.author.bot === false) {
      message.reply('Hi' + ` ${message.author.username}`)
    }
  }
});


client.login(process.env.TOKEN)
const PREFIX = "$";

let b = 0;
let url1;
//Searching for books
client.on('messageCreate', (message) => {
  if (b === 1) return;

  if (message.content.startsWith(PREFIX)) {//$
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(1)
      .split(/\s+/);

    if (CMD_NAME === 'bookInfo') {
      message.reply('Gotcha');
      message.reply('This is what I found, select one');

      let urlFirst = 'https://www.googleapis.com/books/v1/volumes?q=';
      // const api_key = 
      let urlLast = '+intitle:' + args + "&key=" + process.env.gb_api;
      let urlMiddle = '';
      console.log(args);
      for (let i = 0; i < args.length; ++i) {
        urlMiddle = urlMiddle + args[i];
        // if(i !== args.length - 1){
        // urlMiddle = urlMiddle + '+';
        // }
      }
      let url = urlFirst + urlMiddle + urlLast;
      console.log(url)
      url1 = url;
      // http.get(url, (ele)=>{
      //     console.log(JSON.stringify(ele));
      // })

      // console.log(url);
      // const data = require(url, (data)=>{
      //     console.log(data);
      // });


      let jsonF;
      fetch(url)
        .then(res => res.json())
        .then(json => {
          console.log(json.items.length);
          for (let i = 0; i < json.items.length; ++i) {
            message.reply((i + 1) + '.  ' + json.items[i].volumeInfo.title + '\n\tAuthor: ' + json.items[i].volumeInfo.authors[0]);
          }

          message.reply('Choose one, enter -1 to stop');
          b = 1;
        })

    }
  }
})


client.on('messageCreate', (message) => {
  if (message.author.bot === true) return;
  if (b === 0) return;
  b = 0;
  let a = parseInt(message.content);
  if (a == -1) return message.reply('Search Stopped');
  fetch(url1)
    .then(res => res.json())
    .then(json => {
      message.reply(`[Title]: ` + json.items[a - 1].volumeInfo.title);
      message.reply(`[Author]: ` + json.items[a - 1].volumeInfo.authors[0]);
      message.reply(`[Description]: ` + json.items[a - 1].volumeInfo.description);
      message.reply(`[Average Rating]: ` + json.items[a - 1].volumeInfo.averageRating);
    })
})