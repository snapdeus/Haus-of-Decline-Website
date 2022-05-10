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
        const plegdeAmt = response.data.attributes.campaign_pledge_amount_cents / 100;
        const embedMsg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`New Patreon Subscriber!`)
            .addField("Patreon User", name)
            .addField('Pledged:', `$${ plegdeAmt }`);
        client.channels.cache.get(process.env.TESTGENERAL_CHANNEL).send({ embeds: [embedMsg] })

    });

    postEventEmitter.on('newPost', function (requestBody) {
        const response = requestBody;
        // console.log(response)

        const unformattedContent = response.data.attributes.content;
        // const content = unformattedContent.replace(/\<p\>|\<\/p\>/g, '')
        const content = unformattedContent.replace(/<[^>]*>?/gm, '')
        const title = response.data.attributes.title;
        const url = response.data.attributes.url

        if (title.includes('Daily')) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Patreon Comic: ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
            client.channels.cache.get(process.env.GENERAL_CHANNEL).send({ embeds: [embedMsg] })
        } else if (title.includes('BE')) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Bonus Episode! ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
            client.channels.cache.get(process.env.GENERAL_CHANNEL).send({ embeds: [embedMsg] })
        } else if (title.includes('Behind')) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Behind the Scenes post!: ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
            client.channels.cache.get(process.env.GENERAL_CHANNEL).send({ embeds: [embedMsg] })
        } else if (title.includes('Commission')) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Commissioned Comic!: ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
            client.channels.cache.get(process.env.COMMISSION_CHANNEL).send({ embeds: [embedMsg] })
        } else {

            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Post on Patreon: ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
            client.channels.cache.get(process.env.GENERAL_CHANNEL).send({ embeds: [embedMsg] })
        }
    })
})


client.login(process.env.BOT_TOKEN)