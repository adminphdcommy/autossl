const errorList = require("./response.config.util").errorList



/**
 * 
 * @typedef {Object} responseOptionsModel
 * @property {Number} code
 * @property {import("./response.config.util").errorListKeys} desc
 * @property {any} data
 * @property {import("./response.config.util").errorListKeys|any} error
 */

/**
 * 
 * @typedef {Object} formattedResponseModel
 * @property {"1000"|"2400"} code
 * @property {String} message "System message" if return with error code
 * @property {any} data
 * @property {Object} error
 * @property {import("./response.config.util").errorListKeys} error.subCode
 * @property {String} error.message
 * @property {String?} error.reason
 */

/**
 * 
 * @param {responseOptionsModel} options 
 * @returns {formattedResponseModel}
 */
function genres(options) {
    // console.log(options)
    /**
     * @type {formattedResponseModel}
     */
    let resObj = {}
    if(options.code == 0 || options.code == 1000 || options.code == "1000"){
        resObj["code"] = "1000"
        resObj["message"] = options.desc || "command complete successfull"
        if(options.data){
            resObj["data"] = options.data
        }
    }else{
        resObj["code"] = "2400"
        resObj["message"] = "System message"



        let err = options.error || options.desc||  "unknown"

        let errorListKeys = Object.keys(errorList)
        let errorListMsg = errorListKeys.map(x=>{return errorList[x]})




        if(err instanceof Error){
            if(errorListKeys.includes(err.name)){
                resObj["error"] = {
                    subCode:err.name,
                    message: errorList[err.name]
                }
            }else if(errorListMsg.includes(err.message)){
                let index = errorListMsg.findIndex(x=>{
                    return err.message == x
                })
                resObj["error"] = {
                    subCode:errorListKeys[index],
                    message: err.message
                }
            }else{
                resObj["error"] = {
                    subCode: "serverError",
                    message: errorList["serverError"],
                    reason: err.message
                }            
            }
            
        }else if(typeof err == "string"){
            if(errorListKeys.includes(err)){
                resObj["error"] = {
                    subCode:err,
                    message:errorList[err]
                }    
            }else if(errorListMsg.includes(err)){
                let index = errorListMsg.findIndex(x=>{
                    return err == x
                })
                resObj["error"] = {
                    subCode:errorListKeys[index],
                    message: err
                }
            }else{
                resObj["error"] = {
                    subCode:"knownServerError",
                    message:errorList["knownServerError"],
                    reason:err
                }   
            }

            if(options.error){
                if(options.error instanceof Error){
                    resObj["error"]["reason"] = options.error.message
                }else{
                    resObj["error"]["reason"] = options.error
                }
            }
        }else{
            resObj["error"] = {
                subCode:"unknown",
                message:errorList["unknown"],
                reason:err
            }   

        }

        if(resObj["error"].reason == resObj["error"].message){
            delete resObj["error"].reason
        }
    }

    return resObj

}

exports.genres = genres