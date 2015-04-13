var Plugin = require('../index');
var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');
// Test shortcuts
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('Database root', function () {
    it('should work', function (done) {
        var server = new Hapi.Server();
        var plugin = new Plugin();
        server.connection({host: 'localhost', port: 80});

        server.register(plugin, function (err) {
            expect(err).to.not.exist();
            expect(plugin._register).to.be.a.function();
            expect(plugin._register()).to.be.a.string();
            expect(plugin.openDatabase).to.be.a.function();
            expect(plugin.db).to.be.exists();
            done();
        });
    });
});

describe('Database user', function () {
    it('should work', function (done) {
        var server = new Hapi.Server();
        var plugin = new Plugin();
        server.connection({host: 'localhost', port: 80});

        server.register(plugin, function (err) {
            expect(err).to.not.exist();
            expect(plugin.user.getUserById).to.be.a.function();
            expect(plugin.user.updateUser).to.be.a.function();
            expect(plugin.user.createUser).to.be.a.function();
            expect(plugin.user.getUserLogin).to.be.a.function();
            expect(plugin.user.getUser).to.be.a.function();
            done();
        });
    });
});