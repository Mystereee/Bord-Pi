const Discord = require('discord.js')

exports.run = (bot, WebhookPrivate, WebhookPublic, msg) => {

    if (msg.channel.recipient) return

    if (msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")) {
        msg.delete(msg.author).catch(e => console.log(bot.ls.info, "Optionnel : Le robot n'a pas la permission de supprimer la commande faite par l'utilisateur."))
    }

    msg.channel.send(new Discord.RichEmbed()
        .setColor(bot.config.PrimaryColor)
        .setDescription("Vous voulez nous rejoindre en tant que membre de l'équipe **La Hype_** ? Ou tout simplement devenir Partenaire ? Remplissez [ce formulaire](https://www.thomasbnt.fr/form) et on vous répondra dès que possible !")
    )

    console.log(bot.ls.info, bot.config.prefix + "form " + " de " + msg.author.tag + " (" + msg.author.id + ")")

    WebhookPrivate.send(new Discord.RichEmbed()
        .setColor(bot.config.PrimaryColor)
        .setDescription("** " + bot.config.prefix + "form ** - De " + msg.author)
        .setFooter("ID : " + msg.author.id, msg.author.avatarURL)
    )
}
