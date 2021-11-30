import { UserInfo } from '../model/userinfo';
import { Low, JSONFile } from 'lowdb';
import {InviteInfo} from '../model/inviteinfo';
import {GuildConfig, RoleReward} from '../model/guildconfig';

const file = process.cwd() + "/db.json";
const adapter = new JSONFile<Data>(file);
const db = new Low<Data>(adapter);
await db.read();

if(!db.data || Object.keys(db.data).length === 0) {
	db.data = {info:[], invites:[],guildConfig:[]};
	write();
}

type Data = {
	info: UserInfo[],
	invites: InviteInfo[],
	guildConfig: GuildConfig[]
}

//userinfo
export function getUserInfo(id: string): UserInfo | undefined {
	return db.data?.info.find(u => u.id === id);
}

export function createUserInfo(info: UserInfo): UserInfo {
	let stored = db.data?.info.find(u => u.id === info.id);
	if(stored) {
		//exists -> rejoin -> only update inviter
		if (info.invitedBy) stored.invitedBy = info.invitedBy;
	} else {
		db.data?.info.push(info);
	}
	write();
	return info;
}

//invite
export function getInvites(guild: string): InviteInfo[] {
	return db.data?.invites.filter(inv => inv.guild === guild) || [];
}

export function addInvite(invite: InviteInfo) {
	db.data?.invites.push(invite);
	write();
}

export function deleteInvite(code: string, guild: string) {
	if(!db.data) return;
	db.data.invites = db.data.invites.filter(inv => inv.guild !== guild && inv.code !== code);
	write();
}

//guildConfig
export function getGuildConfig(guild: string): GuildConfig | undefined {
	return db.data?.guildConfig.find(cfg => cfg.guild === guild);
}

export function addModRole(guild: string, role: string) {
	let config = getGuildConfig(guild);
	if(config) {
		if(!config.modRoles.includes(role)){
			config.modRoles.push(role);
			write();
		}
	} else {
		db.data?.guildConfig.push({guild:guild, modRoles:[role], rewards:[], ignoredChannels:[]});
		write();
	}
}

export function deleteModRole(guild: string, role: string) {
	let config = getGuildConfig(guild);
	if(config) {
		config.modRoles = config.modRoles.filter(r => r !== role);
		write();
	}
}

export function addReward(guild: string, reward: RoleReward) {
	let config = getGuildConfig(guild);
	if(config) {
		if(config.rewards.findIndex(r => r.role === reward.role && r.threshold === reward.threshold) > -1) {
			config.rewards.push(reward);
			write();
		}
	} else {
		db.data?.guildConfig.push({guild:guild, rewards:[reward], modRoles:[], ignoredChannels:[]});
		write();
	}
}

export function deleteReward(guild: string, reward: RoleReward) {
	let config = getGuildConfig(guild);
	if(config) {
		config.rewards = config.rewards.filter(rew => rew.role !== reward.role || rew.threshold !== reward.threshold);
		write();
	}
}

export function addIgnoredChannel(guild: string, channel: string) {
	let config = getGuildConfig(guild);
	if(config) {
		if(!config.ignoredChannels.includes(channel)){
			config.ignoredChannels.push(channel);
			write();
		}
	} else {
		db.data?.guildConfig.push({guild:guild, modRoles:[], rewards:[], ignoredChannels:[channel]});
		write();
	}
}

export function deleteIgnoredChannel(guild: string, channel: string) {
	let config = getGuildConfig(guild);
	if(config) {
		config.ignoredChannels = config.ignoredChannels.filter(r => r !== channel);
		write();
	}
}

export function write() {
	db.write();
}
