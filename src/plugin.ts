export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

// TODO: refactor user stuff in new file

/**
 * database plugin
 *
 * example calls:
 *
 *      // local database (default)
 *      new Database('app');
 *
 *      // iriscouch online
 *      new Database('app','http://emily.iriscouch.com',80);
 */
export default
class Database {
    private db:any;
    private cradle:any;

    // defines
    const
    VIEW_USER_LOGIN = 'user/login';
    VIEW_USER_USER = 'user/user';

    /**
     * Constructor to create a database instance
     *
     * @param database:string
     *      represents the name of the database
     * @param url:string
     *      url to the storage location of the database
     * @param port
     *      port to connect to the storage location
     */
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

    // open database instance
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
        server.expose('getUserById', this.getUserById);
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
        // route to get login data of user
        server.route({
            method: 'GET',
            path: '/login/{userid}',
            handler: (request, reply) => {
                this.getUserLogin(request.params.userid, (err, data) => {
                    if (err) {
                        return reply(err).code(400);
                    }
                    reply(data);
                });
            }
        });

        // route to get user
        server.route({
            method: 'GET',
            path: '/users/{userid}',
            handler: (request, reply) => {
                this.getUserById(request.params.userid, (err, data) => {
                    if (err) {
                        return reply(err).code(400);
                    }
                    reply(data);
                });
            }
        });

        // route to update user information
        server.route({
            method: 'PUT',
            path: '/users',
            handler: (request, reply) => {
                var user = request.payload.user;
                this.updateUser(user._id, user._rev, user, (err, data) => {
                    if (err) {
                        return reply(err).code(400);
                    }
                    reply(data);
                });
            }
        });

        // route to create new user
        server.route({
            method: 'POST',
            path: '/users',
            handler: (request, reply) => {
                var user = request.payload;
                this.db.save(user, (err, res) => {
                    if (err) {
                        return reply(err).code(400);
                    }
                    reply(res);
                })
            }
        });

        // Register
        return 'register';
    }

    /**
     * Get user from database by specific user id.
     *
     * @param userId:string
     * @param callback
     */
    getUserById(userId:string, callback) {
        this.db.view(this.VIEW_USER_USER, {key: userId}, function (err, res) {
            if (err) {
                callback(err);
            }
            callback(null, res);
        });
    }

    /**
     * Create a new user.
     *
     * @param user:json-object
     * @param callback
     */
    createUser(user, callback) {
        this.db.save(user, function (err, res) {
            if (err) {
                callback(err);
            }
            callback(null, res);
        });
    }

    updateUser(userId:string, rev:string, user, callback) {
        this.db.save(userId, rev, user, function (err, res) {
            if (err) {
                callback(err);
            }
            callback(null, res);
        });
    }

    /**
     * Get json object with ser login data of specific user id.
     *
     * @param userId
     * @param callback
     */
    getUserLogin(userId:string, callback) {
        this.db.view(this.VIEW_USER_LOGIN, {key: userId}, function (err, res) {
            if (err) {
                callback(err);
            }
            callback(null, res);
        });
    }


    errorInit(err) {
        if (err) {
            console.log('Error: init plugin failed:', err);
        }
    }
}