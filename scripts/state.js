import { storage } from './storage.js';
import { validators } from './validator.js';

// Business logic and application state
export class AppState {
    constructor() {
        this.transactions = storage.loadTransactions();
        this.settings = storage.loadSettings();
        this.editingId = null;
        this.currentSort = 'date-desc';
        this.currentSearch = '';
    }

    // Transaction operations
    addTransaction(transaction) {
        const newTransaction = {
            ...transaction,
            id: 'txn_' + Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.transactions.unshift(newTransaction);
        this.save();
        return newTransaction;
    }

    updateTransaction(id, updates) {
        const index = this.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            this.transactions[index] = {
                ...this.transactions[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.save();
            return this.transactions[index];
        }
        return null;
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.save();
    }

    // Search and filtering
    searchTransactions(query) {
        if (!query.trim()) {
            this.currentSearch = '';
            return this.transactions;
        }

        const regex = validators.safeRegexCompile(query);
        if (!regex) return this.transactions;

        this.currentSearch = query;
        return this.transactions.filter(transaction => 
            regex.test(transaction.description) || 
            regex.test(transaction.category) ||
            regex.test(transaction.amount.toString())
        );
    }

    // Sorting
    sortTransactions(transactions, sortType) {
        this.currentSort = sortType;
        const [field, order] = sortType.split('-');
        
        return [...transactions].sort((a, b) => {
            let comparison = 0;
            switch (field) {
                case 'date': comparison = new Date(a.date) - new Date(b.date); break;
                case 'amount': comparison = a.amount - b.amount; break;
                case 'description': comparison = a.description.localeCompare(b.description); break;
                case 'category': comparison = a.category.localeCompare(b.category); break;
            }
            return order === 'desc' ? -comparison : comparison;
        });
    }

    // Budget calculations
    calculateBudgetStats() {
        const totalExpenses = this.transactions.reduce((sum, t) => sum + t.amount, 0);
        const monthlyBudget = this.settings.monthlyBudgetLimit || 0;
        const remaining = monthlyBudget + totalExpenses;
        
        const categoryTotals = {};
        this.transactions.forEach(t => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
        });
        
        const topCategory = Object.keys(categoryTotals).length > 0 
            ? Object.keys(categoryTotals).reduce((a, b) => 
                categoryTotals[a] > categoryTotals[b] ? a : b)
            : 'None';

        return { totalExpenses, monthlyBudget, remaining, topCategory };
    }

    // Currency formatting with conversion
    formatCurrency(amount) {
        const symbols = { KES: 'Ksh', RWF: 'RWF', USD: '$' };
        const symbol = symbols[this.settings.baseCurrency] || 'Ksh';
        
        // Get the absolute amount for display
        const absoluteAmount = Math.abs(amount);
        
        // If base currency is KES, just format the amount
        if (this.settings.baseCurrency === 'KES') {
            return `${symbol} ${absoluteAmount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        
        // For other currencies, convert from KES using the exchange rates
        const exchangeRate = this.settings.exchangeRates[this.settings.baseCurrency];
        if (!exchangeRate) {
            return `${symbol} ${absoluteAmount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        
        // Convert the amount (amount is stored in KES, so multiply by target currency rate)
        const convertedAmount = absoluteAmount * exchangeRate;
        
        if (this.settings.baseCurrency === 'USD') {
            return `$${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else {
            return `${symbol} ${convertedAmount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    }

    // Settings management
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.save();
    }

    // Persistence
    save() {
        storage.saveTransactions(this.transactions);
        storage.saveSettings(this.settings);
    }
}