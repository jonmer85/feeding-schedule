
const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateFeedingEventInput(data) {
    let errors = {};
    
    // Convert empty fields to an empty string so we can use validator functions
    data.amount = !isEmpty(data.amount) ? data.amount : "";
    data.fedOn = !isEmpty(data.fedOn) ? data.fedOn : "";
    
    // Amount checks
    if (validator.isEmpty(data.amount)) {
        errors.amount = "Amount is required";
    } else if (!validator.isNumeric(data.amount)) {
        errors.amount = "Amount is invalid";
    }
    // FedOn checks
    if (validator.isEmpty(data.fedOn)) {
        errors.fedOn = "FedOn field is required";
    } else if (!validator.isISO8601(data.fedOn) || (!validator.isLength(data.fedOn, { min: 20 }))) {
        errors.fedOn = "FedOn field is invalid";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};