import { Store } from "../../app/store";

declare global {
    interface Window {
        store: Store;
    }
}