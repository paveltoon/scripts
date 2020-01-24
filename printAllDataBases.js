var intRemote = new Mongo("eisgmu-rldd-int-rs1:27017");
var integration = intRemote.getDB("mfc-objects-replication");
var map = [];
integration.getCollection("dbs-info").find({}).forEach(function (claim) {
    var dept = claim.dbName;
    if (dept.startsWith('mfc')) {
        map.push(dept)
    }
});
var remote = new Mongo("10.10.80.100:27017");
var oktmos = {};
for (var i in map) {
    var remoteBase = remote.getDB(map[i]);
    var oktmo = remoteBase.orgcard.find({})[0].oktmo;
    print('"' + oktmo + '": "' + map[i] + '",');
}