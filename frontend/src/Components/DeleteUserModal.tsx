import { useState, useEffect } from "react";
import { User } from "./types";


const serverPath = "http://localhost:3000";


//get all the Users
async function getUsers() {
    const response = await fetch(`${serverPath}/getAllUsers`);
    const json = await response.json();
    return json;
}

async function deleteUsers(users: User[]) {
    const response = await fetch(`${serverPath}/deleteUsers`, {
        method: "POST",
        body: JSON.stringify({ users }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const json = await response.json();
    return json;
}

export default function DeleteUserModal({ poller, setPoller }: { poller: number, setPoller: (poller: number) => void }) {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [unselectedUsers, setUnselectedUsers] = useState<User[]>([]);

    useEffect(() => {
        getUsers().then((data) => {
            setUnselectedUsers(data);
        });
    }, []);


    function UnselectedUserButton(user: { id: string, name: string, email: string }) {

        return (

            <button className="btn w-32 bg-blue-400" onClick={() => {
                setSelectedUsers([...selectedUsers, user]);
                setUnselectedUsers(unselectedUsers.filter((u: { id: string, name: string, email: string }) => u.id !== user.id));
            }}>
                {user.name}
                <img src="plus.png" className="w-8 mt-1 h-8" />
            </button>
        )


    }

    function SelectedUserButton(user: { id: string, name: string, email: string }) {
        return (

            <button className="btn w-32 bg-red-400" onClick={() => {
                setSelectedUsers(selectedUsers.filter((u: { id: string, name: string, email: string }) => u.id !== user.id));
                setUnselectedUsers([...unselectedUsers, user]);
            }}>
                {user.name}
                <img src="trashcan.png" className="w-8 mt-1 h-8" />
            </button>
        )
    }



    return (
        <dialog id="deleteUserModal" className="modal">
            <div className="modal-box w-11/12 max-w-5xl h-1/2 mx-auto my-auto">
                <h3 className="font-bold text-lg mb-4">Delete Users</h3>
                <form>
                    <div className="flex flex-row mt-4">
                        <label className="mr-4 mt-1 w-40">Pick Users to Delete: </label>
                    </div>
                </form>
                <label className="mr-4 mt-8 w-40">Selected Users: </label>
                <div className="grid grid-cols-6 mt-2 gap-2">
                    {selectedUsers.map((user: { id: string, name: string, email: string }) => (
                        <SelectedUserButton key={user.id} id={user.id} name={user.name} email={user.email} />
                    ))}
                </div>
                <div className="divider"></div>
                <label className="mr-4 mt-1 w-40">Unselected Users: </label>
                <div className="grid grid-cols-6 mt-2 gap-2">
                    {unselectedUsers.map((user: { id: string, name: string, email: string }) => (
                        <UnselectedUserButton key={user.id} id={user.id} name={user.name} email={user.email} />
                    ))}
                </div>
                <div className="modal-action">
                    <button className="btn absolute right-2 bottom-2" onClick={() => {
                        const deleteUserModal = document.getElementById("deleteUserModal") as HTMLDialogElement | null;
                        if (deleteUserModal) {
                            deleteUsers(selectedUsers);
                            getUsers().then((data) => {
                                setUnselectedUsers(data);
                            });
                            setSelectedUsers([]);
                            setPoller(poller + 1);
                            deleteUserModal.close();

                        }

                    }}>Submit</button>
                </div>
            </div>
            <form id="deleteUserModalForm" method="dialog" className="modal-backdrop">
                <button onClick={() => {

                    getUsers().then((data) => {
                        setUnselectedUsers(data);
                    });
                    setSelectedUsers([]);
                }}>close</button>
            </form>
        </dialog >
    )
}