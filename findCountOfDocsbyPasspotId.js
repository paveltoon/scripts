var passId = [
    "5000000000193985096",
    "5000000010000011321",
    "5000000010000002815",
    "5000000000193685782",
    "5000000010000008509",
    "5000000000182799258",
    "5000000010000002810",
    "5000000010000002807"
        ];
        
        for (var i = 0; i < passId.length; i++){
            var cursorAll = db.claims.find({ "service.srguServicePassportId": passId[i], "claimCreate": { $gte: ISODate("2018-06-01T00:00:00.000+0000"), $lte: ISODate("2018-09-01T00:00:00.000+0000") }, "oktmo": { $ne: "99999999" }, "consultation": false });
            var cursorMFC = db.claims.find({ "service.srguServicePassportId": passId[i], "claimCreate": { $gte: ISODate("2018-06-01T00:00:00.000+0000"), $lte: ISODate("2018-09-01T00:00:00.000+0000") }, "oktmo": { $ne: "99999999" }, "consultation": false, "senderCode": /^50.*/i });
            var cursorRPGU = db.claims.find({ "service.srguServicePassportId": passId[i], "claimCreate": { $gte: ISODate("2018-06-01T00:00:00.000+0000"), $lte: ISODate("2018-09-01T00:00:00.000+0000") }, "oktmo": { $ne: "99999999" }, "consultation": false, "senderCode": "IPGU01001" });
            var cursorNotMFCRPGU = db.claims.find({ "service.srguServicePassportId": passId[i], "claimCreate": { $gte: ISODate("2018-06-01T00:00:00.000+0000"), $lte: ISODate("2018-09-01T00:00:00.000+0000") }, "oktmo": { $ne: "99999999" }, "consultation": false, $and: [ { "senderCode": { $not: /^50.*/i } }, { "senderCode": { $ne: "IPGU01001" } } ] });
    
            var cursorAllNew = db.claims.find({ "service.srguServicePassportId": passId[i], "claimCreate": { $gte: ISODate("2019-06-01T00:00:00.000+0000"), $lte: ISODate("2019-09-01T00:00:00.000+0000") }, "oktmo": { $ne: "99999999" }, "consultation": false });
            var cursorMFCNew = db.claims.find({ "service.srguServicePassportId": passId[i], "claimCreate": { $gte: ISODate("2019-06-01T00:00:00.000+0000"), $lte: ISODate("2019-09-01T00:00:00.000+0000") }, "oktmo": { $ne: "99999999" }, "consultation": false, "senderCode": /^50.*/i });
            var cursorRPGUNew = db.claims.find({ "service.srguServicePassportId": passId[i], "claimCreate": { $gte: ISODate("2019-06-01T00:00:00.000+0000"), $lte: ISODate("2019-09-01T00:00:00.000+0000") }, "oktmo": { $ne: "99999999" }, "consultation": false, "senderCode": "IPGU01001" });
            var cursorNotMFCRPGUNew = db.claims.find({ "service.srguServicePassportId": passId[i], "claimCreate": { $gte: ISODate("2019-06-01T00:00:00.000+0000"), $lte: ISODate("2019-09-01T00:00:00.000+0000") }, "oktmo": { $ne: "99999999" }, "consultation": false, $and: [ { "senderCode": { $not: /^50.*/i } }, { "senderCode": { $ne: "IPGU01001" } } ] });
         
            print(cursorAll.count() + ';' + cursorMFC.count() + ';' + cursorRPGU.count() + ';' + cursorNotMFCRPGU.count() + ';' + cursorAllNew.count() + ';' + cursorMFCNew.count() + ';' + cursorRPGUNew.count() + ';' + cursorNotMFCRPGUNew.count());
        }