export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

// TODO: refactor user stuff in new file

export default
class Database {
    private db:any;
    private cradle:any;

    // defines
    const
    VIEW_USER_LOGIN = 'user/login';
    VIEW_USER_USER = 'user/user';

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
    /**
     * exposes functions to other plugins
     * @param server
     */
    exportApi(server) {
        server.expose('getUser', this.getUserById);
        server.expose('getUserLogin', this.getUserLogin);
        server.expose('createUser', this.createUser);
    }


    register:IRegister = (server, options, next) => {
        server.bind(this);
        this._register(server, options);
        this.exportApi(server);
        next();
    };

    private _register(server, options) {
        server.route({
            method: 'GET',
            path: '/login/{userid}',
            handler: (request, reply) => {
                this.getUserLogin(request.params.userid, (err, data) => {
                    if(err) {
                        return reply(err).code(400);
                    }
                    reply(data);
                });
            }
        });

        server.route({
            method: 'GET',
            path: '/users/{userid}',
            handler: (request, reply) => {
                this.getUserById(request.params.userid,(err, data) => {
                    if(err) {
                        return reply(err).code(400);
                    }
                    reply(data);
                });
            }
        });

        server.route({
            method: 'POST',
            path: '/users',
            handler: (request, reply) => {
                var user = request.payload;
                this.db.save(user, (err, res) => {
                    if(err) {
                        return reply(err).code(400);
                    }
                    reply(res);
                })
            }
        });

        // Register
        return 'register';
    }

    getUserById(id:string, callback) {
        this.db.view(this.VIEW_USER_USER, function (err, res) {
            if(err) {
                callback(err);
            }
            callback(null, res);
        });
    }

    createUser(user, callback) {
        this.db.save(user, function (err, res) {
            if(err) {
                callback(err);
            }
            callback(null, res);
        });
    }

    // TODO: implement functionality to get specific user id
    getUserLogin(userId:string, callback) {
        this.db.view(this.VIEW_USER_LOGIN, function (err, res) {
            if(err) {
                callback(err);
            }
            callback(null, res);
        });
    }



    errorInit(error) {
        if (error) {
            console.log('Error: init plugin failed:', error);
        }
    }
}