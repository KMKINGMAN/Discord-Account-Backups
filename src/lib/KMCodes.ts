import axios from "axios";
class KINGMAN_ACCOUNT_BACKUPS {
    private token: string;
    private api: string = "https://discord.com/api/v9"
    private headers: { headers: { authorization: string, "content-type": "application/json" } }
    constructor(token: string){
        this.token = token;
        this.headers = { headers: { authorization: token, "content-type": "application/json" } };
    };
    async sleep(ms: number){
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
}