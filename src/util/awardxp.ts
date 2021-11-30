import {GuildMember} from "discord.js";
import {UserInfo} from "../model/userinfo.js";
import {createUserInfo, getGuildConfig, getUserInfo, write} from "./db.js";

export function awardXp(member: GuildMember, amount: number): UserInfo {
	const id = `${member.guild.id}-${member.id}`;
	var userInfo = getUserInfo(id);
	if (userInfo) {
		userInfo.xp += amount;
		write();
	} else {
		userInfo = createUserInfo({id:id, xp:amount});
	}
	const rewards = getGuildConfig(member.guild.id)?.rewards || [];
	let roles = member.roles.cache.map(r => r.id);
	rewards.forEach(reward => {
		if(userInfo?.xp || 0 >= reward.threshold && !roles.includes(reward.role)) {
			member.roles.add(reward.role);
			//TODO send message
		}
	});
	return userInfo;
}
