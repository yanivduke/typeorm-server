
import { ILink, ILinkData, ILinkStatus } from "../Interfaces";
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
    
    public async create(new_link: ILink): Promise<Link> {
        let link = await this.dataConn.getRepository(Link).save(new_link);
        
        return link;
    }

    public async update(link_data: ILinkData): Promise<Link> {
        let repo = this.dataConn.getRepository(Link);
        let link = await repo.findOne({where:{id: link_data.id}});
        link.name = link_data.name;
        link.desc = (link_data.desc) ? link_data.desc: link.desc
        
        link = await repo.save(link);

        return link;
    }

    public async status(link_status: ILinkStatus): Promise<Link> {
        let repo = this.dataConn.getRepository(Link);
        let link = await repo.findOne({where:{id: link_status.id}});
        link.status = link_status.status;
        
        link = await repo.save(link);

        return link;
    }

}