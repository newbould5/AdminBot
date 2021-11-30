import {CommandInteraction, GuildMember, User} from "discord.js";
import {Discord, Guard, Slash, SlashOption} from "discordx";
import {getUserInfo} from "../util/db.js";
import {Admin} from "../util/guards.js";

@Discord()
abstract class Invite {

	@Guard(Admin)
	@Slash("invitedby", { description: "show who this user was invited by" })
	private invitedBy(@SlashOption("user", { type: "USER", required: true }) user: User | GuildMember, interaction: CommandInteraction) {
		let info = getUserInfo(`${interaction.guild?.id}-${user.id}`);
		if (info?.invitedBy) {
			interaction.reply(`${user} was invited by <@${info.invitedBy}>`);
		} else {
			interaction.reply("I don't know :slight_frown:");
		}
	}

}
