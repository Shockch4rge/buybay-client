/// <reference types="cypress" />

import { Store } from "../../app/store";

declare namespace Cypress {
    interface Chainable<Subject = any> {
        login: (email: string, password: string) => Chainable;
        logout: () => Chainable;
    }
}

declare global {
    interface Window {
        Cypress: Cypress;
        store: Store;
    }
}