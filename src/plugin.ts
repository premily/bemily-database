export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

export default
class Database {
    constructor() {
        this.register.attributes = {
            name: 'bemily-database',
            version: '0.1.0'
        };
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

    getUser() {
        return 'getUser called';
    }

    /**
     * exposes functions to other plugins
     * @param server
     */
    exportApi(server) {
        server.expose('getUser', this.getUser);
    }

    errorInit(error) {
        if(error) {
            console.log('Error: init plugin failed:', error);
        }
    }
}