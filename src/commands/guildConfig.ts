import {Channel, CommandInteraction, Role} from "discord.js";
import {Discord, Guard, Slash, SlashOption} from "discordx";
import {addIgnoredChannel, addModRole, addReward, deleteIgnoredChannel, deleteModRole, deleteReward, getGuildConfig} from "../util/db.js";
import {Admin, Server} from "../util/guards.js";

@Discord()
@Guard(Server)
@Guard(Admin)
abstract class GuildConfigCommand {

	@Slash("addmod", {description:"Add roles that can execute commands reserved for admins."})
	private addMod(@SlashOption("role", {type:"ROLE",required:true}) role: Role, interaction: CommandInteraction) {
		addModRole(interaction.guildId, role.id);
		interaction.reply({content:`Added role ${role} as admin.`, ephemeral:true});
	}

	@Slash("showmods", {description:"Show mod roles of this server."})
	private showMods(interaction: CommandInteraction) {
		let config = getGuildConfig(interaction.guildId);
		let roles = config?.modRoles.map(role => `<@&${role}>`).join(", ");
		if(config?.modRoles.length || 0 > 0) {
			interaction.reply({content:`The current mod roles are: ${roles}`, ephemeral:true});
		} else {
			interaction.reply("There are currently no mod roles configured");
		}
	}

	@Slash("deletemod", {description:"Delete mod role."})
	private deleteMod(@SlashOption("role", {type:"ROLE",required:true}) role: Role, interaction: CommandInteraction) {
		deleteModRole(interaction.guildId, role.id);
		interaction.reply({content:`Removed ${role} from mod roles`, ephemeral:true});
	}
	
	@Slash("addreward", {description:"Add role reward."})
	private addReward(
		@SlashOption("role", {type:"ROLE",required:true}) role: Role,
		@SlashOption("xp", {required:true, type:"NUMBER"}) amount: number,
		interaction: CommandInteraction) {
		addReward(interaction.guildId, {role:role.id, threshold: amount})
		interaction.reply({content:`Added ${role} as reward for reaching ${amount.toLocaleString()}xp.`, ephemeral:true});
	}

	@Slash("deletereward", {description:"Remove role reward"})
	private deleteReward(
		@SlashOption("role", {type:"ROLE",required:true}) role: Role,
		@SlashOption("xp", {required:true, type:"NUMBER"}) amount: number,
		interaction: CommandInteraction) {
		deleteReward(interaction.guildId, {role:role.id, threshold: amount});
		interaction.reply({content:`Removed ${role} as reward for reaching ${amount.toLocaleString()}xp.`, ephemeral:true});
	}


	@Slash("showrewards", {description:"Show role rewards."})
	private showRewards(interaction: CommandInteraction) {
		let config = getGuildConfig(interaction.guildId);
		let rewards = config?.rewards.map(reward => `${reward.threshold}:<@&${reward.role}>`).join('\n');
		if(config?.rewards.length || 0 > 0) {
			interaction.reply(rewards || "");
		} else {
			interaction.reply("There are no rewards configured");
		}
	}

	@Slash("addignore", {description:"Add a channel that will be ignored for rewarding xp."})
	private addChannelIgnore(@SlashOption("channel", {type:"CHANNEL",required:true}) channel: Channel, interaction: CommandInteraction) {
		addIgnoredChannel(interaction.guildId, channel.id);
		interaction.reply({content:`Added ${channel} to the ignored channels.`, ephemeral:true});
	}

	@Slash("deleteignore", {description:"Delete an ignored channel."})
	private deleteChannelIgnore(@SlashOption("channel", {type:"CHANNEL",required:true}) channel: Channel, interaction: CommandInteraction) {
		deleteIgnoredChannel(interaction.guildId, channel.id);
		interaction.reply({content:`Removed ${channel} from the ignored channels.`, ephemeral:true});
	}

	@Slash("showignore", {description:"Show ignored channels."})
	private showIgnore(interaction: CommandInteraction) {
		let config = getGuildConfig(interaction.guildId);
		if(config?.ignoredChannels.length || 0 > 0) {
			interaction.reply({content:`Following channels are currently ignored: ${config?.ignoredChannels.map(c => "<#"+c+">").join(", ")}`, ephemeral:true});
		} else {
			interaction.reply("No channels are ignored");
		}
	}
}
