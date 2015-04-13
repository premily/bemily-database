export default
class Group {
    constructor(private db:any, private VIEWS:any) {

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
}