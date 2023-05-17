/**
 *  Implementation of the mole component of '@flancer32/teq-ant-auth' plugin.
 *
 * @implements Fl32_Auth_Back_Api_Mole
 */
export default class Svelters_Back_Mole_Auth {

    constructor(spec) {
        // DEPS
        /** @type {Svelters_Back_Act_User_Read.act|function} */
        const actUserRead = spec['Svelters_Back_Act_User_Read$'];
        /** @type {Svelters_Shared_Dto_User} */
        const dtoUser = spec['Svelters_Shared_Dto_User$'];

        /**
         * @inheritDoc
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {number} userBid
         * @returns {Promise<{sessionData: Object}>}
         */
        this.sessionDataRead = async function ({trx, userBid}) {
            const {
                /** @type {Svelters_Back_RDb_Schema_User.Dto} */
                user
            } = await actUserRead({trx, userBid});
            const sessionData = dtoUser.createDto();
            sessionData.dateBirth = user.date_birth;
            sessionData.dateRegistered = user.date_created;
            sessionData.email = user.email;
            sessionData.height = user.height;
            sessionData.name = user.name;
            sessionData.uuid = user.uuid;
            return {sessionData};
        };

        /**
         * @inheritDoc
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {string} userRef
         * @returns @returns {Promise<{userBid:number, user: Object}>}
         */
        this.userRead = async function ({trx, userRef: email}) {
            const {
                /** @type {Svelters_Back_RDb_Schema_User.Dto} */
                user
            } = await actUserRead({trx, email});
            return {userBid: user?.bid, user};
        };
    }
}
