
import { IAuthInfo } from "../Interfaces";
import { DataSource, SelectQueryBuilder, FindManyOptions, LessThan, Like, MoreThan } from "typeorm";
import { BaseEntity} from "typeorm";
import { IFilter } from "../Interfaces/sps.interface";
import { Connection } from "../../config/Database";

export type ObjectType<T> = { new (): T } | Function;
export class SPSService<T> {
    public entity: ObjectType<T>;
    public dataConn: DataSource;
    
    constructor(entity: ObjectType<T>) {
        this.entity = entity;
        this.dataConn = Connection;
    }

    public async get(id: number): Promise<BaseEntity> {
        let item: any 
        //    = await this.dataConn.getRepository(this.entity).findOne({where:{id:id}})
        let spsBuilder = this.dataConn.getRepository(this.entity).createQueryBuilder();
        spsBuilder.where("id=" + id);
        item = spsBuilder.getOne()
        return item;
    }

    public async search(searchObj:{[key: string]: any}, sp: {limit: any, start: any, sortField: any, sortDir: any, searchBy: any}): Promise<[T[], number]> {
        let arrFields: Array<string> = JSON.parse( sp.sortField )
        let arrDirs: Array<string> = JSON.parse( sp.sortDir )
        let orderBy: any
        if (arrFields.length > 0) {
            orderBy = Object.assign.apply({}, arrFields.map( (v, i) => ( {[v]: (arrDirs[i].toLowerCase()=='desc') ? "DESC" : "ASC"} ) ) );
            
        }

        let pageSize = parseInt(sp.limit)
        let offset = (parseInt(sp.start)-1)*pageSize;

        let answer: [T[], number] = await this.Search(searchObj, pageSize, offset, orderBy, sp.searchBy);
        return answer;
    }
    
    public async Search(searchObj:{[key: string]: any},limit: number, start: number, orderBy: any, search: any): Promise<[T[], number]>{
        
        let spsBuilder = this.dataConn.getRepository(this.entity).createQueryBuilder();
        this.parseSearch(spsBuilder, searchObj, search)
        spsBuilder
        .orderBy(orderBy)
        .take(limit)
        .skip(start);
        let answer = await spsBuilder.getManyAndCount()
        
        return answer;
        
    }

    private parseSearch(querySps :SelectQueryBuilder<any>, searchObj:{[key: string]: any}, strFields: any): any {
        let fields: Array<IFilter> = JSON.parse(strFields) as Array<IFilter>
        querySps.where("1=1");
        Object.keys(searchObj).forEach(filterKey => { 
            querySps.andWhere(`${filterKey} = :${filterKey}`, JSON.parse(`{"${filterKey}": "${searchObj[filterKey]}"}`));
        });
        if(fields && fields.length>0){
            fields.forEach(sf => { 
                if(sf.value) {
                    let fieldName = sf.id;
                    
                    switch (sf.type) {
                        case "text":
                            if (sf.operator=='=') {
                                querySps.andWhere(`"${fieldName}" = :${fieldName}`, JSON.parse(`{"${fieldName}": "${sf.value}"}`))
                            } else {
                                querySps.andWhere(`"${fieldName}" like :${fieldName}`, JSON.parse(`{"${fieldName}": "%${sf.value}%"}`))
                            }
                            break;
                        case "number":
                            switch (sf.operator) {
                                case '=':
                                    querySps.andWhere(`${fieldName} = :${fieldName}`, JSON.parse(`{"${fieldName}":${sf.value}}`))
                                    break;
                                case '>':
                                    querySps.andWhere(`${fieldName} > :${fieldName}`, JSON.parse(`{"${fieldName}":${sf.value}}`))
                                    break;
                                case '<':
                                    querySps.andWhere(`${fieldName} < :${fieldName}`, JSON.parse(`{"${fieldName}":${sf.value}}`))
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "date":
                            switch (sf.operator) {
                                case '=':
                                    querySps.andWhere(`${fieldName} = :${fieldName}`, JSON.parse(`{"${fieldName}": "${sf.value}"}`))
                                    break;
                                case '>':
                                    querySps.andWhere(`${fieldName} > :${fieldName}`, JSON.parse(`{"${fieldName}": "${sf.value}"}`))
                                    break;
                                case '<':
                                    querySps.andWhere(`${fieldName} < :${fieldName}`, JSON.parse(`{"${fieldName}": "${sf.value}"}`))
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "select":
                            if(Array.isArray(sf.value)){
                                querySps.andWhere(`${fieldName} in (:...${fieldName})`, JSON.parse(`{"${fieldName}": ${JSON.stringify(sf.value)}}`))
                            } else {
                                querySps.andWhere(`${fieldName} = :${fieldName}`, JSON.parse(`{"${fieldName}": ${JSON.stringify(sf.value)}}`))
                            }
                            break;
                        default:
                            //throw new Error("unknowen filter type");
                            break;
                    }
                }
            });
                
        } 
        //return querySps
    }

}


