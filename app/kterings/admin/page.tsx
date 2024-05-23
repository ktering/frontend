"use client";

import {useEffect, useState} from "react";
import {format} from "date-fns";
import {useUser} from "@clerk/nextjs";

export default function Admin() {

    const [unverifiedK, setUnverifiedK] = useState<any[]>();
    const [verifiedK, setVerifiedK] = useState<any[]>();
    const [rejectedK, setRejectedK] = useState<any[]>();

    const {user} = useUser();

    const [allowed, setAllowed] = useState<boolean>(false);

    const fetchUnverifiedKterers = async () => {
        const accessToken = localStorage.getItem("accessToken");
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        let response = await fetch(`${apiURL}/api/unverified-kterer`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
            return;
        }

        let data = await response.json();

        let unverifiedKterers = data.kterers.filter((kterer: any) => kterer.admin_verified === 0);
        let verifiedKterers = data.kterers.filter((kterer: any) => kterer.admin_verified === 1);
        let rejectedKterers = data.kterers.filter((kterer: any) => kterer.admin_verified === -1);

        setUnverifiedK(unverifiedKterers);
        setVerifiedK(verifiedKterers);
        setRejectedK(rejectedKterers);
    }

    useEffect(() => {
        const getKtererAccountInfo = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const response = await fetch(`${apiURL}/api/user`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    console.error(`Error: ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                if (data.user.email === 'info@kterings.com') {
                    setAllowed(true);
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };
        getKtererAccountInfo();
        fetchUnverifiedKterers();
    }, []);

    const approve = async (id: string) => {
        const accessToken = localStorage.getItem("accessToken");
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        let response = await fetch(`${apiURL}/api/kterer/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({id: id, admin_verified: 1}),
        });

        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
            return;
        }

        fetchUnverifiedKterers();
    }

    const reject = async (id: string) => {
        const accessToken = localStorage.getItem("accessToken");
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        let response = await fetch(`${apiURL}/api/kterer/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({id: id, admin_verified: -1}),
        });

        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
            return;
        }

        fetchUnverifiedKterers();
    }

    if (!allowed) {
        return <div>Unauthorized</div>
    }

    return (
        <div className="p-10 gap-y-10 flex flex-col">

            <div className="w-full flex mb-10 justify-between items-center">
                <h1 className="text-2xl">Hi <span className="text-red-600 font-semibold">Admin</span>!</h1>
                <div className="flex items-center gap-2">
                    <p>Applications: <span
                        className="text-red-500">{(unverifiedK?.length ?? 0) + (verifiedK?.length ?? 0) + (rejectedK?.length ?? 0)}</span>
                    </p>
                    <p>Pending: <span className="text-red-500">{unverifiedK?.length}</span></p>
                    <p>Approved: <span className="text-red-500">{verifiedK?.length}</span></p>
                    <p>Denied: <span className="text-red-500">{rejectedK?.length}</span></p>
                </div>
            </div>

            <div>
                <h2 className="mb-5 text-xl font-semibold">Pending</h2>
                {unverifiedK?.length === 0 && <p>No pending Kterers</p>}
                {unverifiedK?.length !== 0 && <table className="w-full">
                    <thead className="text-left">
                    <tr>
                        <th className="w-1/5">Date Applied</th>
                        <th className="w-2/5">Kterer</th>
                        <th className="w-1/5">Ethnicity</th>
                        <th className="w-1/5"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {unverifiedK?.map((kterer) => (
                        <tr key={kterer.created_at}>
                            <td>{format(new Date(kterer.created_at), "yyyy-MM-dd")}</td>
                            <td>{kterer.first_name + kterer.last_name}</td>
                            <td>{kterer.ethnicity}</td>
                            <td>
                                <button className="p-2 mr-2 bg-green-600 text-white disabled:bg-gray-400 rounded-md"
                                        onClick={() => approve(kterer.id)}>Approved
                                </button>
                                <button className="p-2 bg-red-600 text-white disabled:bg-gray-400 rounded-md"
                                        onClick={() => reject(kterer.id)}>Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                }
            </div>


            <div>
                <h2 className="mb-5 text-xl font-semibold">Approved</h2>
                {verifiedK?.length === 0 && <p>No approved Kterers</p>}
                {verifiedK?.length !== 0 && <table className="w-full">
                    <thead className="text-left">
                    <tr className="w-full">
                        <th className="w-1/5">Date Applied</th>
                        <th className="w-2/5">Kterer</th>
                        <th className="w-1/5">Ethnicity</th>
                        <th className="w-1/5"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {verifiedK?.map((kterer) => (
                        <tr key={kterer.created_at}>
                            <td>{format(new Date(kterer.created_at), "yyyy-MM-dd")}</td>
                            <td>{kterer.first_name + kterer.last_name}</td>
                            <td>{kterer.ethnicity}</td>
                            <td>
                                <button className="p-2 mr-2 bg-green-600 text-white disabled:bg-gray-400 rounded-md"
                                        onClick={() => approve(kterer.id)} disabled>Approved
                                </button>
                                <button className="p-2 bg-red-600 text-white disabled:bg-gray-400 rounded-md"
                                        onClick={() => reject(kterer.id)}>Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                }
            </div>

            <div>
                <h2 className="mb-5 text-xl font-semibold">Denied</h2>
                {rejectedK?.length === 0 && <p>No denied Kterers</p>}
                {rejectedK?.length !== 0 &&
                    <table className="w-full">
                        <thead className="text-left">
                        <tr>
                            <th className="w-1/5">Date Applied</th>
                            <th className="w-2/5">Kterer</th>
                            <th className="w-1/5">Ethnicity</th>
                            <th className="w-1/5"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {rejectedK?.map((kterer) => (
                            <tr key={kterer.created_at}>
                                <td>{format(new Date(kterer.created_at), "yyyy-MM-dd")}</td>
                                <td>{kterer.first_name + kterer.last_name}</td>
                                <td>{kterer.ethnicity}</td>
                                <td>
                                    <button className="p-2 mr-2 bg-green-600 text-white disabled:bg-gray-400 rounded-md"
                                            onClick={() => approve(kterer.id)}>Approved
                                    </button>
                                    <button className="p-2 bg-red-600 text-white disabled:bg-gray-400 rounded-md"
                                            onClick={() => reject(kterer.id)} disabled>Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}
