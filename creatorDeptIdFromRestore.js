var cursor = db.claims.find({
    "customClaimNumber": {
        $in: [
"P001-9563619596-32253231",
"P001-2231469400-32253113",
"P001-5142591247-32191073",
"P001-0859885216-32306759",
"P001-3298214572-32270866",
"P001-1170860180-32185533",
"P001-6573779112-32330035",
"P001-7096568535-32192080",
"P001-9739094337-32126322",
"P001-7973446732-32256311",
"P001-9762066834-32341277",
"P001-0970960066-32205477",
"P001-7343363829-32167732",
"P001-6332759800-32338682",
"P001-1022511163-32210110",
"P001-5886720177-32292588",
"P001-5994677284-32335524",
"P001-9042498306-32225408",
"P001-2723002187-32343997",
"P001-4139593999-32341124",
"P001-8534154714-32142845",
"P001-0554019742-32303632",
"P001-4236149582-32192435",
"P001-6329762400-32284937",
"P001-5466848673-32344045",
"P001-9109626440-32344030",
"P001-3853094748-32341477",
"P001-6169575947-32343412",
"P001-8602494300-32340964",
"P001-7575269385-32238582",
"P001-6532434706-32186570",
"P001-4245712244-32294906",
"P001-4574686609-32141162",
"P001-4407791602-32212490",
"P001-7640904198-32153939",
"P001-0894118010-32339980",
"A001-7453978104-32596333",
"A001-9370345178-32591608",
"P001-8914202294-32240153",
"A001-4780492140-32586941",
"A001-4780492140-32585793",
"P001-6243630588-32299754",
"A001-0262073651-32554315",
"P001-7927103702-32343847",
"A001-8616311020-32578459",
"P001-8561806305-32294545",
"P001-3313509203-32340523",
"P001-7400680243-32330534",
"P001-5976137561-32268639",
"P001-2296839487-32126526",
"A001-7553070534-32341821",
"P001-6082984170-32141899",
"P001-2546143987-32255464",
"P001-6784572921-32304443",
"P001-9589173129-32249378",
"P001-7419755617-32149461",
"P001-6717934529-32339735",
"P001-1248928298-32339694",
"P001-9923794760-32192509",
"P001-2594102031-32306395",
"P001-3153304538-32306407",
"A001-1697139584-32160980",
"P001-9413541787-32253347",
"P001-8907720003-32339330",
"P001-9508009910-32251720",
"P001-8849120229-32330386",
"P001-7751896854-32335262",
"P001-0557390279-32338236",
"P001-4493882922-32265380",
"P001-4577194711-32339269",
"A001-8907998478-32190941",
"P001-1767886358-32319674",
"P001-1863280203-32323568",
"P001-6211568098-32339603",
"P001-0584348988-32160828",
"P001-0971640909-32283962",
"P001-8739073758-32284383",
"P001-9914808490-32184299",
"P001-5804160808-32307783",
"P001-4407320100-32317237",
"P001-5709172637-32256573",
"P001-2487966393-32338959",
"P001-4894457815-32251730",
"P001-4570303293-32343625",
"P001-4748127839-32266106",
"P001-0756199950-32154146",
"P001-8619723876-32320188",
"P001-2266371529-32341074",
"P001-6573131518-32265095",
"P001-8971593324-32313263",
"P001-8593414826-32312851",
"P001-6079062943-32343480",
"P001-1520389090-32343091",
"P001-9773668476-32343887",
"P001-3831847497-32254384",
"P001-4601538088-32137633",
"P001-7523918140-32340638",
"P001-7171433059-32318001",
"P001-0955465680-32277732",
"P001-6710210025-32306764",
"P001-3951705034-32252974",
"P001-4078115229-32337095",
"P001-3431589660-32323734",
"P001-8194408240-32219165",
"A001-2943781813-32440728",
"A001-2943781813-32439555"
        ]
    }
}).forEach(function(claim){
    var ccn = claim.customClaimNumber;
    var origId = claim._id;
    var origClaim = db.xxx_rpgu_claims_to_restore.findOne({ "production": origId });
    if(origClaim != (undefined && null)){
        if(origClaim.claim[0].creatorDeptId != ( undefined && null )){
            var creatorDeptId = origClaim.claim[0].creatorDeptId;
        var upd = db.claims.update(
            { "customClaimNumber": ccn },
            { $set: { "creatorDeptId": creatorDeptId, "currStatus.deptId": creatorDeptId } },
            { multi: true }
        )
        print('Claim: ' + ccn + ', updated: ' + upd.nModified + ' / ' + upd.nMatched);
        } else {
            print('[WARNING]: There is no creatorDeptID in claim ' + ccn + ' with Id: ' + origId.valueOf());
        }   
    } else {
        print('[WARNING]: There is no claim ' + ccn + ' with Id: ' + origId.valueOf() + ', in xxx_rpgu_claims_to_restore.')
    }
})