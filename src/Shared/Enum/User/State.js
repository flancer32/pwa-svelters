/**
 * Enumeration for user states in the application.
 * Defines possible statuses of user accounts.
 */
const Svelters_Shared_Enum_User_State = {
    ACTIVE: 'ACTIVE',         // Active user
    DELETING: 'DELETING',     // User is in the deletion process
    LOCKED: 'LOCKED',         // User is locked, cannot interact, but data remains
};
export default Svelters_Shared_Enum_User_State;