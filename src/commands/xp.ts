import { CommandInteraction, GuildMember, MessageEmbed, User } from "discord.js";
import { Discord, Guard, Slash, SlashOption } from "discordx";
import {awardXp} from "../util/awardxp.js";
import {getUserInfo, getUserInfoByGuild} from "../util/db.js";
import { Admin, Server } from "../util/guards.js";

@Discord()
@Guard(Server)
abstract class Xp {

	@Slash("show-xp", { description: "show your current xp or that of the optionally mentioned user." })
	private showXp(@SlashOption("user", { type: "USER" }) user: User | GuildMember, interaction: CommandInteraction) {
		user ||= interaction.user;
		let info = getUserInfo(`${interaction.guild?.id}-${user.id}`);
		interaction.reply(`User ${user} has ${info?.xp.toLocaleString() || 0}xp.`);
	}

	@Guard(Admin)
	@Slash("grant-xp", { description: "Grant a user xp." })
	private grantXp(
		@SlashOption("amount", { required:true }) amount: number,
		@SlashOption("user", { type: "USER" }) user: any, //not really any
		interaction: CommandInteraction) {
			user ||= interaction.member;
			if (user instanceof GuildMember) {
				let id = `${interaction.guild?.id}-${user.id}`;
				let info = awardXp(user, amount)
				interaction.reply(`You have granted ${user} ${amount.toLocaleString()}xp, total: ${info.xp.toLocaleString()}xp`);
			} else {
				interaction.reply({content:"You can only grant xp to users not roles", ephemeral:true});
				return;
			}
		}

	@Slash("leaderboard", { description: "Show xp leaderboard."})
	private leaderboard(interaction: CommandInteraction) {
		const info = getUserInfoByGuild(interaction.guildId).sort((a,b) => b.xp - a.xp).slice(0,10);
		let msg = "";

		for (let i = 0; i < info.length; i++) {
			const element = info[i];
			msg += `${i+1}. <@${element.id.split('-')[1]}>: ${element.xp.toLocaleString()}\n`;
		}
		interaction.reply(msg);
	}

}
