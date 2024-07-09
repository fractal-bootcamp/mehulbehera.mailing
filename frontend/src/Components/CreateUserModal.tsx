import { useEffect, useState } from "react";
import { User, List } from "./types";

const serverPath = "http://localhost:3000";



//get all the lists
async function getLists() {
    const response = await fetch(`${serverPath}/getAllLists`);
    const json = await response.json();
    return json;
}

async function createUser(user: User, lists: List[]) {

    const userName = user.name
    const userEmail = user.email
    const response = await fetch(`${serverPath}/createUser`, {
        method: "POST",
        body: JSON.stringify({ userName, userEmail, lists }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    const json = await response.json();
    return json;
}



export default function CreateUserModal({ poller, setPoller }: { poller: number, setPoller: (poller: number) => void }) {

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");

    const [unselectedLists, setUnselectedLists] = useState([]);
    const [selectedLists, setSelectedLists] = useState([]);

    useEffect(() => {
        getLists().then((data) => {
            setUnselectedLists(data);
        });
    }, []);

    function UnselectedButton(list: List) {

        return (

            <button className="btn w-52 bg-red-300" onClick={() => {
                setSelectedLists([...selectedLists, list]);
                setUnselectedLists(unselectedLists.filter((l: List) => l.id !== list.id));
            }}>
                {list.name}
                <img src="plus.png" className="w-8 mt-1 h-8" />
            </button>
        )


    }

    function SelectedButton(list: List) {
        return (

            <button className="btn w-52 bg-green-300" onClick={() => {
                setSelectedLists(selectedLists.filter((l: List) => l.id !== list.id));
                setUnselectedLists([...unselectedLists, list]);
            }}>
                {list.name}
                <img src="smallMinus.png" className="w-8 mt-1 h-8" />
            </button>
        )
    }

    return (
        <dialog id="createUserModal" className="modal">
            <div className="modal-box w-11/12 max-w-5xl h-1/2 mx-auto my-auto">
                <h3 className="font-bold text-lg mb-4">Create New User</h3>
                <form>
                    <div className="flex flex-row mt-4">
                        <label className="mr-4 mt-1 w-40">User Name: </label>
                        <input type="text" placeholder="User Name" className="input input-bordered input-sm w-full" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div className="flex flex-row my-4">
                        <label className="mr-4 mt-1 w-40">User Email: </label>
                        <input type="text" placeholder="User Email" className="input input-bordered input-sm w-full" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                    </div>
                </form>

                <label className="mr-4 mt-8 w-40">Selected Lists: </label>
                <div className="grid grid-cols-4 mt-2 gap-2">
                    {selectedLists.map((list: List) => (
                        <SelectedButton key={list.id} id={list.id} name={list.name} users={list.users} />
                    ))}
                </div>
                <div className="divider"></div>
                <label className="mr-4 mt-1 w-40">Unselected Lists: </label>
                <div className="grid grid-cols-4 mt-2 gap-2">
                    {unselectedLists.map((list: List) => (
                        <UnselectedButton key={list.id} id={list.id} name={list.name} users={list.users} />
                    ))}
                </div>


                <div className="modal-action">
                    <button className="btn absolute right-2 bottom-2" onClick={() => {
                        const createListModal = document.getElementById("createUserModal") as HTMLDialogElement | null;
                        if (createListModal) {
                            if (userName && userEmail && selectedLists.length > 0) {
                                createUser({ id: "", name: userName, email: userEmail }, selectedLists);
                                setSelectedLists([]);
                                setUnselectedLists([]);
                                setUserName("");
                                setUserEmail("");
                                getLists().then((data) => {
                                    setUnselectedLists(data);
                                });
                                setPoller(poller + 1);
                                createListModal.close();
                            }
                            else {
                                alert("Please enter a user name, user email, and select at least one list.");
                            }

                        }



                    }}>Submit</button>
                </div>
            </div>
            <form id="createUserModalForm" method="dialog" className="modal-backdrop">
                <button onClick={() => {
                }}>close</button>
            </form>
        </dialog >

    )
}