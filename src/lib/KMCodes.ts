import axios from "axios";
class KINGMAN_ACCOUNT_BACKUPS {
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
    async sleep(ms: number){
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
}