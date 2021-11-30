import { CommandInteraction, GuildMemberManager, GuildMemberRoleManager } from "discord.js";
import {GuardFunction} from "discordx";
import {getGuildConfig} from "./db.js";

export const Admin: GuardFunction<CommandInteraction> = async (interaction, client, next) => {
	if (interaction.memberPermissions?.has("ADMINISTRATOR") || roleAllowed(interaction.guildId, interaction.member.roles)) {
		await next();
	} else {
		interaction.reply("You are not allowed to do this.");
	}
}

export const Server: GuardFunction<CommandInteraction> = async (interaction, client, next) => {
	if (!interaction.guild) {
		interaction.reply("This bot only functions in guilds.");
	} else {
		await next();
	}
}

function roleAllowed(guild: string, manager: GuildMemberRoleManager | string[]): boolean {
	if (manager instanceof GuildMemberRoleManager) {
		let roles = manager.cache.map(role => role.id).join(',');
		let configRoles = getGuildConfig(guild)?.modRoles || [];
		return configRoles.some(role => roles.includes(role));
	}
	return false;
}
