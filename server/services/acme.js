/**
 * Example of acme.Client API
 */

const acme = require('acme-client');
const config = require("../config/config")
const env = require("../../env")




/**
 * Function used to satisfy an ACME challenge
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @param {string} keyAuthorization Authorization key
 * @returns {Promise}
 */

async function challengeCreateFn(authz, challenge, keyAuthorization) {
    /* Do something here */
    console.log("authz", authz);
    console.log("challenge", challenge);
    console.log("keyAuthorization", keyAuthorization);
}


/**
 * Function used to remove an ACME challenge response
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @returns {Promise}
 */

async function challengeRemoveFn(authz, challenge, keyAuthorization) {
    /* Do something here */
    console.log(authz);
    console.log(challenge);
    console.log(keyAuthorization);
}

let tasks = {}

/**
 * 
 * @param {String} id 
 * @returns {Promise.<acme.Client>}
 */
async function createClient(id) {
    try {
        console.log("[ACME] Initializing Client")
        let directoryUrl
        if (env == "PROD") {
            directoryUrl = acme.directory.letsencrypt.production
        } else if (env.toLowerCase() == "sectigo") {
            directoryUrl = 'https://acme.sectigo.com/v2/DV90'
        } else {
            directoryUrl = acme.directory.letsencrypt.staging
        }
        const client = new acme.Client({
            directoryUrl,
            accountKey: await acme.forge.createPrivateKey()
        });
        console.log(acme.directory.letsencrypt.production)
        return client
    } catch (error) {
        throw error
    }
}

/**
 * 
 * @param {acme.Client} client 
 * @returns {Promise.<import('acme-client/types/rfc8555').Account>}
 */
async function createAccount(client) {
    try {
        console.log("[ACME] Creating Client Account")
        let account = await client.createAccount({
            termsOfServiceAgreed: true,
            contact: [`mailto:${config.acmeEmailAccount}`]
        });
        console.log("[ACME] Client Account created")
        return account
    } catch (error) {
        throw error
    }
}

/**
 * 
 * @param {String} name 
 * @param {String[]} sans
 * @returns {Promise.<{csr:String,key:String}>}
 */
async function createCsr(name, sans) {
    try {
        let obj1 = {
            commonName: name,
        }
        if (sans && sans.length > 0) {
            obj1["altNames"] = sans
        }
        const [key, csr] = await acme.forge.createCsr(obj1);
        let obj = {
            csr: csr.toString(),
            key: key.toString()
        }
        return obj
    } catch (error) {
        throw error
    }
}

/**
 * 
 * @param {acme.Client} client 
 * @param {String[]} names 
 * @returns {Promise.<acme.Order>}
 */
async function createOrder(client, names) {
    try {
        console.log("[ACME] Creating Order")
        let orders = []
        names.forEach(x => {
            orders.push({
                type: 'dns',
                value: x
            })
        })
        const order = await client.createOrder({ identifiers: orders });
        return order
    } catch (error) {
        throw error
    }
}


/**
 * 
 * @param {acme.Client} client 
 * @param {acme.Order} order 
 * @returns {Promise.<acme.Authorization[]>}
 */
async function getAuthorizations(client, order) {
    try {
        console.log("[ACME] Retrieving Authorization")
        const authorizations = await client.getAuthorizations(order);

        return authorizations
    } catch (error) {
        throw error
    }
}
/**
 * 
 * @param {acme.Authorization} challenges 
 * @returns {import('acme-client/types/rfc8555').Challenge}
 */
async function getChallenge(challenges) {
    try {
        console.group("getChallenge")
        console.log("[ACME] Retrieving Challenge")
        console.log("challenges", challenges)
        console.groupEnd()
        let challenge
        challenges.forEach(x => {
            if (x.type == "dns-01") {
                challenge = x
            } else {
            }
        })
        return challenge
    } catch (error) {
        throw error
    }
}

/**
 * 
 * @param {acme.Client} client 
 * @param {import('acme-client/types/rfc8555').Challenge} challenge 
 * @returns {String}
 */
async function getToken(client, challenge) {
    try {
        console.log("[ACME] Retrieving Challenge Token", challenge)
        const keyAuthorization = await client.getChallengeKeyAuthorization(challenge);
        return keyAuthorization
    } catch (error) {
        throw error
    }
}


/**
 * 
 * @param {acme.Client} client 
 * @param {acme.Authorization} authz 
 * @param {import('acme-client/types/rfc8555').Challenge} challenge 
 * @returns {Promise.<Boolean>}
 */
async function verifyChallenge(client, authz, challenge) {
    console.log("[ACME] Verifying Challenge")
    return client.verifyChallenge(authz, challenge)
}

/**
 * 
 * @param {acme.Client} client 
 * @param {import('acme-client/types/rfc8555').Challenge} challenge 
 * @returns {Promise.<import('acme-client/types/rfc8555').Challenge>}
 */
async function completeChallenge(client, challenge) {
    console.log("[ACME] Completing Challenge")
    return client.completeChallenge(challenge)
}

/**
 * 
 * @param {acme.Client} client 
 * @param {import('acme-client/types/rfc8555').Challenge} challenge 
 * @returns {Promise.<import('acme-client/types/rfc8555').Challenge>}
 */
async function waitForValidStatus(client, challenge) {
    console.log("[ACME] Waiting For Valid Status")
    return client.waitForValidStatus(challenge)
}

/**
 * 
 * @param {acme.Client} client 
 * @param {acme.Order} order 
 * @param {String} csr 
 * @returns {Promise.<acme.Order>}
 */
async function finalizeOrder(client, order, csr) {
    console.log("[ACME] Finalizing Order")
    return client.finalizeOrder(order, csr)
}

/**
 * 
 * @param {acme.Client} client 
 * @param {acme.Order} order 
 * @returns {Promise.<String>}
 */
async function getCertificate(client, order) {
    try {
        console.log("[ACME] Get Certificate")
        const cert = await client.getCertificate(order);
        return cert.toString()

    } catch (error) {
        throw error
    }
}



exports.createClient = createClient
exports.createAccount = createAccount
exports.createCsr = createCsr
exports.createOrder = createOrder
exports.getAuthorizations = getAuthorizations
exports.getChallenge = getChallenge
exports.getToken = getToken
exports.verifyChallenge = verifyChallenge
exports.completeChallenge = completeChallenge
exports.waitForValidStatus = waitForValidStatus
exports.finalizeOrder = finalizeOrder
exports.getCertificate = getCertificate
exports.challengeCreateFn = challengeCreateFn
exports.challengeRemoveFn = challengeRemoveFn

