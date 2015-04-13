import User from './user/user';

export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

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
    private user:any;

    // defines
    const
    private VIEWS = {
        VIEW_USER_LOGIN: 'user/login',
        VIEW_USER_USER: 'user/user',
        VIEW_GROUP_ALL: 'groups/groups'
    };

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

        this.user = new User(this.db, this.VIEWS);

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
        server.expose('getUserById', this.user.getUserById);
        server.expose('getUserLogin', this.user.getUserLogin);
        server.expose('createUser', this.user.createUser);
        server.expose('updateUser', this.user.updateUser);
        server.expose('getGroups', this.getGroups);
        server.expose('getGroupById', this.getGroupById);
        server.expose('createGroup', this.createGroup);
    }


    register:IRegister = (server, options, next) => {
        server.bind(this);
        this._register(server, options);
        this.exportApi(server);
        next();
    };

    private _register(server, options) {

        // Register
        return 'register';
    }


    /**
     * Get all groups of database of type 'group'
     *
     * @param callback
     */
    getGroups(callback) {
        this.db.view(this.VIEWS.VIEW_GROUP_ALL, function(err, res) {
            if (err) {
                callback(err);
            }
            callback(null, res);
        })
    }

    /**
     * Get specific group from database by id.
     *
     * @param groupId
     * @param callback
     */
    getGroupById(groupId:string, callback) {
        this.db.view(this.VIEWS.VIEW_GROUP_ALL, {key:groupId}, function(err, res) {
            if (err) {
                callback(err);
            }
            callback(null, res);
        })
    }

    /**
     * Create group entry in database:
     *
     * @param group
     * e.g.
     *  {
     *   _id: 'groupNumber',
     *   name: 'Digitaltechnik',
     *   type: 'group'
     *  }
     *
     * @param callback
     */
    createGroup(group, callback) {
        this.db.save(group, function (err, res) {
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