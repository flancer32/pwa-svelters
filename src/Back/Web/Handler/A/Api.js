/**
 * HTTP request handler for API-related routes.
 *
 * Designed for server-side use within the backend.
 * Dispatches incoming requests based on the URL structure and default route settings.
 */
export default class Svelters_Back_Web_Handler_A_Api {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {Svelters_Back_Web_Handler_A_Api_A_Calorie_Log_Get} aCalorieLogGet
     * @param {Svelters_Back_Web_Handler_A_Api_A_Calorie_Log_Save} aCalorieLogSave
     * @param {Svelters_Back_Web_Handler_A_Api_A_Feedback_Submit} aFeedbackSubmit
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
            Svelters_Back_Web_Handler_A_Api_A_Feedback_Submit$: aFeedbackSubmit,
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
         * @return {Promise<boolean>}
         */
        this.run = async function (req, res) {
            const url = new URL(req.url, `https://${req.headers.host}`);
            const parts = url.pathname.split('/'); // /app/api/...
            if (parts[2] === DEF.SHARED.ROUTE_API) {
                if ((parts[3] === 'calorie') && (parts[4] === 'log')) {
                    // /app/api/calorie/log/...
                    if (parts[5] === 'get') return aCalorieLogGet.run(req, res);
                    else if (parts[5] === 'save') return aCalorieLogSave.run(req, res);
                } else if (parts[3] === 'feedback') {
                    // /app/api/feedback/...
                    if (parts[4] === 'submit') return aFeedbackSubmit.run(req, res);
                } else if (parts[3] === 'profile') {
                    // /app/api/profile/...
                    if (parts[4] === 'get') return aProfileGet.run(req, res);
                    else if (parts[4] === 'update') return aProfileUpdate.run(req, res);
                } else if (parts[3] === 'weight') {
                    // /app/api/weight/...
                    if (parts[4] === 'log') {
                        if (parts[5] === 'save') {
                            return aWeighLogSave.run(req, res);
                        } else if (parts[5] === 'get') {
                            return aWeighLogGet.run(req, res);
                        }
                    } else if (parts[4] === 'goal') {
                        if (parts[5] === 'save') {
                            return aWeighGoalSave.run(req, res);
                        } else if (parts[5] === 'get') {
                            return aWeighGoalGet.run(req, res);
                        }
                    }
                }
            }
        };

    }
}
