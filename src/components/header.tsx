import Link from "next/link";
import React from "react";

export default function Header(): JSX.Element {
    return (
        <header>
            <Link href="/">
                <h1 className="text-4xl font-medium cursor-pointer">
                    TV Online
                </h1>
            </Link>
        </header>
    );
}
