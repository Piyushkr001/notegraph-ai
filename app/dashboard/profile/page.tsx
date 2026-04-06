import { UserProfile } from '@clerk/nextjs'
import React from 'react'

export const metadata = {
    title: "Profile - Notegraph AI",
    description: "Profile - Notegraph AI",
};

function Settings() {
    return (
        <div>
            <div className="flex flex-1 flex-col space-y-6">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your account profile and preferences.
                        </p>
                        <div className='mt-4 p-5 flex items-center justify-center'>
                            <UserProfile routing='hash' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings