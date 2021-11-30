import {ApplicationCommandPermissionData, Guild} from "discord.js";
import {ApplicationGuildMixin, DefaultPermissionResolver, IDefaultPermission, SimpleCommandMessage} from "discordx";



//TODO this doesnt seem to work anymore..?
export function ModRoles(guild: Guild): ApplicationCommandPermissionData[] {
	let perms: ApplicationCommandPermissionData[] = [];
	guild.members.fetch().then(members => members.each(member => {
		if(member.permissions.has("ADMINISTRATOR")) {
			perms.push({id:member.id, permission:true, type:"USER"})
		}
		//TODO save "mod" roles and give them permission too

	}))
	return perms;
}
