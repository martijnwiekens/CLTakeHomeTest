import React from "react";

import Header from "../components/header";

// Import CSS files
import "../styles/main.css";
import NotificationManager from "../components/notificationmanager";

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
