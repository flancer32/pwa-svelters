/**
 * Helper functions for unit conversions between metric and imperial systems.
 */
export default class Svelters_Shared_Helper_Measure {
    /**
     * @param {object} deps
     * @param {typeof Svelters_Shared_Enum_Product_Measure_Type} MEASURE
     */
    constructor({Svelters_Shared_Enum_Product_Measure_Type$: MEASURE}) {
        /**
         * Convert grams to ounces (rounded to 1 decimal place).
         * @param {number} grams
         * @returns {number}
         */
        this.gramsToOunces = function (grams) {
            return +(grams / 28.35).toFixed(1);
        };

        /**
         * Get a localized symbol for the given unit of measure.
         * @param {string} measure
         * @returns {string}
         */
        this.getUnitSymbol = function (measure) {
            switch (measure) {
                case MEASURE.CUPS:
                    return 'cups';
                case MEASURE.FLUID_OUNCES:
                    return 'fl oz';
                case MEASURE.GRAMS:
                    return 'g';
                case MEASURE.MILLILITERS:
                    return 'ml';
                case MEASURE.OUNCES:
                    return 'oz';
                case MEASURE.PIECES:
                    return 'pcs';
                case MEASURE.TABLESPOONS:
                    return 'tbsp';
                case MEASURE.TEASPOONS:
                    return 'tsp';
                default:
                    return measure;
            }
        };

        /**
         * Convert kcal per 100 grams to kcal per 1 ounce (rounded to integer).
         * @param {number} kcalPer100g
         * @returns {number}
         */
        this.kcalPer100gToPerOunce = function (kcalPer100g) {
            return Math.round(kcalPer100g * 0.2835);
        };

        /**
         * Convert kcal per 100 milliliters to kcal per 1 fluid ounce (rounded to integer).
         * @param {number} kcalPer100ml
         * @returns {number}
         */
        this.kcalPer100mlToPerFluidOunce = function (kcalPer100ml) {
            return Math.round(kcalPer100ml * 0.2957);
        };

        /**
         * Convert kilograms to pounds (rounded to the nearest integer).
         * @param {number} kg
         * @returns {number}
         */
        this.kgToLbs = function (kg) {
            return Math.round(kg * 2.20462);
        };

        /**
         * Convert milliliters to fluid ounces (rounded to 1 decimal place).
         * @param {number} ml
         * @returns {number}
         */
        this.mlToFluidOunces = function (ml) {
            return +(ml / 29.57).toFixed(1);
        };
    }
}
