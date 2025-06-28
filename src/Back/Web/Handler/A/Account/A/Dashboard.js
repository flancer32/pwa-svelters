/**
 * Handler for rendering dashboard.
 */
export default class Svelters_Back_Web_Handler_A_Account_A_Dashboard {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {Fl32_Web_Back_Helper_Respond} respond
     * @param {Fl64_Web_Session_Back_Manager} session
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Fl64_Tmpl_Back_Service_Render_Web} srvRender
     * @param {Svelters_Shared_Helper_Cast} cast
     * @param {Svelters_Shared_Helper_Measure} helpMeasure
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {typeof Svelters_Shared_Enum_Data_Type_Sex} SEX
     * @param {typeof Svelters_Shared_Enum_Product_Measure_Type} MEASURE
     * @param {typeof Svelters_Shared_Enum_Data_Measure_System} SYSTEM
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            Fl32_Web_Back_Helper_Respond$: respond,
            Fl64_Web_Session_Back_Manager$: session,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Tmpl_Back_Service_Render_Web$: srvRender,
            Svelters_Shared_Helper_Cast$: cast,
            Svelters_Shared_Helper_Measure$: helpMeasure,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            Svelters_Shared_Enum_Data_Type_Sex$: SEX,
            Svelters_Shared_Enum_Product_Measure_Type$: MEASURE,
            Svelters_Shared_Enum_Data_Measure_System$: SYSTEM,
        }
    ) {
        /* eslint-enable jsdoc/require-param-description,jsdoc/check-param-names */

        // FUNCS

        /**
         * @param {Svelters_Shared_Dto_User_Profile.Dto} profile
         * @returns {Svelters_Shared_Dto_Calorie_Log.Dto[]}
         */
        function calcCalories(profile) {
            const res = [];
            const items = profile?.lastCaloriesLog?.items ?? [];
            const useImperial = profile?.measureSystem === SYSTEM.IMPERIAL;

            for (const item of items) {
                const copy = {...item};
                if (useImperial) {
                    if (copy.measure === MEASURE.GRAMS) {
                        copy.measure = MEASURE.OUNCES;
                        copy.quantity = helpMeasure.gramsToOunces(copy.quantity);
                        copy.unitCalories = helpMeasure.kcalPer100gToPerOunce(copy.unitCalories);
                    } else if (copy.measure === MEASURE.MILLILITERS) {
                        copy.measure = MEASURE.FLUID_OUNCES;
                        copy.quantity = helpMeasure.mlToFluidOunces(copy.quantity);
                        copy.unitCalories = helpMeasure.kcalPer100mlToPerFluidOunce(copy.unitCalories);
                    }
                }
                copy.measure = helpMeasure.getUnitSymbol(copy.measure);
                res.push(copy);
            }
            return res;
        }

        /**
         * Validates the user's profile data and returns an object with the validation results.
         *
         * @param {Svelters_Shared_Dto_User_Profile.Dto} profile - The loaded user profile.
         * @returns {DtoDataChecks} An object containing the results of the profile data checks.
         */
        function calcDataChecks(profile) {
            const checks = new DtoDataChecks();
            checks.noCalories = !profile?.lastCaloriesLog?.date;
            checks.noGoal = !profile?.goal;
            checks.noProfile = !profile?.dateBirth || !profile?.height || !profile?.sex;
            checks.noWeight = !profile?.weight || !profile?.weightGoal;
            return checks;
        }

        /**
         * Calculates KPI card values from the user profile.
         *
         * @param {Svelters_Shared_Dto_User_Profile.Dto} profile
         * @param {Svelters_Shared_Helper_Cast} cast
         * @returns {DtoKpiCards}
         */
        function calcDataKpi(profile, cast) {
            // FUNCS
            /**
             * Calculates age from YYYY-MM-DD string.
             * @param {string} birthDate
             * @param {Svelters_Shared_Helper_Cast} cast
             * @returns {number}
             */
            function calcAge(birthDate, cast) {
                const date = cast.date(birthDate);
                if (!(date instanceof Date) || isNaN(date.getTime())) return NaN;
                const today = new Date();
                let age = today.getFullYear() - date.getFullYear();
                const m = today.getMonth() - date.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
                return age;
            }

            /**
             * Calculates Basal Metabolic Rate using Mifflin-St Jeor Equation.
             *
             * @param {{sex: string, age: number, height: number, weight: number}} param0
             * @returns {number}
             */
            function calcBmr({sex, age, height, weight}) {
                if (sex === SEX.MALE) {
                    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
                } else if (sex === SEX.FEMALE) {
                    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
                } else {
                    return NaN;
                }
            }

            // MAIN
            const dto = new DtoKpiCards();

            const weight = cast.decimal(profile?.weight);
            const goal = cast.decimal(profile?.weightGoal);
            const useImperial = profile?.measureSystem === SYSTEM.IMPERIAL;

            if (!isNaN(weight)) {
                dto.currentWeight = weight;
                dto.currentWeightLbs = useImperial ? helpMeasure.kgToLbs(weight) : null;
            }
            if (!isNaN(goal)) {
                dto.goalWeight = goal;
                dto.goalWeightLbs = useImperial ? helpMeasure.kgToLbs(goal) : null;
            }

            if (!isNaN(weight) && !isNaN(goal)) {
                dto.remaining = Math.round(Math.abs(weight - goal) * 10) / 10;
                dto.remainingLbs = useImperial ? helpMeasure.kgToLbs(dto.remaining) : null;
                dto.isPositive = (weight >= goal);
            }

            dto.lastCaloriesDate = profile?.lastCaloriesLog?.date || null;
            dto.lastCaloriesTotal = cast.decimal(profile?.lastCaloriesLog?.totalCalories);

            // BMR
            const height = cast.decimal(profile?.height);
            const sex = profile?.sex;
            const age = calcAge(profile?.dateBirth, cast);

            if (!isNaN(age) && !isNaN(height) && !isNaN(weight) && (sex === SEX.MALE || sex === SEX.FEMALE)) {
                dto.bmr = calcBmr({sex, age, height, weight});
            }

            return dto;
        }

        /**
         * @param {DtoDataChecks} checks
         * @return {boolean}
         */
        function calcHasFullData(checks) {
            return !checks.noCalories && !checks.noGoal && !checks.noProfile && !checks.noWeight;
        }

        // MAIN
        /**
         * Handles incoming HTTP requests.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         *
         * @return {Promise<boolean>}
         */
        this.run = async function (req, res) {
            return await trxWrapper.execute(null, async (trx) => {
                const {dto} = await session.getFromRequest({trx, req});
                const isAuthenticated = !!dto?.user_ref;
                const profile = (isAuthenticated)
                    ? await zHelper.readProfileUi({trx, userId: dto.user_ref}) : null;

                // compose view for Mustache template
                const view = new DtoVar();
                view.canSubscribe = zHelper.calcUserCanSubscribe({
                    dateSubscriptionEnd: profile?.dateSubscriptionEnd
                });
                view.dataChecks = calcDataChecks(profile);
                view.hasFullData = calcHasFullData(view.dataChecks);
                view.isAuthenticated = isAuthenticated;
                view.kpiCards = calcDataKpi(profile, cast);
                view.lastDayCalories = calcCalories(profile);
                view.profile = profile;
                view.useImperial = profile?.measureSystem === SYSTEM.IMPERIAL;

                const {content: body} = await srvRender.perform({
                    name: 'account/dashboard.html',
                    localePkg: DEF.SHARED.LOCALE,
                    view,
                    req,
                    trx,
                });
                if (body) {
                    respond.code200_Ok({res, body});
                    return true;
                }
            });
        };

    }
}

// CLASSES
/**
 * DTO class for the template variables.
 * @memberOf Svelters_Back_Web_Handler_A_Account_A_Dashboard
 */
class DtoVar {
    /** @type {boolean} */
    canSubscribe;
    /** @type {DtoDataChecks} */
    dataChecks = new DtoDataChecks();
    /** @type {boolean} */
    hasFullData;
    /** @type {boolean} */
    isAuthenticated;
    /** @type {DtoKpiCards} */
    kpiCards = new DtoKpiCards();
    /** @type {Svelters_Shared_Dto_Calorie_Log.Dto[]} */
    lastDayCalories = [];
    /** @type {Svelters_Shared_Dto_User_Profile.Dto} */
    profile;
}

/**
 * DTO class for the data checks.
 * @memberOf Svelters_Back_Web_Handler_A_Account_A_Dashboard
 */
class DtoDataChecks {
    /** @type {boolean} */
    noCalories = true;
    /** @type {boolean} */
    noGoal = true;
    /** @type {boolean} */
    noProfile = true;
    /** @type {boolean} */
    noWeight = true;

}

/**
 * DTO class for KPI card values on the dashboard.
 * Includes derived and profile-based health indicators.
 *
 * @memberOf Svelters_Back_Web_Handler_A_Account_A_Dashboard
 */
class DtoKpiCards {
    /** @type {number|null} */
    currentWeight = null;

    /** @type {number|null} */
    currentWeightLbs = null;

    /** @type {number|null} */
    goalWeight = null;

    /** @type {number|null} */
    goalWeightLbs = null;

    /** @type {boolean|null} */
    isPositive = null;

    /** @type {number|null} */
    remaining = null;

    /** @type {number|null} */
    remainingLbs = null;

    /** @type {number|null} */
    bmr = null;

    /** @type {string|null} */
    lastCaloriesDate = null;

    /** @type {number|null} */
    lastCaloriesTotal = null;
}
