export interface InviteInfo {
	//id: string, // guild.id + '-' + invite.code
	code: string, //invite.code
	guild: string, //invite.guild.id
	creator: string, //invite.inviter.id
	uses: number //invite.uses
}
