import { useRouter } from "next/router";
import React, { useEffect } from "react";

let NOTIFICATION_TIMEOUT = null;

export default function NotificationManager(): JSX.Element {
    const [notification, setNotification] = React.useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        // Add a listener to the window
        window.addEventListener("TO_NOTIFICATION", handleNotification);

        return () => {
            // Remove the listener when the component is unmounted
            window.removeEventListener("TO_NOTIFICATION", handleNotification);
        };
    }, []);

    function handleNotification(event: any): void {
        // Clear the previous notification timeout
        if (NOTIFICATION_TIMEOUT) {
            clearTimeout(NOTIFICATION_TIMEOUT);
        }

        // Retrieve the data from the event
        setNotification({ text: event.detail.text, url: event.detail.url });

        // Remove the notification after a timeout
        NOTIFICATION_TIMEOUT = setTimeout(() => {
            setNotification(null);
        }, 5000);
    }

    function onClick(): void {
        // Check if we have an notification
        if (!notification) {
            return;
        }

        // Check if we have a url
        if (!notification.url) {
            // Remove the notification
            setNotification(null);
            return;
        }

        // Redirect the user to the url
        router.push(notification.url);
    }

    return (
        <div className={notification ? "" : " hidden"} onClick={onClick}>
            {notification && (
                <div className="absolute top-10 right-5 bg-slate-800 p-4 w-72 overflow-hidden rounded-md cursor-pointer flex flex-row gap-2 hover:bg-slate-900">
                    <span>{notification.text}</span>
                </div>
            )}
        </div>
    );
}
