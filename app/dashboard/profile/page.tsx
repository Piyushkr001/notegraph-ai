import { UserProfile } from '@clerk/nextjs'
import React from 'react'

export const metadata = {
    title: "Profile - Notegraph AI",
    description: "Profile - Notegraph AI",
};

function Settings() {
    return (
        <div className="flex flex-1 flex-col space-y-8">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mix-blend-normal">
                        Profile.
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        Manage your account profile and core preferences.
                    </p>
                </div>
            </div>
            
            <div className='flex items-center justify-center'>
                <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-gray-900/40 backdrop-blur-3xl shadow-xl overflow-hidden p-4 md:p-8 relative">
                    <div className="absolute inset-0 bg-linear-to-b from-indigo-500/5 to-purple-500/5 opacity-50 pointer-events-none" />
                    <div className="relative z-10 w-full max-w-full">
                        <UserProfile routing='hash' appearance={{
                            elements: {
                                cardBox: "shadow-none border-0",
                                rootBox: "w-full mx-auto"
                            }
                        }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings