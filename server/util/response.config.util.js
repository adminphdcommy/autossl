
/**
 * @typedef {"invalidDomFormat"|"unknown"|"serverError"|"knownServerError"|"domNotFound"|"hostNotFound"|"exception"|"rescodeMissing"|"domMissing"|"hostMissing"|"unauthorized"|"sslCrtMissing"|"sslKeyMissing"|"unmatchSslCrtAndKey"|"invalidCrtOrKey"|"eipNotFound"|"fileMax1Mb"|"eipIdMissing"|"statusMissing"|"invalidHostStatus"|"eipIdsMissing"|"proxyInstanceIdMissing"|"proxyInstanceIdNotFound"|"challengeVerified"|"hostOrChallengeIdMissing"|"challengeNotFound"|"bandwidthSizeMissingForBandwithType"|"hostExist"|"protocolNotSupported"|"hostOrIdMissing"|"eipIdsNotArray"|"broadcastConfigNotFound"|"broadcastTargetNotFound"|"broadcastError"|"hostOrProxyInstanceIdMissing"|"broadcastTargetInstanceIdSameAsOrigin"|"rejectedDueToBroadcasted"} errorListKeys
 */



let errorList = {
    unknown:"Unknown error has occured.",
    invalidDomFormat:"Invalid domainname format.",
    serverError:"An error occured at server.",
    knownServerError:"An error occured at server. Please check the reason.",
    domNotFound:"Domain not found.",
    hostNotFound:"Host not found.",
    exception:"something went wrong",
    hostMissing:"host is missing",
    hostnameMissing:"hostname is missing",
    domMissing:"domain is missing",
    rescodeMissing:"rescode is missing",
    unauthorized:"Unauthorized",
    sslCrtMissing:"SSL server certificate is missing",
    sslKeyMissing:"SSL private key is missing",
    unmatchSslCrtAndKey:"SSL Cert and Private Key doesn't match",
    invalidCrtOrKey:"Invalid SSL Cert or Private Key",
    eipNotFound:"eip not found",
    fileMax1Mb:"File too big. Max size is 1MB.",
    eipIdMissing:"eipId is missing",
    statusMissing:"status is missing",
    invalidHostStatus:"Invalid value. acceptable value: active, inactive",
    eipIdsMissing:"eipIds is missing",
    proxyInstanceIdMissing:"proxyInstanceId is missing",
    proxyInstanceIdNotFound:"proxyInstanceId not found",
    challengeVerified:"Challenge is verified",
    hostOrChallengeIdMissing:"Host or challenge ID is missing",
    challengeNotFound:"challenge not found",
    bandwidthSizeMissingForBandwithType:"bandwidth type require bandwithSize",
    hostExist:"host exist",
    protocolNotSupported:"protocol not supported",
    hostOrIdMissing:"host or _id is missing",
    challengeExpired:"host challenge expired",
    hostChallengedOverrided:"host challenge overrided by other rescode",
    hostNotVerified:"host not verified",
    eipIdsNotArray:"eipIds must be array of EIP id(s)",
    broadcastConfigNotFound:"unable to locate broadcast config",
    broadcastTargetNotFound:"boardcast target not found",
    broadcastError:"Broadcast error",
    hostOrProxyInstanceIdMissing:"host or proxyInstanceId is missing",
    broadcastTargetInstanceIdSameAsOrigin:"target proxyInstanceId can't same as origin proxyInstanceId",
    rejectedDueToBroadcasted:"request rejected due to the request has been broadcasted and can not be broadcast multiple time.",
    eipRequireArrayType:"EIP required Array data type."

}

exports.errorList = errorList