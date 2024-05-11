import React from "react";

import Header from "../components/header";
import NotificationManager from "../components/notificationmanager";

// Setup Amplify
import { Amplify } from "aws-amplify";
Amplify.configure({
    API: {
        GraphQL: {
            endpoint: process.env.NEXT_PUBLIC_APPSYNC_API_URL,
            defaultAuthMode: "apiKey",
            apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY,
            region: "us-east-1", // Optional
        },
    },
});

// Import CSS files
import "../styles/main.css";

/** The Main App for the application
 * Layout will be shown in every page
 * */
export default function App({ Component, pageProps }): JSX.Element {
    return (
        <div className="grid gap-4 m-10">
            <Header />
            <NotificationManager />
            <div className="mx-auto max-w-7xl w-full rounded-lg bg-slate-500 p-4">
                <Component {...pageProps} />
            </div>
        </div>
    );
}
