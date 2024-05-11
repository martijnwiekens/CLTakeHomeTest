import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document(): JSX.Element {
    return (
        <Html lang="en" className="bg-slate-700 text-white">
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
