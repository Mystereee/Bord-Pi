const Discord = require('discord.js');
const config = require('./config.json');
const colors = require("colors");

cmdexe = 'Commande exécuté : ';
const { prefix, webhookLogs, webhookPublic, Mr_Robot, TheGate, Liens, Musiques, LoupsGarous, ChannelMessagedeBienvenue, Muted } = config;
const WebhookLogs = new Discord.WebhookClient(webhookLogs.id, webhookLogs.token);
const WebhookPublic = new Discord.WebhookClient(webhookPublic.id, webhookPublic.token);



const bot = new Discord.Client({
    autoReconnect: true
});

// -- Gestion du cache --
let cache = {
    active_warning: false,
    user_cache: {}
}
let userCache = cache.user_cache

// -- Couleur par défaut --
const color = 10038562;

function updatePresence() {
    bot.user.setActivity(bot.guilds.reduce((mem, g) => mem += g.memberCount, 0) + " utilisateurs | " + prefix + "bord", {type: "WATCHING"})
}

// ---------------------- Core ----------------------
bot.on('ready', () => {
    updatePresence()
    console.info("Connecté en tant que ".bgMagenta + bot.user.tag.bgMagenta)
});

bot.on("guildMemberAdd", (member, msg) => {
    updatePresence()
    const guild = member.guild;
    console.log(`📥 ${member.user.username}#${member.user.discriminator} (${member.user.id}) a rejoint ${guild.name}`.green);
    const ChannelGeneral = member.guild.channels.find(x => x.id === ChannelMessagedeBienvenue);

      const embed = {
      "color": color,
      "fields": [
        {
          "name": "Bienvenue à " + member.user.username + " | Fiche d'aide",
          "value": "On vous souhaite la bienvenue sur **" + guild.name + "** ! Lisez les <#399600870804684803> avant tout.\n\nPour avoir de l'aide à propos de **Mr. Robøt**, veuillez [revoir la FAQ](https://mrrobot.thomasbnt.fr/?utm_source=Discord&utm_term=discord%2Cbordpi_bvn&utm_content=Bordpi_bvn#faq) si ce n'est pas encore fait, elle se trouve sur le site web. Si vous ne trouvez pas la solution, demandez de l'aide dans <#432552194630352916> en suivant le protocole dans les messages épinglés. Si vous voulez être notifié de chaque mise à jour, faites `/mrrobot`.\n\nVous avez la possibilité d'avoir des rôles d'accès, pour plus d'information, la commande `/bord` est disponible."
        }
      ]
    }
    ChannelGeneral.send({ embed })
            .then((msg) => {
            setTimeout(() => {
                if(msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")){msg.delete(msg.author).catch (e => console.error("ℹ Optionnel : Le robot n'a pas la permission de supprimer la commande faite par l'utilisateur."))}; 
        }, 60000)
        return
    });
});

bot.on("guildMemberRemove", (member) => {
    updatePresence()
    const guild = member.guild;
    console.log(`📤 ${member.user.username}#${member.user.discriminator} (${member.user.id}) a quitté ${guild.name}`.red);
});


// ---------------------- Messages ----------------------
bot.on('message', (msg) => { 

    if (msg.author.bot) return;
    if(msg.channel.recipient) return;

    // --- Commande bord | help ---
    if (msg.content === prefix + "bord") {
        if(msg.channel.recipient) return
        WebhookLogs.send("**" + prefix + "bord** - De ``" + msg.author.username + "#"+ msg.author.discriminator + "``");
        WebhookPublic.send("**" + prefix + "bord** - De ``" + msg.author.username + "#"+ msg.author.discriminator + "``");
        console.log(cmdexe + " bord ".yellow +  " de "  + msg.author.username + " #"+ msg.author.discriminator + "  (" + msg.author + ")")
        const BordEmbed = new Discord.RichEmbed();
        msg.channel.send( 
            BordEmbed
            .setColor('#E74C3C')
            .setTitle("Bord Pi | Panel d'aide")
            .setDescription("Un robot gérant et aidant les utilisateurs pour le serveur **La Hype_**.\nIl est [Open Source](https://github.com/thomasbnt/Bord-Pi), toute personne peut participer au projet et l'améliorer. Suivez simplement le protocole afin de le modifier.")
            .setThumbnail(bot.user.displayAvatarURL)
            .addField(":black_small_square: " + prefix + "mrrobot","Vous **serez notifié de chaque mise à jour** du projet <@308655472452304896>. ", false)
            .addField(":black_small_square: " + prefix + "thegate","Vous aurez accès à la **catégorie du projet The Gate** et vous serez notifié de chaque mise à jour.", false)
            .addField(":black_small_square: " + prefix + "liens","Vous aurez accès au **channel textuel liens**. Vous y trouverez de tas de liens d'articles à lire !", false)
            .addField(":black_small_square: " + prefix + "musiques","Vous aurez accès au **channel textuel des musiques**. Vous y trouverez de tas de musiques à découvrir !", false)
            .addField(":black_small_square: " + prefix + "lg","Vous serrez notifié à chaque événement et futures parties afin que vous puissez jouer avec nous le tout en __vocal__.", false)
            .addField("Formulaire de recrutement et des demandes de partenariat", "Vous voulez nous rejoindre en tant que membre de l'équipe **La Hype_** ? Ou bien devenir partenaire ? [Remplissez ce formulaire](https://www.thomasbnt.fr/form).", false)
            .addField("Les liens utiles","[Serveur Discord](https://discord.gg/9gcxwVY) • [Me soutenir](https://www.patreon.com/thomasbnt) • [Site web](https://www.thomasbnt.fr/?utm_source=link_embed_footer_bordpi?utm_medium=discordapp) • [Code Source de Bord Pi](https://github.com/thomasbnt/Bord-Pi)", false)
        )
    };

    if(msg.content === prefix + 'mrrobot') {
        if(msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")){msg.delete(msg.author).catch (e => console.error("ℹ Optionnel : Le robot n'a pas la permission de supprimer la commande faite par l'utilisateur."))}; 
        if(msg.member.roles.has(Mr_Robot)) {
            msg.member.removeRole(Mr_Robot).catch(console.error)
            msg.channel.send('Vous ne serrez plus notifié pour les mises à jour mineures de **Mr. Robøt**.')
            .then(m => { setTimeout(() => { m.delete() }, 10000) })
            WebhookLogs.send("Rôle **Mr_Robot [Accès]** supprimé pour " + msg.author)
            const embed = new Discord.RichEmbed()
            WebhookPublic.send(embed
                .setColor(10038562)
                .setDescription("Rôle **Mr_Robot [Accès]** supprimé pour "+ msg.author)
                .setThumbnail(msg.author.displayAvatarURL)
            )
        } else {
            msg.member.addRole(Mr_Robot).catch(console.error)
            msg.channel.send('Vous serrez désormais notifié pour les mises à jour mineures de **Mr. Robøt**.')
            .then(m => { setTimeout(() => { m.delete() }, 10000) })
            WebhookLogs.send("Rôle **Mr_Robot [Accès]** ajouté pour " + msg.author)
            const embed = new Discord.RichEmbed()
            WebhookPublic.send(embed
                .setColor(10038562)
                .setDescription("Rôle **Mr_Robot [Accès]** ajouté pour "+ msg.author)
                .setThumbnail(msg.author.displayAvatarURL)
            )
        }
    };

    if(msg.content === prefix + 'liens') {
        if(msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")){msg.delete(msg.author).catch (e => console.error("ℹ Optionnel : Le robot n'a pas la permission de supprimer la commande faite par l'utilisateur."))}; 
        if(msg.member.roles.has(Liens)) {
            msg.member.removeRole(Liens).catch(console.error)
            msg.channel.send("Vous n'avez plus accès au **channel des liens**.")
            .then(m => { setTimeout(() => { m.delete() }, 10000) })
            WebhookLogs.send("Rôle **Liens [Accès]** supprimé pour " + msg.author)
            const embed = new Discord.RichEmbed()
            WebhookPublic.send(embed
                .setColor(10038562)
                .setDescription("Rôle **Liens [Accès]** supprimé pour "+ msg.author)
                .setThumbnail(msg.author.displayAvatarURL)
            )
        } else {
            msg.member.addRole(Liens).catch(console.error)
            msg.channel.send('Vous avez accès aux <#399602969810829312>, proposez des articles et des nouveautés à nous faire découvrir !')
            .then(m => { setTimeout(() => { m.delete() }, 10000) })
            WebhookLogs.send("Rôle **Liens [Accès]** ajouté pour " + msg.author)
            const embed = new Discord.RichEmbed()
            WebhookPublic.send(embed
                .setColor(10038562)
                .setDescription("Rôle **Liens [Accès]** ajouté pour "+ msg.author)
                .setThumbnail(msg.author.displayAvatarURL)
            )
        }
    };

    if(msg.content === prefix + 'musiques') {
        if(msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")){msg.delete(msg.author).catch (e => console.error("ℹ Optionnel : Le robot n'a pas la permission de supprimer la commande faite par l'utilisateur."))}; 
        if(msg.member.roles.has(Musiques)) {
            msg.member.removeRole(Musiques).catch(console.error)
            msg.channel.send("Vous n'avez plus accès au **channel des musiques**.")
            .then(m => { setTimeout(() => { m.delete() }, 10000) })
            WebhookLogs.send("Rôle **Musiques [Accès]** supprimé pour " + msg.author)
            const embed = new Discord.RichEmbed()
            WebhookPublic.send(embed
                .setColor(10038562)
                .setDescription("Rôle **Musiques [Accès]** supprimé pour "+ msg.author)
                .setThumbnail(msg.author.displayAvatarURL)
            )
        } else {
            msg.member.addRole(Musiques).catch(console.error)
            msg.channel.send('Vous avez accès aux <#478578178672164874>, proposez vos musiques à nous faire écouter !')
            .then(m => { setTimeout(() => { m.delete() }, 10000) })
            WebhookLogs.send("Rôle **Musiques [Accès]** ajouté pour " + msg.author)
            const embed = new Discord.RichEmbed()
            WebhookPublic.send(embed
                .setColor(10038562)
                .setDescription("Rôle **Musiques [Accès]** ajouté pour "+ msg.author)
                .setThumbnail(msg.author.displayAvatarURL)
            )
        }
    };

    if(msg.content === prefix + 'thegate') {
        if(msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")){msg.delete(msg.author).catch (e => console.error("ℹ Optionnel : Le robot n'a pas la permission de supprimer la commande faite par l'utilisateur."))}; 
        if(msg.member.roles.has(TheGate)) {
            msg.member.removeRole(TheGate).catch(console.error)
            msg.channel.send("Vous n'avez plus accès à la **catégorie de The Gate**.")
            .then(m => { setTimeout(() => { m.delete() }, 10000) })
            WebhookLogs.send("Rôle **The Gate [Accès]** supprimé pour " + msg.author)
            const embed = new Discord.RichEmbed()
            WebhookPublic.send(embed
                .setColor(10038562)
                .setDescription("Rôle **The Gate [Accès]** supprimé pour "+ msg.author)
                .setThumbnail(msg.author.displayAvatarURL)
            )
        } else {
            msg.member.addRole(TheGate).catch(console.error)
            msg.channel.send('Vous avez accès à <#416001338929971201> ainsi que <#416001389605683200>, proposez vos suggestions pour améliorer le projet.')
            .then(m => { setTimeout(() => { m.delete() }, 10000) })
            WebhookLogs.send("Rôle **The Gate [Accès]** ajouté pour " + msg.author)
            const embed = new Discord.RichEmbed()
            WebhookPublic.send(embed
                .setColor(10038562)
                .setDescription("Rôle **The Gate [Accès]** ajouté pour "+ msg.author)
                .setThumbnail(msg.author.displayAvatarURL)
            )
        }
    };

    if(msg.content === prefix + 'lg') {
        if(msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")){msg.delete(msg.author).catch (e => console.error("ℹ Optionnel : Le robot n'a pas la permission de supprimer la commande faite par l'utilisateur."))};
        if(msg.member.roles.has(LoupsGarous)) {
            msg.member.removeRole(LoupsGarous).catch(console.error)
            msg.channel.send("Vous avez quitté le village.")
                .then(m => { setTimeout(() => { m.delete() }, 10000) })
            WebhookLogs.send("Rôle **🐺** supprimé pour " + msg.author)
            const embed = new Discord.RichEmbed()
            WebhookPublic.send(embed
                .setColor(10038562)
                .setDescription("Rôle **🐺** supprimé pour "+ msg.author)
                .setThumbnail(msg.author.displayAvatarURL)
            )
        } else {
            msg.member.addRole(LoupsGarous).catch(console.error)
            msg.channel.send('Vous êtes devenus membre ~~de la meute~~ du village, soyez vigilants !')
                .then(m => { setTimeout(() => { m.delete() }, 10000) })
            WebhookLogs.send("Rôle **🐺** ajouté pour " + msg.author)
            const embed = new Discord.RichEmbed()
            WebhookPublic.send(embed
                .setColor(10038562)
                .setDescription("Rôle **🐺** ajouté pour "+ msg.author)
                .setThumbnail(msg.author.displayAvatarURL)
            )
        }
    };

    // -- Notifier le @Support --
    if (msg.content.includes('<@&416618144027639808>')) {
        if (msg.member.hasPermission('MANAGE_MESSAGES')) return 
        const ThisIsFessage = (msg.guild.channels.find(x => x.name === "support"));
        if (ThisIsFessage) {
            const SupportEmbed = new Discord.RichEmbed();
            msg.channel.send(SupportEmbed
                .setColor('#E74C3C')
                .setDescription("Bonjour, un membre du support va vous répondre d'ici peu dans <#432552194630352916>")
                .setFooter("Merci de ne pas oublier de lire la FAQ sur le site web de Mr. Robøt.")
            )
            WebhookLogs.send("Nouveau message pour le Support en provenance de " + msg.author.tag + "(" + msg.author + ").")
            WebhookPublic.send("Nouveau message pour le Support en provenance de " + msg.author.tag + "(" + msg.author + ").")

            .catch(e => console.error(e));
        } else {
            console.log("Pour que cette fonctionnalité de notification @Support soit 100% opérationnelle, veuillez modifier le .find(x => x.name === \"Ici le nom du channel\") ")
        }
    }

    if (msg.content === prefix + 'support') {
        if (msg.channel.recipient) return
        if (msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")) { msg.delete(msg.author).catch(e => console.error("ℹ Optionnel : Le robot n'a pas la permission de supprimer la commande faite par l'utilisateur.")) }; 
        const ThisIsFole = (msg.guild.roles.find(x => x.id === "416618144027639808"));
        if (!msg.member.roles.has(ThisIsFole.id)) return 
        WebhookLogs.send("**" + prefix + "support** - De ``" + msg.author.username + "#" + msg.author.discriminator + "``");
        WebhookPublic.send("**" + prefix + "support** - De ``" + msg.author.username + "#" + msg.author.discriminator + "``");
        console.log(cmdexe + " support ".yellow + " de " + msg.author.username + " #" + msg.author.discriminator + "  (" + msg.author + ")")
        const HelpFromSupportEmbed = new Discord.RichEmbed();
        msg.channel.send(
            HelpFromSupportEmbed
                .setColor('#E74C3C')
                .setTitle("Message d'aide en provenance d'un des membres du support.")
                .setDescription("Bienvenue dans le channel support de **Mr. Robøt**. Veuillez tout d'abord, et avant de poser votre question de **[lire la Foire Aux Questions](https://mrrobot.thomasbnt.fr/#faq)**. \n\nSi vous n'avez pas la solution, envoyez directement ici en incluant :\n\n```markdown\n+ Type de soucis\n+ Précisez ce que ça produit\n```\n\nUne description détaillée est requise sinon votre demande pourrait ne pas être prise en compte. Les membres du <@&416618144027639808> vous donnerons une réponse dans les plus brefs délais.")
                .setThumbnail(msg.author.displayAvatarURL)
                .addField(":black_small_square: " + prefix + "bord", "Affichez les fonctionnalités que ce robot même offre sur ce serveur.", false)
                .addField(":black_small_square:  _website", "Obtenez rapidement le lien du site web de **Mr. Robøt**", false)
                .addField("Les liens utiles", "[Serveur Discord](https://discord.gg/9gcxwVY) • [Me soutenir](https://www.patreon.com/thomasbnt) • [Site web](https://www.thomasbnt.fr/?utm_source=link_embed_footer_bordpi?utm_medium=discordapp) • [Code Source de Bord Pi](https://github.com/thomasbnt/Bord-Pi)", false)
        )
    }

    if (msg.content === prefix + 'form') {
        if (msg.channel.recipient) return
        if (msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")) { msg.delete(msg.author).catch(e => console.error("ℹ Optionnel : Le robot n'a pas la permission de supprimer la commande faite par l'utilisateur.")) }; 
        WebhookLogs.send("**" + prefix + "form** - De ``" + msg.author.username + "#" + msg.author.discriminator + "``");
        WebhookPublic.send("**" + prefix + "form** - De ``" + msg.author.username + "#" + msg.author.discriminator + "``");
        console.log(cmdexe + " support ".yellow + " de " + msg.author.username + " #" + msg.author.discriminator + "  (" + msg.author + ")")
        const FormEmbed = new Discord.RichEmbed();
        msg.channel.send(
            FormEmbed
                .setColor('#E74C3C')
                .setDescription("Vous voulez nous rejoindre en tant que membre de l'équipe **La Hype_** ? Ou tout simplement devenir Partenaire ? Remplissez [ce formulaire](https://www.thomasbnt.fr/form) et on vous répondra dès que possible !")
        )
    }

    // -- Mise en cache des membres --
    if (!(msg.author.id in userCache)) {
        userCache[msg.author.id] = {
            username: msg.author.username,
            identifier: msg.author.toString(),
            last_msg_timestamp: 0
        }
    };

    // --- Filtre contre les liens Discord ---
    if(msg.content.includes('discord.gg') || msg.content.includes('discordapp.com/invite') || msg.content.includes('discord.me')) {
        if(msg.member.hasPermission('MANAGE_MESSAGES')) return    
        if(msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")){msg.delete(msg.author).catch (e => console.error("ℹ Optionnel : Le robot n'a pas la permission de supprimer la commande faite par l'utilisateur."))}; 
        console.log(msg.author.tag + " (" + msg.author + ") a fait une publicité Discord.")
        WebhookLogs.send(":x:" + msg.author.tag + "(" + msg.author + ") a fait une publicité Discord.\nMessage : " + msg.content)
        WebhookPublic.send(":x:" + msg.author.tag + "(" + msg.author + ") a fait une publicité Discord.\nMessage : " + msg.content)
        msg.reply(' merci de revoir les <#399600870804684803> . Les liens discord sont interdits.')
            .then(m => { setTimeout(() => { m.delete() }, 10000) })
    };
    // ---- Anti spam ----
    if (msg.createdTimestamp - userCache[msg.author.id].last_msg_timestamp <= 190) {
        if (msg.member.hasPermission('MANAGE_MESSAGES')) return
        if (!cache.active_warning) {
            console.log("✖ Rôle Muté".red +  " de "  + msg.author.username + " #"+ msg.author.discriminator + " (" + msg.author + ")")
            WebhookLogs.send(":x:" + msg.author.tag + " (" + msg.author + ") a été muté suite à un spam.")
            WebhookPublic.send(":x:" + msg.author.tag + " (" + msg.author + ") a été muté suite à un spam.")
            msg.reply("le spam, c'est mal !")
            const RoleMuted = msg.guild.roles.find(x => x.id === Muted)
            cache.active_warning = msg.member.addRole(RoleMuted)
            .catch(e  => console.error('Erreur des permissions pour donner le rôle Muté.') + console.error(e))
            .then((msg) => {
                setTimeout(() => {
                    cache.active_warning = false
                }, 2000)
            });
        }
        return
    };

    // --- Commande uptime (réservé à ceux qui ont la permission de gérer les messages) ---
    if (msg.content === prefix + 'uptime'){
        if(msg.channel.recipient) return
        if(!msg.member.hasPermission('MANAGE_MESSAGES')) return
        const UptimeEmbed = new Discord.RichEmbed();
        msg.channel.send( 
            UptimeEmbed
            .setColor('#E74C3C')
            .setAuthor("🔌 Uptime","https://www.thomasbnt.fr")
            .setDescription((Math.round(bot.uptime / (1000 * 60 * 60))) + ' heure|s  ' + (Math.round(bot.uptime / (1000 * 60)) % 60) + ' minute|s ' + (Math.round(bot.uptime / 1000) % 60) + " seconde|s")

        );           
        console.log(cmdexe + " uptime ".magenta +  " de " + msg.author.username + " #"+ msg.author.discriminator + " (" + msg.author + ")")
        WebhookLogs.send("**"+ prefix + "uptime** - De ``" + msg.author.username + "#"+ msg.author.discriminator + "``")
        WebhookPublic.send("**"+ prefix + "uptime** - De ``" + msg.author.username + "#"+ msg.author.discriminator + "``")
    };

    // --- Commande ping (réservé à ceux qui ont la permission de gérer les messages) ---
    if (msg.content === prefix + 'ping') {
        if(msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")){msg.delete(msg.author).catch (e => console.error("ℹ Optionnel : Le robot n'a pas la permission de supprimer la commande faite par l'utilisateur."))}; 
        if (!msg.member.hasPermission('MANAGE_MESSAGES')) return
        const embed = new Discord.RichEmbed()
        .setColor(10038562)
        .setAuthor(`Un ping de ${Math.floor(bot.ping)} ms !`)
        .setFooter(`Demandé par ${msg.author.username}` ,msg.author.avatarURL)
        msg.channel.send({embed})
        console.log(cmdexe + " ping ".magenta +  " de " + msg.author.username + " #"+ msg.author.discriminator + " (" + msg.author + ")")
        WebhookLogs.send("**"+ prefix + "ping** - De ``" + msg.author.username + "#"+ msg.author.discriminator + "``")
        const PingEmbed = new Discord.RichEmbed()
        WebhookPublic.send(PingEmbed
            .setColor(10038562)
            .setDescription("**"+ prefix + "ping** - De ``" + msg.author)
            .setThumbnail(msg.author.displayAvatarURL)
        )
    };

    if (msg.content.startsWith(prefix + "avatar")) {
        const embed = {
            "color": color,
            "thumbnail": {
                "url": msg.author.displayAvatarURL
            },
            "description":"Voici ton image de profil. Pour la voir, clique simplement dessus."
        }
        msg.channel.send({embed});
    };
    
    userCache[msg.author.id].last_msg_timestamp = msg.createdTimestamp

});

bot.login(config.token)
    .catch(e => console.error(e.message));
