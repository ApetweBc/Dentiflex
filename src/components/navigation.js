import Link from 'next/link';

export default function Navigation() {
    return (
        <>
        <header className="p-4 text-center text-white bg-gray-800">
        <h1 className="text-2xl">Dental 3D</h1>
    </header>
        <nav className="flex p-2 bg-gray-800 text-white  text-[14px]">
            <Link href="/">
                <span className="px-2 py-1 mx-2 cursor-pointer hover:text-gray-400 active:text-yellow-600">Home</span>
            </Link>
            <Link href="/viewer">
                <span className="px-2 py-1 mx-2 cursor-pointer hover:text-gray-400 active:text-yellow-600">Viewer</span>
            </Link>
            <Link href="/settings">
                <span className="px-2 py-1 mx-2 cursor-pointer hover:text-gray-400 active:text-yellow-600">Settings</span>
            </Link>
        </nav>
        </>
    );
}
