import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

if (!PUBLISHABLE_KEY) {
    root.render(
        <div style={{ padding: "20px", color: "red", fontFamily: "sans-serif" }}>
            <h2>Missing Clerk Publishable Key</h2>
            <p>Please add <code>VITE_CLERK_PUBLISHABLE_KEY</code> to your <code>frontend/.env</code> file and restart the dev server.</p>
        </div>
    );
} else {
    root.render(
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <App />
        </ClerkProvider>
    );
}
