'use client'

import { useRouter } from "next/navigation"

type OptionProps = {
    icon: React.ReactNode
    label: string
    textColor?: string
    pushTo?: string
}

export function ProfileOption({ icon, label, textColor, pushTo }: OptionProps) {
    const router = useRouter();

    return (
        <button
            className={`flex items-center w-full px-4 py-3 rounded-xl text-sm hover:opacity-80 hover:text-primary  hover:cursor-pointer transition ${textColor || 'text-gray-700'}`}
            onClick={() => {
                if (pushTo) router.push(pushTo)
            }}
        >
            <div className="mr-3">{icon}</div>
            <span>{label}</span>
        </button>
    )
}