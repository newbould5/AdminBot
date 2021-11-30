export interface GuildConfig {
	guild: string,
	modRoles: string[],
	rewards: RoleReward[],
	ignoredChannels: string[]
}

export interface RoleReward {
	threshold: number,
	role: string
}
