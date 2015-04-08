export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

export default
class Database {
    private db:any;
    private cradle:any;

    // defines
    const
    LOGIN_VIEW = 'login/login';

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


    getUserLogins(callback) {
        this.db.view('login/login', function (err, res) {
            if(err) {
                callback(err);
            }
            console.log(res);
            callback(null, res);
        });
    }


    register:IRegister = (server, options, next) => {
        server.bind(this);
        this._register(server, options);
        next();
    };

    private _register(server, options) {

        server.route({
            method: 'GET',
            path: '/logins',
            handler: (request, reply) => {
                this.getUserLogins((err, data) => {
                    if(err) {
                        return reply(err).code(400);
                    }
                    reply(data);
                });

            }
        });

        // Register
        return 'register';
    }

    errorInit(error) {
        if (error) {
            console.log('Error: init plugin failed:', error);
        }
    }
}