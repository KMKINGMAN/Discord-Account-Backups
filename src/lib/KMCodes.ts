import axios from "axios";
export class KINGMAN_ACCOUNT_BACKUPS {
    private token: string;
    private api: string = "https://discord.com/api/v9"
    private headers: { headers: { authorization: string, "content-type": "application/json" } }
    constructor(token: string){
        this.token = token;
        this.headers = { headers: { authorization: token, "content-type": "application/json" } };
    };
    async MessagesAmoute(channelID: string){
        return new Promise<number>(async(resolve, reject) => {            
            try {
                let Req = await axios.get(`${this.api}/channels/${channelID}/messages/search?min_id=88392440217600000`, this.headers).catch(e=> { return e });
                if(Req.status == 202){
                    await this.sleep(Req.data.retry_after * 1000);
                    Req = await axios.get(`${this.api}/channels/${channelID}/messages/search?min_id=88392440217600000`, this.headers).catch(e=> { return e });
                }
                if(Req.status !== 200){
                    if(Req.status === 429){
                        await this.sleep((Req.data.retry_after * 1000) * 2);
                        Req = await axios.get(`${this.api}/channels/${channelID}/messages/search?min_id=88392440217600000`, this.headers).catch(e=> { return e });
                    }
                }
                return resolve(Req.data ? Req.data.total_results ? Req.data.total_results: -1 : -1);
            } catch (error) {
                return reject(error)
            }
        })
    };
    async MessagesFetcher(channelID: string){
        return new Promise<{
            id: string, type: number, content: string, channel_id: string, author: { id: string, username: string, avatar: string, discriminator: string , public_flags: string, avatar_decoration?: string }
            attachments: [any], embeds: [any], mentions: [any], mention_roles: [any], pinned: boolean, mention_everyone: boolean, tts: boolean, timestamp: string,  edited_timestamp?: string,
            flags: number, components: [any]
        }[]>(async(resolve, reject) => {            
            let all_messages = await this.MessagesAmoute(channelID);
            let fetched_messages = [];
            let Req = await axios.get(`${this.api}/channels/${channelID}/messages?limit=100`, this.headers).catch(e=> { return e });
            
            if(Req.status === 202){
                await this.sleep(Req.data.retry_after * 1000);
                Req = await axios.get(`${this.api}/channels/${channelID}/messages?limit=100`, this.headers).catch(e=> { return e });
            };
            if(Req.status === 429){
                await this.sleep((Req.data.retry_after * 1000) * 2);
                Req = await axios.get(`${this.api}/channels/${channelID}/messages?limit=100`, this.headers).catch(e=> { return e });
            };
            console.log(Req.status)
            fetched_messages.push(...Req.data);
            let LastMessage = Req.data.slice(-1)[0].id;
            for (let i = 0; i < Math.ceil(all_messages / 100) - 1; i++) {
                Req = await axios.get(`${this.api}/channels/${channelID}/messages?before=${LastMessage}&limit=100`, this.headers).catch(e=> { return e });
                if(Req.status === 202){
                    await this.sleep(Req.data.retry_after * 1000);
                    Req = await axios.get(`${this.api}/channels/${channelID}/messages?before=${LastMessage}&limit=100`, this.headers).catch(e=> { return e });
                };
                if(Req.status === 429){
                    await this.sleep((Req.data.retry_after * 1000) * 2);
                    Req = await axios.get(`${this.api}/channels/${channelID}/messages?before=${LastMessage}&limit=100`, this.headers).catch(e=> { return e });
                };
                console.log(Req.status)
                fetched_messages.push(...Req.data);
                LastMessage = Req.data.slice(-1)[0].id;
                await this.sleep(200);
            }
            const all_ids = fetched_messages.map((d)=> d.id);
            fetched_messages = fetched_messages.filter(({ id }, index)=> !all_ids.includes(id, index + 1))
            return resolve(fetched_messages);
        });
    };
    async getAllDMS(){
        return new Promise<{
            id: string, type: number, last_message_id: string, flags: number, recipients: [{ id: string, username: string, avatar: string, bot?: boolean }]
        }[]>(async(resolve, reject) => {
            let Req = await axios.get(`https://discordapp.com/api/users/@me/channels`, this.headers).catch(e=> { return undefined });
            if(!Req) reject({ message: "faild" });
            
            return resolve(Req?.data)
        })
    };
    async GetChannelName(channelID: string){
        let Req = await axios.get(`${this.api}/channels/${channelID}`, this.headers);
        if(Req.data.name){
            return Req.data.name
        };
        return `${Req.data.recipients[0].username}#${Req.data.recipients[0].discriminator}`;
    }
    async getRelationShip(){
        return new Promise<{id: string, type: number, nickname?: string, user: {id: string, username: string, avatar: string, avatar_decoration: string, discriminator: string, public_flags: number  }}[]>(async(resolve, reject) => {
            let Req = await axios.get(`${this.api}/users/@me/relationships`, this.headers).catch(e=> { return undefined });
            if(!Req) return reject({ message: "faild" });
            return resolve(Req?.data);
        })
    }
    async sleep(ms: number){
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
}