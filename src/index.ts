import { mkdirSync, writeFileSync, existsSync } from "fs";
import { KINGMAN_ACCOUNT_BACKUPS } from "./lib/kmcodes";
import { Bar, Presets, SingleBar } from "cli-progress";
import { instagram } from "gradient-string";
import inquirer from "inquirer";
import chalk from 'chalk';
import figlet from "figlet";
const askToken = async() => {
    const token = await inquirer.prompt({
        name: "account_token",
        type: "input",
        message: "Enter a vaild Account Token: ",
        default() {
            return ""
        },
    });
    return token.account_token;
}
(async()=> {
    console.log(instagram(figlet.textSync("KINGMAN", "ANSI Shadow")));
    console.log(chalk.green("KINGMAN Account's Backup | Developer Muhammad Rafat Kurakr | https://discord.gg/kmcodes\n"));
    let token = await askToken();
    if(token == ""){
        return console.log(chalk.red("Invaild token pls Restart the application"));
    }
    let backup = new KINGMAN_ACCOUNT_BACKUPS(token);
    let account_data = await backup.getAccountInfo().catch(e=> { return undefined });
    if(!account_data) return console.log(chalk.red("Invaild token"));
    let account_name_stage1 = account_data.username + "#" + account_data.discriminator
    let account_name = account_name_stage1.split("<").join("").split(">").join("").split("\\").join("").split("/").join("").split("|").join("").split(":").join("").split("*").join("").split("\"").join("").split("?").join("")
    let account_friends = await backup.getRelationShip().catch(e=> { return {}});
    let channls = await backup.getAllDMS().catch(e=> { return undefined });
    let final_data = [];
    if(!channls) return;
    channls.shift();
    let bar = new SingleBar({
        format: `${chalk.red("Createing Backup ...")} | [${chalk.blue("{bar}")}] ${chalk.green("{percentage}%")}| {value}/{total}`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
    });
    let size = 0;
    if(!existsSync("./backups/")){
        mkdirSync("./backups/",{ recursive: true });
    };
    if(!existsSync(`./backups/${account_name}`)){
        mkdirSync(`./backups/${account_name}`, { recursive: true });
    }
    writeFileSync(`./backups/${account_name}/account_data.json`, JSON.stringify(account_data, null, 4));
    writeFileSync(`./backups/${account_name}/account_friends.json`, JSON.stringify(account_friends, null, 4));
    bar.start(channls.length, 0)
    for (const channel of channls) {
        size  = size + 1;
        let messages = await backup.MessagesFetcher(channel.id).catch(e=> { return undefined });
        if(!messages) return;
        let channel_name = await backup.GetChannelName(channel.id).catch(e=> { return undefined });
        if(!channel_name) return;
        channel_name = channel_name.split("<").join("").split(">").join("").split("\\").join("").split("/").join("").split("|").join("").split(":").join("").split("*").join("").split("\"").join("").split("?").join("")
        if(!existsSync(`./backups/${account_name}/messages`)){
            mkdirSync(`./backups/${account_name}/messages`,{ recursive: true });
        };
        writeFileSync(`./backups/${account_name}/messages/${channel_name}.json`, JSON.stringify(messages, null, 4));
        await backup.sleep(200);
        bar.increment();
        bar.update(size);
        final_data.push({
            name: channel_name,
            messages: messages
        });
    }
    writeFileSync(`./backups/${account_name}/messages/index.json`, JSON.stringify(final_data, null, 4));
    bar.stop();
})();