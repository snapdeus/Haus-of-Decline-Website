require('dotenv').config();
const Discord = require('discord.js')
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const { eventEmitter, postEventEmitter } = require('./eventEmitter');



client.on('ready', () => {



    eventEmitter.on('pubsub', function (requestBody) {
        const response = requestBody;
        console.log(response.data)
        const name = response.data.attributes.full_name;
        const nameArray = name.split(' ')
        const firstName = nameArray[0]
        const plegdeAmt = response.data.attributes.will_pay_amount_cents / 100;
        const embedMsg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`New Patreon Subscriber!`)
            .addField("Patreon User", firstName)
            .addField('Pledged:', `$${ plegdeAmt }`);
        client.channels.cache.get(process.env.GENERAL_CHANNEL).send({ embeds: [embedMsg] })

    });

    postEventEmitter.on('newPost', function (requestBody) {
        const response = requestBody;
        // console.log(response)

        const unformattedContent = response.data.attributes.content;
        // const content = unformattedContent.replace(/\<p\>|\<\/p\>/g, '')
        const content = unformattedContent.replace(/<[^>]*>?/gm, '')
        const title = response.data.attributes.title;
        const url = response.data.attributes.url
        const file = new Discord.MessageAttachment('/home/snapdeus/webApp/gifs/resources/oink.png');

        if (title.includes('Daily')) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Comic on Patreon!: ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
                .setThumbnail('attachment://oink.png')
            client.channels.cache.get(process.env.TESTGENERAL_CHANNEL).send({ embeds: [embedMsg], files: [file] })
        } else if (title.includes('BE')) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Bonus Episode! ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
                .setThumbnail('attachment://oink.png')
            client.channels.cache.get(process.env.TESTGENERAL_CHANNEL).send({ embeds: [embedMsg], files: [file] })
        } else if (title.includes('Behind')) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Behind the Scenes post!: ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
                .setThumbnail('attachment://oink.png')
            client.channels.cache.get(process.env.TESTGENERAL_CHANNEL).send({ embeds: [embedMsg], files: [file] })
        } else if (title.includes('Commission')) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Commissioned Comic!: ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
                .setThumbnail('attachment://oink.png')
            client.channels.cache.get(process.env.TESTCOMMISSION_CHANNEL).send({ embeds: [embedMsg], files: [file] })
        } else {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Post on Patreon: ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
                .setThumbnail('attachment://oink.png')
            client.channels.cache.get(process.env.TESTGENERAL_CHANNEL).send({ embeds: [embedMsg], files: [file] })
        }
    })
})


client.login(process.env.BOT_TOKEN)