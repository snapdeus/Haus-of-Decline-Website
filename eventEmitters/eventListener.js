require('dotenv').config();
const Discord = require('discord.js')
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const { eventEmitter, postEventEmitter } = require('./eventEmitter');



client.on('ready', () => {

    eventEmitter.on('privcom', function (requestBody) {
        // console.log(requestBody)
        const response = requestBody
        let url = response.tags[0].replace(/'/g, "").replace(/"/g, '')
        if (!url.includes('http')) {
            url = 'https://' + url
        } else if (!url.includes('.com')) {
            url = url + '.com'
        }
        let description = '|| ' + response.tags[2].slice(0, -1) + ' ||'

        const embedMsg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(response.tags[1])
            .setImage(`${ response.url }`)
            .setURL(`${ url }`)
            .setDescription(description)

        client.channels.cache.get(process.env.PATREON_COMICS_CHANNEL).send({ embeds: [embedMsg] })

    });



    eventEmitter.on('pubsub', function (requestBody) {
        const file = new Discord.MessageAttachment('/home/snapdeus/webApp/gifs/resources/imin.png');
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
            .addField('Pledged:', `$${ plegdeAmt }`)
            .setThumbnail('attachment://imin.png')
        client.channels.cache.get(process.env.GENERAL_CHANNEL).send({ embeds: [embedMsg], files: [file] })

    });

    postEventEmitter.on('newPost', function (requestBody) {
        const response = requestBody;
        // console.log(response)

        const unformattedContent = response.data.attributes.content;
        // const content = unformattedContent.replace(/\<p\>|\<\/p\>/g, '')
        const content = unformattedContent.replace(/<[^>]*>?/gm, '')
        const title = response.data.attributes.title;
        const url = response.data.attributes.url
        const file = new Discord.MessageAttachment('/home/snapdeus/webApp/gifs/resources/daily.png');
        const file2 = new Discord.MessageAttachment('/home/snapdeus/webApp/gifs/resources/episode.jpg');
        const file3 = new Discord.MessageAttachment('/home/snapdeus/webApp/gifs/resources/gravy.png');
        const file4 = new Discord.MessageAttachment('/home/snapdeus/webApp/gifs/resources/commission.png');
        const file5 = new Discord.MessageAttachment('/home/snapdeus/webApp/gifs/resources/balls.png');

        if (title.includes('Daily')) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Comic on Patreon!: ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
                .setThumbnail('attachment://daily.png')
            client.channels.cache.get(process.env.GENERAL_CHANNEL).send({ embeds: [embedMsg], files: [file] })
        } else if (title.includes('BE')) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Bonus Episode! ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
                .setThumbnail('attachment://episode.jpg')
            client.channels.cache.get(process.env.GENERAL_CHANNEL).send({ embeds: [embedMsg], files: [file2] })
        } else if (title.includes('Behind')) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Behind the Scenes post!: ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
                .setThumbnail('attachment://balls.png')
            client.channels.cache.get(process.env.GENERAL_CHANNEL).send({ embeds: [embedMsg], files: [file5] })
        } else if (title.includes('Commission')) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Commissioned Comic!: ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
                .setThumbnail('attachment://commission.png')
            client.channels.cache.get(process.env.COMMISSION_CHANNEL).send({ embeds: [embedMsg], files: [file4] })
        } else {
            const embedMsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`New Post on Patreon: ${ title }`)
                .setDescription(`${ content }`)
                .setURL(`https://www.patreon.com${ url }`)
                .setThumbnail('attachment://gravy.png')
            client.channels.cache.get(process.env.GENERAL_CHANNEL).send({ embeds: [embedMsg], files: [file3] })
        }
    })
})


client.login(process.env.BOT_TOKEN)