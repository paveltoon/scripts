//All claims
var claimsNow = db.claims.find({ "senderCode": "IPGU01001", "claimCreate": { $gte: ISODate("2019-01-01T00:00:00.000+0000") } }).count();
var claims2015 = db.claims_2015.find({ "senderCode": "IPGU01001" }).count();
var claims2016 = db.claims_2016.find({ "senderCode": "IPGU01001" }).count();
var claims2017 = db.claims_2017.find({ "senderCode": "IPGU01001" }).count();
var claims2018 = db.claims.find({ "claimCreate": { $gte: ISODate("2018-01-01T00:00:00.000+0000"), $lte: ISODate("2019-01-01T00:00:00.000+0000") }, "senderCode": "IPGU01001" }).count();

var claimsAll = +claimsNow + +claims2015 + +claims2016 + +claims2017 + +claims2018;

//All closed claims

var claimsNowClosed = db.claims.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": { $exists: true }, "senderCode": "IPGU01001", "claimCreate": { $gte: ISODate("2019-01-01T00:00:00.000+0000") } }).count();
var claims2015Closed = db.claims_2015.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": { $exists: true }, "senderCode": "IPGU01001" }).count();
var claims2016Closed = db.claims_2016.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": { $exists: true }, "senderCode": "IPGU01001" }).count();
var claims2017Closed = db.claims_2017.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": { $exists: true }, "senderCode": "IPGU01001" }).count();
var claims2018Closed = db.claims.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "claimCreate": { $gte: ISODate("2018-01-01T00:00:00.000+0000"), $lte: ISODate("2019-01-01T00:00:00.000+0000") }, "resultStatus": { $exists: true }, "senderCode": "IPGU01001" }).count();

var claimsClosed = +claimsNowClosed + +claims2015Closed + +claims2016Closed + +claims2017Closed + +claims2018Closed;

//All unclosed claims

var claimsNowUnclosed = db.claims.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": { $exists: false }, "senderCode": "IPGU01001", "claimCreate": { $gte: ISODate("2019-01-01T00:00:00.000+0000") } }).count();
var claims2015Unclosed = db.claims_2015.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": { $exists: false }, "senderCode": "IPGU01001" }).count();
var claims2016Unclosed = db.claims_2016.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": { $exists: false }, "senderCode": "IPGU01001" }).count();
var claims2017Unclosed = db.claims_2017.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": { $exists: false }, "senderCode": "IPGU01001" }).count();
var claims2018Unclosed = db.claims.find({ "claimCreate": { $gte: ISODate("2018-01-01T00:00:00.000+0000"), $lte: ISODate("2019-01-01T00:00:00.000+0000") }, "senderCode": "IPGU01001", "oktmo": { $ne: "99999999" }, "currStatus.statusCode": { $ne: "86" }, "resultStatus": { $exists: false } }).count();

var claimsUnclosed = +claimsNowUnclosed + +claims2015Unclosed + +claims2016Unclosed + +claims2017Unclosed + +claims2018Unclosed;

//All Positive claims
var claimsNowPos = db.claims.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": "3", "senderCode": "IPGU01001", "claimCreate": { $gte: ISODate("2019-01-01T00:00:00.000+0000") } }).count();
var claims2015Pos = db.claims_2015.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": "3", "senderCode": "IPGU01001" }).count();
var claims2016Pos = db.claims_2016.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": "3", "senderCode": "IPGU01001" }).count();
var claims2017Pos = db.claims_2017.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": "3", "senderCode": "IPGU01001" }).count();
var claims2018Pos = db.claims.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "claimCreate": { $gte: ISODate("2018-01-01T00:00:00.000+0000"), $lte: ISODate("2019-01-01T00:00:00.000+0000") }, "resultStatus": "3", "senderCode": "IPGU01001" }).count();

var claimsPos = +claimsNowPos + +claims2015Pos + +claims2016Pos + +claims2017Pos + +claims2018Pos;

//All Negative claims
var claimsNowNeg = db.claims.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": "4", "senderCode": "IPGU01001", "claimCreate": { $gte: ISODate("2019-01-01T00:00:00.000+0000") } }).count();
var claims2015Neg = db.claims_2015.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": "4", "senderCode": "IPGU01001" }).count();
var claims2016Neg = db.claims_2016.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": "4", "senderCode": "IPGU01001" }).count();
var claims2017Neg = db.claims_2017.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "resultStatus": "4", "senderCode": "IPGU01001" }).count();
var claims2018Neg = db.claims.find({ "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" }, "claimCreate": { $gte: ISODate("2018-01-01T00:00:00.000+0000"), $lte: ISODate("2019-01-01T00:00:00.000+0000") }, "resultStatus": "4", "senderCode": "IPGU01001" }).count();

var claimsNeg = +claimsNowNeg + +claims2015Neg + +claims2016Neg + +claims2017Neg + +claims2018Neg;

//All Print

print( "Всего заявок;Заявок закрыто;Заявок открыто;Закрыто положительно;Закрыто отрицательно\n" + claimsAll + ';' + claimsClosed + ';' + claimsUnclosed + ';' + claimsPos + ';' + claimsNeg);
print("2015;" + claims2015 + ';' + claims2015Closed + ';' + claims2015Unclosed + ';' + claims2015Pos + ';' + claims2015Neg)
print("2016;" + claims2016 + ';' + claims2016Closed + ';' + claims2016Unclosed + ';' + claims2016Pos + ';' + claims2016Neg)
print("2017;" + claims2017 + ';' + claims2017Closed + ';' + claims2017Unclosed + ';' + claims2017Pos + ';' + claims2017Neg)
print("2018;" + claims2018 + ';' + claims2018Closed + ';' + claims2018Unclosed + ';' + claims2018Pos + ';' + claims2018Neg)
print("2019;" + claimsNow + ';' + claimsNowClosed + ';' + claimsNowUnclosed + ';' + claimsNowPos + ';' + claimsNowNeg)