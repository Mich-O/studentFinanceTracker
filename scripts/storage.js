// Data persistence layer
const STORAGE_KEYS = {
    TRANSACTIONS: 'finance-transactions',
    SETTINGS: 'finance-settings'
};

export const storage = {
    // Transaction operations
    loadTransactions() {
        const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        return data ? JSON.parse(data) : [];
    },

    saveTransactions(transactions) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    },

    // Settings operations
    loadSettings() {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        const defaults = {
            baseCurrency: 'KES',
            monthlyBudgetLimit: 20000,
            customCategories: [],
            exchangeRates: { 
                KES: 1, 
                RWF: 12.5,
                USD: 0.0078
            }
        };
        return data ? { ...defaults, ...JSON.parse(data) } : defaults;
    },

    saveSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
};