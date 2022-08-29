import { mkdirSync, writeFileSync, existsSync } from "fs";
import { KINGMAN_ACCOUNT_BACKUPS } from "./lib/KMCodes";
import { Bar, Presets, SingleBar } from "cli-progress"
let token = "";
(async()=> {
    let backup = new KINGMAN_ACCOUNT_BACKUPS(token);
    let account_data = await backup.getAccountInfo().catch(e=> { return undefined });
    if(!account_data) return console.log("Invaild token");
    let account_name_stage1 = account_data.username + "#" + account_data.discriminator
    let account_name = account_name_stage1.split("<").join("").split(">").join("").split("\\").join("").split("/").join("").split("|").join("").split(":").join("").split("*").join("").split("\"").join("").split("?").join("")
    let account_friends = await backup.getRelationShip().catch(e=> { return {}});
    let channls = await backup.getAllDMS().catch(e=> { return undefined });
    if(!channls) return;
    channls.shift();
    let bar = new SingleBar({
        align: "center",
        format: "Backup Messages | [{bar}] {percentage}% | {value}/{total}",
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
    });
    let size = 0;
    if(!existsSync("./backups/")){
        mkdirSync("./backups/",{ recursive: true });
    };
    mkdirSync(`./backups/${account_name}`);
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
    }
    bar.stop()
})();