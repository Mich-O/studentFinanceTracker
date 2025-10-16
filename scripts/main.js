console.log('main.js loading...');

import { AppState } from './state.js';
import { UI } from './ui.js';

console.log('Modules imported successfully');

class FinanceTracker {
    constructor() {
        console.log('Creating FinanceTracker instance');
        this.state = new AppState();
        this.ui = new UI(this.state);
    }

    init() {
        console.log('Initializing FinanceTracker');
        this.ui.init();
        this.initializeSampleData();
    }

    initializeSampleData() {
        if (this.state.transactions.length === 0) {
            console.log('Adding sample data');
            const sampleTransactions = [
                {
                    id: 'txn_1',
                    description: 'Lunch at cafeteria',
                    amount: -450,
                    category: 'Food',
                    date: '2025-01-15',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 'txn_2',
                    description: 'Chemistry textbook',
                    amount: -2500,
                    category: 'Books',
                    date: '2025-01-10',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 'txn_3',
                    description: 'Monthly bus pass',
                    amount: -1500,
                    category: 'Transport',
                    date: '2025-01-05',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            
            sampleTransactions.forEach(txn => this.state.addTransaction(txn));
        }
    }
}

// Global sidebar functions
window.showSidebar = function() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        console.log('Showing sidebar');
        sidebar.style.display = 'flex';
    }
}

window.hideSidebar = function() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        console.log('Hiding sidebar');
        sidebar.style.display = 'none';
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded - starting app');
    const app = new FinanceTracker();
    app.init();
});