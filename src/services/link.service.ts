
import { IFeature, ILink, ILinkData, ILinkStatus } from "../Interfaces";
import { Link } from "../entities";
import { SPSService } from "./sps.service";

export class LinkService  extends SPSService<Link> {
    constructor() {
        super(Link);
    }
    
    public async getDetails(id: number): Promise<IFeature[]> {
        let arr2ret = new Array<IFeature>();
        let link = await this.dataConn.getRepository(Link).findOne({where:{id: id}});
        delete link.cdate;
        delete link.desc;
        delete link.id;
        delete link.link;
        delete link.name;
        delete link.status;
        let str = '[' + link.features.substring(1, link.features.length-1) + ']';
        let objArr = JSON.parse(str);
        objArr.forEach((element: IFeature) => {
            arr2ret.push(JSON.parse(element as any));
        });
        return arr2ret;
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