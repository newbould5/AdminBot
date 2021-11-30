import {ArgsOf, Client, Discord, On} from 'discordx';
import {InviteInfo} from '../model/inviteinfo.js';
import {createUserInfo, getInvites, getUserInfo } from '../util/db.js';

@Discord()
abstract class OnMemberJoin {

	@On("guildMemberAdd")
	async onMemberJoin([member]: ArgsOf<"guildMemberAdd">, client: Client) {
		let storedInvites = getInvites(member.guild.id);
		let currentInvites = await member.guild.invites.fetch();

		currentInvites.forEach(inv => {
			let stored = storedInvites.find(i => inv.code === i.code); //find corresponding invite
			if(!stored) {
				console.error("could not find a stored reference for invite", inv);
			} else if (inv?.uses || -1 > stored.uses) { //this is the one that changed
				stored.uses = inv.uses || -1;
				createUserInfo({id: `${member.guild.id}-${member.id}`, xp: 0, invitedBy: stored.creator });
			}
		});
	}
}
