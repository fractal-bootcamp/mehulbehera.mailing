import axios from "axios";
import { useEffect, useState } from "react";
import { EmailBlast } from "./types";
const serverPath = "http://localhost:3000";

async function getEmailBlasts() {

    const response = await fetch(`${serverPath}/getEmailBlasts`);
    const json = await response.json();
    return json;

}

function Dashboard() {

    const [emailBlasts, setEmailBlasts] = useState<EmailBlast[]>([]);

    useEffect(() => {
        getEmailBlasts().then((data) => {
            console.log(data)
            setEmailBlasts(data);
        });
    }, []);

    return (
        <div className="flex flex-col items-center mt-10 h-screen ">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <button onClick={() => {
                axios.get(`${serverPath}/getStats`);
            }}>Get Stats</button>

            <div className="stats stats-vertical lg:stats-horizontal shadow">
                <div className="stat">
                    <div className="stat-title">Emails Sent</div>
                    <div className="stat-value">{emailBlasts.length}</div>
                    <div className="stat-desc">Jan 1st - Feb 1st</div>
                </div>

                <div className="stat">
                    <div className="stat-title">New Recipients</div>
                    <div className="stat-value">4,200</div>
                    <div className="stat-desc">↗︎ 400 (22%)</div>
                </div>

                <div className="stat">
                    <div className="stat-title">Emails Clicked</div>
                    <div className="stat-value">1,200</div>
                    <div className="stat-desc">↘︎ 90 (14%)</div>
                </div>
            </div>

            <div className="flex flex-col items-center mt-10 ">
                <h1 className="text-4xl font-bold">Recent Email Blasts</h1>

                {emailBlasts.map((emailBlast) => (
                    <div className="flex flex-col items-center mt-4 ">
                        <h2 className="text-2xl font-bold mt-4">{emailBlast.list.name}</h2>
                        <label className="text-lg font-bold mt-4">Subject: {emailBlast.subject}</label>
                        <textarea className="textarea  mt-4 textarea-bordered textarea-lg w-full  disabled:text-black" placeholder="Bio" disabled>{emailBlast.message}</textarea>
                        <div className="overflow-x-auto w-full mt-4">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Recipient Name</th>
                                        <th>Recipient Email</th>
                                        <th>Sent On</th>
                                        <th>Sent At</th>
                                    </tr>
                                </thead>

                                {emailBlast.list.users.map((user, index) => (

                                    <tbody>
                                        {/* row 1 */}
                                        <tr>
                                            <th>{index + 1}</th>
                                            <td>{user.userName}</td>
                                            <td>{user.userEmail}</td>
                                            <td>{emailBlast.createdAt.substring(0, 10)}</td>
                                            <td>{emailBlast.createdAt.substring(11, 16)}</td>

                                        </tr>
                                    </tbody>

                                ))}

                            </table>
                        </div>
                    </div>
                ))}


            </div>

        </div>

    );
}

export default Dashboard;