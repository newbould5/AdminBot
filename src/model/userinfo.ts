export interface UserInfo {
	id: string; //guild.id + '-' + user.id
	invitedBy?: string; //user.id
	xp: number;
}
