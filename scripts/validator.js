// Validation and utility functions
export const validators = {
    // Regex validation functions
    validateDescription(description) {
        const regex = /^\S(?:.*\S)?$/;
        return regex.test(description);
    },

    validateAmount(amount) {
        const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
        return regex.test(amount.toString());
    },

    validateDate(date) {
        const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if (!regex.test(date)) return false;
        const dateObj = new Date(date);
        return dateObj instanceof Date && !isNaN(dateObj);
    },

    validateCategory(category) {
        const regex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
        return regex.test(category);
    },

    // Advanced regex: Detect duplicate words
    findDuplicateWords(text) {
        const regex = /\b(\w+)\s+\1\b/gi;
        return text.match(regex);
    },

    // Safe regex compilation
    safeRegexCompile(pattern, flags = 'i') {
        try {
            const cleanPattern = pattern.replace(/^\/|\/$/g, '');
            return new RegExp(cleanPattern, flags);
        } catch (error) {
            console.warn('Invalid regex pattern:', pattern);
            return null;
        }
    },

    // Exchange rate validation
    validateExchangeRate(rate) {
        return rate && !isNaN(rate) && rate > 0;
    }
};