import {ArgsOf, Client, Discord, On} from 'discordx';
import {addInvite, deleteInvite} from '../util/db.js';

@Discord()
abstract class OnInvite {

	@On("inviteCreate")
	onInviteCreate([invite]: ArgsOf<"inviteCreate">, client: Client){
		addInvite({ code:invite.code, guild:invite.guild?.id || "", uses: invite?.uses || 0, creator: invite.inviter?.id || ""});
	}

	@On("inviteDelete")
	onInviteDelete([invite]: ArgsOf<"inviteDelete">, client: Client) {
		deleteInvite(invite.code, invite.guild?.id || "");
	}

}
