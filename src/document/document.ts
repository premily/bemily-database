/**
 * Created by Steffen on 14.04.2015.
 */
export default

/**
 * This class handles database queries for documents.
 */
class Document {
    private path:any;
    private fs:any;

    constructor(private db:any, private VIEWS:any) {

        this.path = require('path');
        this.fs = require('fs');
    }

    /**
     * Method for retrieving a single document from the databases
     * @param documentId
     * @param callback
     */
    getDocumentById = (documentId:string, callback) => {
        // TODO: find document in database with the looked up id

        // dummy document with attachment
        var doc = {
            _id: 'dasd',
            descr: 'located Couchdb document with attachment'
        };

        // document id
        var id = doc._id;
        var attachmentName = 'foo.txt';

        // the path where the attachment should be saved at
        //FIXME: From where do i get this path??
        var downloadPath = this.path.join(__dirname, 'foo_download.txt');

        // create a write stream based on the download path, where we stream the attachment later
        var writeStream = this.fs.createWriteStream(downloadPath);

        // create a read stream from the database
        var readStream = this.db.getAttachment('piped-attachment', 'foo.txt', function (err) { // note no second reply paramter
            if (err) {
                console.dir(err);
                return
            }
            console.dir('download completed and written to file on disk at path', downloadPath)
        });

        // perform the actual streaming to client.
        readStream.pipe(writeStream)
    }
}