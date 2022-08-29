import { mkdirSync, writeFileSync, existsSync } from "fs";
import { KINGMAN_ACCOUNT_BACKUPS } from "./lib/KMCodes";
let token = "";
(async()=> {
    let backup = new KINGMAN_ACCOUNT_BACKUPS(token);
    let channls = await backup.getAllDMS().catch(e=> { return undefined });
    if(!channls) return;
    channls.shift();
    for (const channel of channls) {
        let messages = await backup.MessagesFetcher(channel.id).catch(e=> { return undefined });
        if(!messages) return;
        let channel_name = await backup.GetChannelName(channel.id).catch(e=> { return undefined });
        if(!channel_name) return;
        channel_name = channel_name.split("<").join("").split(">").join("").split("\\").join("").split("/").join("").split("|").join("").split(":").join("").split("*").join("").split("\"").join("").split("?").join("")
        if(!existsSync("./backups/") || !existsSync("./backups/messages")){
            mkdirSync("./backups/",{ recursive: true });
            mkdirSync("./backups/messages",{ recursive: true });
        };
        mkdirSync(`./backups/messages/${channel_name}`,{ recursive: true });
        writeFileSync(`./backups/messages/${channel_name}.json`, JSON.stringify(messages, null, 4));
        await backup.sleep(200);
    }
})();