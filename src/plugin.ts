export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

export default
class Database {
    private db:any;
    private cradle:any;

    constructor(url?:string, port?:number) {
        // register plugin
        this.register.attributes = {
            name: 'bemily-database',
            version: '0.1.0'
        };

        // import database plugin
        this.cradle = require('cradle');

        // use specific setup options if committed
        if (url && port) {
            this.cradle.setup({
                host: url,
                port: port
            });
        }
        this.createDatabase();
    }

    // create database instance
    createDatabase() {
        this.db = new (this.cradle.Connection)();
        console.log(this.db);
        // check if database exists
        if(!this.db) {
            throw new Error('Error: database does not exist!');
        }
    }


    register:IRegister = (server, options, next) => {
        server.bind(this);
        this._register(server, options);
        next();
    };

    private _register(server, options) {
        // Register
        return 'register';
    }
    errorInit(error) {
        if(error) {
            console.log('Error: init plugin failed:', error);
        }
    }
}