export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

export default
class Database {
    private db:any;
    private cradle:any;

    constructor(database:string, url?:string, port?:number) {
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
        this.openDatabase(database);
    }

    // create database instance
    private openDatabase = (database:string)=> {
        this.db = new (this.cradle.Connection)().database(database);
        // check if database exists
        if (!this.db) {
            throw new Error('Error: database does not exist!');
        }
    };


    public getUserLogin = (nameOfUser:string) => {
        console.log(nameOfUser);
        this.db.view('login/login', function (err, res) {
            if(err) {
                throw Error(err);
            }
            return res;
        });
    };


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
        if (error) {
            console.log('Error: init plugin failed:', error);
        }
    }
}