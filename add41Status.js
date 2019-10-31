var cursor = db.claims.find({
    "service.srguServiceId": "5000000000188563714",
    "currStatus.statusCode": "40",
    "claimCreate": { $gte: ISODate("2019-03-01T03:00:00.000+0300") } 
});

cursor.forEach(
    function (claim){
        var claimId = claim._id;
        var claimIdStr = claimId.valueOf();

        // Поиск заявок с 40 статусом в статусной модели
        var statuses = db.claims_status.findOne({
            "claimId" : claimIdStr,
            "statusCode" : "40"
        });

        // Присвоение данных для новой статусной модели
        var statusDateNew = statuses.statusDate.getTime();
        var statusDateMinute = new Date (statusDateNew + (10*60*1000));
        var deptIdNew = statuses.deptId;

        // Создание объекта с новым статусом
        var contentNew = { 
            "_id" : new ObjectId(), 
            "_class" : "status", 
            "claimId" : claimIdStr, 
            "statusDate" : statusDateMinute, 
            "statusCode" : "41",  
            "deptId" : deptIdNew,  
            "createDate" : statusDateMinute, 
            "lastModified" : statusDateMinute, 
            "createBy" : "rldd2", 
            "lastModifiedBy" : "rldd2", 
            "createState" : "COMPLETED"
        }

        // Добавление статуса в коллекцию
        db.claims_status.save(contentNew);

        db.claims.update(
            {
				"_id" : claimId,
                "currStatus.statusCode" : "40"
            },
            {
                $set : {
                "currStatus.statusCode" : "41"
                }
            },
            {
                multi : true
            }
        );
        print(claim.customClaimNumber);
    }
);