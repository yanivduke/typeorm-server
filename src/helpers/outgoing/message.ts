

export type MessageType<T> = { new (): T } | Function;
export abstract class OutgoingMessage<T> {
    public type: MessageType<T>;
    public content: string;
    public config: object; 
    constructor(type: MessageType<T>) {
        this.type = type;
    }

    public abstract send(): Promise<any>;

}


