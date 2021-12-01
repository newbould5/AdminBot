import {CommandInteraction, GuildMember, User} from "discord.js";
import {Discord, Guard, Slash, SlashOption} from "discordx";
import {getUserInfo} from "../util/db.js";
import {Admin, Server} from "../util/guards.js";

@Discord()
@Guard(Server)
abstract class Invite {

	@Guard(Admin)
	@Slash("invitedby", { description: "show who this user was invited by" })
	private invitedBy(@SlashOption("user", { type: "USER", required: true }) user: User | GuildMember, interaction: CommandInteraction) {
		let info = getUserInfo(`${interaction.guild?.id}-${user.id}`);
		if (info?.invitedBy) {
			interaction.reply({content:`${user} was invited by <@${info.invitedBy}>`,ephemeral:true});
		} else {
			interaction.reply({content:"I don't know :slight_frown:",ephemeral:true});
		}
	}

}
