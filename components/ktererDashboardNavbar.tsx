import Link from 'next/link';

export default function KtererDashboardNavbar() {
    const buttons = [
        {name: 'Help', href: '/help'},
        {name: 'Dashboard', href: '/kterer/dashboard'},
        {name: 'Earnings', href: '/logout'},
        {name: 'Post Food', href: '/kterer/post'},
    ];

    return (
        <div className="border-b border-gray-200 bg-primary-color">
            <div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center sm:justify-between justify-end">
                <h3 className="hidden sm:block text-base font-semibold leading-6 text-white">Kterer Menu</h3>
                <div className="flex sm:ml-4 sm:mt-0">
                    {buttons.map((button, index) => (
                        <Link key={index} href={button.href}>
                            <div
                                className={`ml-3 inline-flex items-center text-sm rounded-full px-3 md:px-4 py-2 font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color ${
                                    button.name === 'Post Food'
                                        ? 'bg-black text-white hover:bg-slate-900'
                                        : button.name === 'Help'
                                            ? 'text-white hover:text-gray-50'
                                            : 'bg-white text-primary-color hover:bg-gray-50'
                                }`}
                            >
                                {button.name}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
