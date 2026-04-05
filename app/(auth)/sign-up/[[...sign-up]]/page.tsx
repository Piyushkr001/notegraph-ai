import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
    return (
        <div className='min-h-screen grid grid-cols-1 md:grid-cols-2 bg-linear-to-b from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20'>
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center md:px-10 lg:px-16">
                <Image
                    src="/Images/SignIn.svg"
                    alt="NoteGraph AI"
                    width={160}
                    height={40}
                    className="h-18 w-auto"
                />
                <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                    Welcome to{" "}
                    <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-500">
                        NoteGraph AI
                    </span>
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Your personal AI assistant for note-taking and knowledge management.
                </p>
            </div>
            <div className="order-first flex items-center justify-center px-4 py-8 md:order-last md:px-8 md:py-12">
                <div className="w-full max-w-md rounded-2xl border border-border/50 bg-background/80 p-4 shadow-xl backdrop-blur-md sm:p-6">
                    <SignUp />
                </div>
            </div>
        </div>
    )
}