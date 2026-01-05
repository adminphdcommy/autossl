const fs = require("fs")
const crypto = require("crypto")

const util = require("../util/util")
const config = require("../config/config")
const acme = require("./acme")

let client
let account


/**
 * 
 * @param {string} domain 
 * @param {"dns|"http"} authType 
 */
async function getSslForDomain(domain, authType) {
    console.log("[getSslForDomain] running ")

    let errorDomains = []
    try {
        if (!domain) {
            throw new Error("domain is missing")
        }
        // let list = await getDomainListConfig()
        // console.log("list", list)
        let fiveDayFromNow = Date.now() + 5 * 24 * 60 * 60 * 1000

        let name = util.getPureDomainName(domain).fullname
        let pathName = name.replace(/\./g, "_")
        let currentCertInfo = getCertInfoFromLocalKeyPath(name)
        let currentCertExpiryDate = currentCertInfo ? new Date(currentCertInfo.validTo).getTime() : null
        // if (fs.existsSync(`${config.sslFolderPath}/${pathName}/cert`)) {
        //     let currentCert = fs.readFileSync(`${config.sslFolderPath}/${pathName}/cert`, { encoding: "utf8" })
        //     currentCertInfo = new crypto.X509Certificate(currentCert)
        //     console.log("currentCertInfo", currentCertInfo)
        //     currentCertExpiryDate = new Date(currentCertInfo.validTo).getTime()
        // }



        console.log("[getSslForDomain]", domain, currentCertExpiryDate)
        if ((currentCertExpiryDate && currentCertExpiryDate < fiveDayFromNow) || !currentCertExpiryDate) {
            try {
                let obj = await getCert(domain, { authType })

                console.log("[getSslForDomain] checking path", `${config.sslFolderPath}/${pathName}`)

                if (!fs.existsSync(`${config.sslFolderPath}/${pathName}`)) {
                    console.log("[getSslForDomain] path not exist", `${config.sslFolderPath}/${pathName}`)
                    fs.mkdirSync(`${config.sslFolderPath}/${pathName}`)
                }
                fs.writeFileSync(`${config.sslFolderPath}/${pathName}/key`, obj.key,)
                fs.writeFileSync(`${config.sslFolderPath}/${pathName}/cert`, obj.cert)
                fs.writeFileSync(`${config.sslFolderPath}/${pathName}/csr`, obj.csr)
                let newCertInfo = new crypto.X509Certificate(obj.cert)
                console.log("newCertInfo", newCertInfo)
                dtexpired = new Date(newCertInfo.validTo).getTime()
                dtstart = new Date(newCertInfo.validFrom).getTime()
                // await updateDomainListConfig(name)
            } catch (error) {
                console.log("[getSslForDomain] getCert error name:", error)
                errorDomains.push(domain)
            }
        } else {
            console.log("[getSslForDomain] domain [", domain, "] is not expiring")
        }


    } catch (error) {
        console.log("[getSslForDomain] error:", error)
        errorDomains.push(domain)
    }
}







/**
 * 
 * @param {String} domain 
 * @returns {Promise.<crypto.X509Certificate>}
 */
async function getCertInfoFromLocalKeyPath(domain) {
    try {
        let name = util.getPureDomainName(domain).fullname
        let pathName = name.replace(/\./g, "_")

        if (!fs.existsSync(`${config.sslFolderPath}/${pathName}`)) {
            return null
        } else {
            if (!fs.existsSync(`${config.sslFolderPath}/${pathName}/cert`)) {
                return null
            } else {
                let currentCert = fs.readFileSync(`${config.sslFolderPath}/${pathName}/cert`, { encoding: "utf8" })
                currentCertInfo = new crypto.X509Certificate(currentCert)
                // console.log(currentCertInfo)
                return currentCertInfo
            }
        }

    } catch (error) {
        console.log("[getCertInfo] error", error)
        throw error
    }
}




/**s
 * 
 * @param {String} domainname 
 * @param {Object} options 
 * @param {String[]} options.san
 * @param {"dns"|"http"} options.authType
 * @returns {Promise.<{"csr":String,"key":String,"cert":String}>}
 */
async function getCert(domainname, options) {
    console.log("[getCert] domainname", domainname)
    let name = util.getPureDomainName(domainname)
    try {

        let authType
        let id = util.idGenerator()
        if (!client) {
            // console.log()
            client = await acme.createClient(id)
        }
        if (!account) {
            account = await acme.createAccount(client)

        }
        let sans = []
        if (options && options.san) {
            options.san.forEach(san => {
                let sanname = util.getPureDomainName(san).fullname
                sans.push(sanname)
            })
        }

        if (name.fullname.startsWith("*.")) {
            sans.push(`${name.domainname}`)
        }

        let allNames = [name.fullname]
        if (sans.length > 0) {
            allNames = allNames.concat(sans)
        }


        let order = await acme.createOrder(client, allNames)


        let authorizations = await acme.getAuthorizations(client, order)
        console.log("authorizations", authorizations)
        if (!options.authType || options.authType == 'dns') {
            authType = "dns"
        } else {
            authType = 'http'
        }
        // let authz = authorizations[0]
        for (let i = 0; i < authorizations.length; i++) {
            let authz = authorizations[i]
            let { challenges } = authz
            let _challenge
            // console.log("challenges", challenges)
            for (let j = 0; j < challenges.length; j++) {
                let challenge = challenges[j]
                console.log(challenge)

                let dnsValue = await acme.getToken(client, challenge)
                if (challenge.type == "dns-01") {
                    let dnsSubdomain = `_acme-challenge${name.subdomain ? "." + name.subdomain : ""}`
                    console.log("--- ")
                    console.log("| ")
                    console.log("| [SSL] DNS", dnsSubdomain, dnsValue)
                    console.log("| ")
                    console.log("--- ")

                    if (authType == 'dns') {
                        _challenge = challenge
                    }

                } else if (challenge.type == "http-01") {
                    console.log("--- ")
                    console.log("| ")
                    console.log("[SSL] HTTP", challenge.token, dnsValue)
                    console.log("| ")
                    console.log("--- ")

                    if (authType == 'http') {
                        _challenge = challenge
                    }
                } else {
                    console.log("--- ")
                    console.log("| ")
                    console.log("[SSL] OTHERS", dnsValue)
                    console.log("| ")
                    console.log("--- ")

                }
            }
            console.log("AUTH TYPE", authType, _challenge)
            await util.timeout(20000)
            await acme.verifyChallenge(client, authz, _challenge)
            await acme.completeChallenge(client, _challenge)
            await acme.waitForValidStatus(client, _challenge)

        }






        let csrObj = await acme.createCsr(name.fullname, sans)
        await acme.finalizeOrder(client, order, csrObj.csr)
        let cert = await acme.getCertificate(client, order)
        let result = {
            ...csrObj,
            cert
        }
        console.log(result)
        return result
    } catch (error) {
        console.log("[socket getSSL] Exception", error)
    }

}

// isCertActiveByFile("pickafoo.com").then(console.log)

exports.getCertInfoFromLocalKeyPath = getCertInfoFromLocalKeyPath
exports.getSslForDomain = getSslForDomain