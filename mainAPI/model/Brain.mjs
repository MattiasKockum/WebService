class Brain{

    static admin;
    static begin;
    static clients;
    static coffee;
    static eliza;
    static hello;
    static javascript;
    static myself;
    static rpg;

    constructor(data){

        this.admin = data.admin;
        this.begin = data.begin;
        this.clients = data.clients;
        this.coffee = data.coffee;
        this.eliza = data.eliza;
        this.hello = data.hello;
        this.javascript = data.javascript;
        this.myself = data.myself;
        this.rpg = data.rpg;
    }
}

export {Brain};