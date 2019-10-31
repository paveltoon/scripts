var claimNumbers = [
  "B503-3687385682-29",
  "В503-3687385682-30"
];
for (var i = 0; i < claimNumbers.length; i++) {
  var claim = db.claims.findOne({
      "customClaimNumber": claimNumbers[i]
    });

  if (claim == undefined) {
    print(claimNumbers[i] + " is wrong number");
    continue;
  }

  if (claim.resultStatus == undefined) {
    print(claim.customClaimNumber + " has no result status");
    continue;
  }

  var resultStatus = db.claims_status.findOne({
      "claimId": claim._id.valueOf(),
      "statusCode": {
        $in: ["3", "4"]
      }
    });
  var dateOfStatusMS = resultStatus.statusDate.getTime();
  var dateOfStatus = new Date(dateOfStatusMS);

  claim.docSendDate = dateOfStatus;
  print(claim.customClaimNumber + " - corrected");
  db.claims.save(claim);
}