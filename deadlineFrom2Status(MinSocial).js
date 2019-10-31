var cursor = db.claims.find({ "customClaimNumber": { $in: [
"P001-1613752364-25001676",
"P001-1613752364-25001942",
"P001-1613752364-25002254"
        ] } });
        
        cursor.forEach(function (claim) {
        
            // Переменные
            var id = claim._id.valueOf();
            var dead = claim.daysToDeadline;
            var claimDate = claim.claimCreate;
            var plusDate = claimDate.getTime() + (1000 * 3600 * 24);
            var firstStatus = db.claims_status.find({
                "claimId": id
            }).sort({
                "statusDate": 1
            }).limit(1).next();
            var secondStatusFind = db.claims_status.find({
                "claimId": id
            }).sort({
                "statusDate": 1
            }).limit(2).toArray();
            var secondStatus = secondStatusFind[1].statusCode;
            var secondDate = secondStatusFind[1].statusDate;
            var statusDate = firstStatus.statusDate;
        
            // Первое условие, проверка дат
            
            if (claim.resultStatus == undefined){
              print(claim.customClaimNumber + " - отсутствует результат");
            } else
            
            if (claimDate != statusDate && statusDate > plusDate) {
                var subtractDates = (statusDate - claimDate);
                var subDates = Math.round(subtractDates/(1000 * 3600 * 24));
                var deadDays = (subDates + dead);

                // Принт и сохранение дедлайнов
                print(claim.customClaimNumber + " - Корректный дедлайн: " + deadDays);
				claim.daysToDeadline = deadDays;
                db.claims.save(claim);
                
            } else if(secondDate>plusDate && (secondStatus == '2' || secondStatus == '6')){
                var secondsubtracDate = (secondDate-claimDate);
                var secondSubDates = Math.round(secondsubtracDate/(1000 * 3600 * 24));
                var secondDeadDays = (secondSubDates + dead)

                // Принт и сохранение дедлайнов
                print (claim.customClaimNumber + " - Корректный дедлайн: " + secondDeadDays)
				claim.daysToDeadline = secondDeadDays;
                db.claims.save(claim);

            } else {
                print(claim.customClaimNumber + ' - Заявка не подошла по условиям, дней до дедлайна - ' + claim.daysToDeadline);
            }
        });