var iteration = 0;

var bulk = db.claims.initializeUnorderedBulkOp();
var bulk2 = db.xx_daysToDeadline_backup.initializeUnorderedBulkOp();

var claimCursor = db.getCollection("claims").find(
	{ "activationDate": { $gte: ISODate("2019-01-01T12:00:43.140+0000") }, "consultation": false }
).addOption(DBQuery.Option.noTimeout);

/*var claimCursor = db.getCollection("claims").find(
	{ "customClaimNumber": "P001-3154481389-23038484" }
).addOption(DBQuery.Option.noTimeout);*/

claimCursor.forEach(function(claim){
	iteration++;
	
	if (claim.stopRecalculatingDeadline == true) return;
	if (claim.suspenseReason != undefined ) return;
	if (claim.daysToDeadline == undefined ) return;
	if (( claim.parentClaimId != undefined) || (claim.complex == true)) return;
	
	var oldDaysToDeadline = claim.daysToDeadline;
	var origClaimId = claim._id;

	
	var deadlineDateDirty = claim.deadlineDate;
	if ( (deadlineDateDirty == null) || (deadlineDateDirty == undefined)) return;
	var deadlineDate = new Date(deadlineDateDirty.setHours(0,0,0,0));
	
	var completed = false;
	
	if(claim.resultStatus != undefined && claim.docSendDate != undefined){
		var docSendDateInMs = claim.docSendDate.getTime();
		var daysInMs = deadlineDate - docSendDateInMs;
		var days = daysInMs / 1000 / 60 / 60 / 24;
		var daysToDeadline = NumberInt(Math.ceil(days));
		completed = true;
	} else if(claim.resultStatus == undefined && claim.docSendDate == undefined) {
		var now = new Date();
		var daysInMs = deadlineDate - now;
		days = daysInMs / 1000 / 60 / 60 / 24;
		daysToDeadline = NumberInt(Math.ceil(days));
	} else {
		print("(!) Claim " + origClaimId + " completed incorrectly, skipped.");
		return;
	}
	
	var bulkUpdate = bulk.find( { "_id": origClaimId } ).update(
	{
			$set:{
				"daysToDeadline": daysToDeadline
			}
	});
	
	var bulkInsert = bulk2.insert(
	{
		claimId: claim._id, oldDaysToDeadline: NumberInt(oldDaysToDeadline), newDaysToDeadline: daysToDeadline
	});
	
	print("I: " + iteration + "; hasResult: " + completed + "; GUID: " + origClaimId + "; CCN: " + claim.customClaimNumber + "; daysToDeadline: " + daysToDeadline);
	
	if (iteration % 1000 == 0){
	   // print (iteration);
		bulk.execute();
		bulk = db.claims.initializeUnorderedBulkOp();
		
		bulk2.execute();
		bulk2 = db.xx_daysToDeadline_backup.initializeUnorderedBulkOp();
	}
	
});

bulk.execute();
bulk2.execute();

print("Updated total:  claim(s).");