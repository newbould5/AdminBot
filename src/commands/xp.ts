import { ApplicationCommandPermissionData, CommandInteraction, Guild, GuildMember, Role, User } from "discord.js";
import { Discord, Guard, Permission, Slash, SlashOption } from "discordx";
import {awardXp} from "../util/awardxp.js";
import {getUserInfo, write} from "../util/db.js";
import { Admin } from "../util/guards.js";
import {ModRoles} from "../util/permissions.js";

@Discord()
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
				interaction.reply("You can only grant xp to users not roles");
				return;
			}
		}

}
