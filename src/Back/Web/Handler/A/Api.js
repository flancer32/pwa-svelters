/**
 * TODO: add JSDoc
 */
export default class Svelters_Back_Web_Handler_A_Api {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {Svelters_Back_Web_Handler_A_Api_A_Calorie_Log_Get} aCalorieLogGet
     * @param {Svelters_Back_Web_Handler_A_Api_A_Calorie_Log_Save} aCalorieLogSave
     * @param {Svelters_Back_Web_Handler_A_Api_A_Profile_Get} aProfileGet
     * @param {Svelters_Back_Web_Handler_A_Api_A_Profile_Update} aProfileUpdate
     * @param {Svelters_Back_Web_Handler_A_Api_A_Weight_Goal_Get} aWeighGoalGet
     * @param {Svelters_Back_Web_Handler_A_Api_A_Weight_Goal_Save} aWeighGoalSave
     * @param {Svelters_Back_Web_Handler_A_Api_A_Weight_Log_Get} aWeighLogGet
     * @param {Svelters_Back_Web_Handler_A_Api_A_Weight_Log_Save} aWeighLogSave
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            Svelters_Back_Web_Handler_A_Api_A_Calorie_Log_Get$: aCalorieLogGet,
            Svelters_Back_Web_Handler_A_Api_A_Calorie_Log_Save$: aCalorieLogSave,
            Svelters_Back_Web_Handler_A_Api_A_Profile_Get$: aProfileGet,
            Svelters_Back_Web_Handler_A_Api_A_Profile_Update$: aProfileUpdate,
            Svelters_Back_Web_Handler_A_Api_A_Weight_Goal_Get$: aWeighGoalGet,
            Svelters_Back_Web_Handler_A_Api_A_Weight_Goal_Save$: aWeighGoalSave,
            Svelters_Back_Web_Handler_A_Api_A_Weight_Log_Get$: aWeighLogGet,
            Svelters_Back_Web_Handler_A_Api_A_Weight_Log_Save$: aWeighLogSave,
        }
    ) {
        /**
         * Handles incoming HTTP requests.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         *
         * @return {Promise<void>}
         */
        this.run = async function (req, res) {
            const url = new URL(req.url, `https://${req.headers.host}`);
            const parts = url.pathname.split('/'); // /app/api/...
            if (parts[2] === DEF.SHARED.ROUTE_API) {
                if ((parts[3] === 'calorie') && (parts[4] === 'log')) {
                    // /app/api/calorie/log/...
                    if (parts[5] === 'get') await aCalorieLogGet.run(req, res);
                    else if (parts[5] === 'save') await aCalorieLogSave.run(req, res);
                } else if (parts[3] === 'profile') {
                    // /app/api/profile/...
                    if (parts[4] === 'get') await aProfileGet.run(req, res);
                    else if (parts[4] === 'update') await aProfileUpdate.run(req, res);
                } else if (parts[3] === 'weight') {
                    // /app/api/weight/...
                    if (parts[4] === 'log') {
                        if (parts[5] === 'save') {
                            await aWeighLogSave.run(req, res);
                        } else if (parts[5] === 'get') {
                            await aWeighLogGet.run(req, res);
                        }
                    } else if (parts[4] === 'goal') {
                        if (parts[5] === 'save') {
                            await aWeighGoalSave.run(req, res);
                        } else if (parts[5] === 'get') {
                            await aWeighGoalGet.run(req, res);
                        }
                    }
                }
            }
        };

    }
}
