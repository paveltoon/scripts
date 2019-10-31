var cursor = db.services.find({});
            print("Service id;Service name;Document id;Document name;");
cursor.forEach(function (serv){
    if (cursor){
        if(serv.in_docs){
            var inDocs = serv.in_docs;
            for (var i = 0; i < inDocs.length; i++){
                var docId = inDocs[i].$id.valueOf();
                var docFind = db.service_docs.findOne({"_id": ObjectId(docId)});
                if ( docFind != null && docFind != undefined && docFind.adapterV3RlddId){
                    print(serv._id + ";" + serv.fullName + ';' + docFind._id + ";" + docFind.name);
                    return;
                }
            }
        }
    }
});