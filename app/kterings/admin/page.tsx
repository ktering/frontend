"use client";

import {useEffect, useState} from "react";
import {format} from "date-fns";

export default function Admin() {

    const [unverifiedK, setUnverifiedK] = useState<any[]>();
    const [verifiedK, setVerifiedK] = useState<any[]>();
    const [rejectedK, setRejectedK] = useState<any[]>();

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

    return (
        <div className="p-10 gap-y-10 flex flex-col">
            <h1 className="text-2xl mb-10">Hi <span className="text-red-600">Admin</span>!</h1>

            <div>
                <h2 className="mb-5 text-xl font-semibold">Pending</h2>
                {unverifiedK?.length === 0 && <p>No pending Kterers</p>}
                {unverifiedK?.length !== 0 && <table className="w-full">
                    <thead className="text-left">
                    <tr>
                        <th>Date Applied</th>
                        <th>Kterer</th>
                        <th>Ethnicity</th>
                        <th></th>
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
                    <tr>
                        <th>Date Applied</th>
                        <th>Kterer</th>
                        <th>Ethnicity</th>
                        <th></th>
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
                            <th>Date Applied</th>
                            <th>Kterer</th>
                            <th>Ethnicity</th>
                            <th></th>
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
