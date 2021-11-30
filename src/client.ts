import * as dotenv from 'dotenv';
import { dirname } from 'path';
import "reflect-metadata";
import { Client } from "discordx";
import { Intents, Message, Interaction } from "discord.js";
import {fileURLToPath} from 'url';

dotenv.config();

const client = new Client({
  botId: "AdminBot",
  classes: [`${dirname(fileURLToPath(import.meta.url))}/{commands,events}/**/*.{js,ts}`],
  //classes: [`${__dirname}/{commands,events}/**/*.{js,ts}`],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_INVITES,
  ],
  silent: false,
  botGuilds: process.env.TEST ? ["870310922873372752"] : undefined,
});

client.once("ready", () => {
  console.log(">> Bot started");

  // to create/update/delete discord application commands
  client.initApplicationCommands();
  client.initApplicationPermissions();
});

client.on("interactionCreate", (interaction: Interaction) => {
  client.executeInteraction(interaction);
});

const token = process.env.TEST ? process.env.TEST_TOKEN : process.env.DISCORD_TOKEN;
client.login(token || "");
