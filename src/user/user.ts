export default
class User {
    constructor(private db: any, private VIEWS: any) {

    }

    /**
     * Get user from database by specific user id.
     *
     * @param userId:string
     * @param callback
     */
    getUserById(userId:string, callback) {
        this.db.view(this.VIEWS.VIEW_USER_USER, {key: userId}, callback);
    }

    /**
     * Update user information.
     *
     * @param userId
     * @param rev
     * @param user
     * @param callback
     */
    updateUser(userId:string, rev:string, user, callback) {
        this.db.save(userId, rev, user, callback);
    }

    /**
     * Create a new user.
     *
     * @param user:json-object
     * @param callback
     */
    createUser(user, callback) {
        this.db.save(user, callback);
    }


    /**
     * Get json object with ser login data of specific user id.
     *
     * @param userId
     * @param callback
     */
    getUserLogin(userId:string, callback) {
        this.db.view(this.VIEWS.VIEW_USER_LOGIN, {key: userId}, callback);
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