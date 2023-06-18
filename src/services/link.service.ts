
import { Link } from "../entities";
import { SPSService } from "./sps.service";

export class LinkService  extends SPSService<Link> {
    constructor() {
        super(Link);
    }
    
    public async getDetails(id: number): Promise<Link> {
        let link = await this.dataConn.getRepository(Link).findOne({where:{id: id}});
        
        return link;
    }
    
    
}