import { Discord, On, Client, ArgsOf } from "discordx";
import {awardXp} from "../util/awardxp.js";
import {getGuildConfig} from "../util/db.js";

@Discord()
abstract class OnMessage {

	@On("messageCreate")
	onMessage([message]: ArgsOf<"messageCreate">, client: Client){
		let config = getGuildConfig(message.guildId || "");
		if(!message.author.bot && !message.system && !config?.ignoredChannels.includes(message.channelId)) {
			if(message.member) awardXp(message.member, 1);
		}
	}

}
