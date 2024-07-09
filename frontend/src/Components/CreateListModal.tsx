import { useState, useEffect } from "react";


const serverPath = "http://localhost:3000";


//get all the lists
async function getUsers() {
    const response = await fetch(`${serverPath}/getAllUsers`);
    const json = await response.json();
    return json;
}

//create a list
async function createList(listName: string, selectedUsers: string[]) {
    const response = await fetch(`${serverPath}/createList`, {
        method: "POST",
        body: JSON.stringify({ listName, selectedUsers }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const json = await response.json();
    return json;
}




export default function CreateListModal({ poller, setPoller }: { poller: number, setPoller: (poller: number) => void }) {

    const [listName, setListName] = useState("");
    const [unselectedUsers, setUnselectedUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        getUsers().then((data) => {
            console.log(data);
            setUnselectedUsers(data);
        });
    }, []);

    function UnselectedUserButton(user: { id: string, name: string, email: string }) {

        return (

            <button className="btn w-32 bg-red-300" onClick={() => {
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

            <button className="btn w-32 bg-green-300" onClick={() => {
                setSelectedUsers(selectedUsers.filter((u: { id: string, name: string, email: string }) => u.id !== user.id));
                setUnselectedUsers([...unselectedUsers, user]);
            }}>
                {user.name}
                <img src="smallMinus.png" className="w-8 mt-1 h-8" />
            </button>
        )
    }

    return (
        <dialog id="createlistModal" className="modal">
            <div className="modal-box w-11/12 max-w-5xl h-1/2 mx-auto my-auto">
                <h3 className="font-bold text-lg mb-4">Create List</h3>
                <form>
                    <div className="flex flex-row mt-4">
                        <label className="mr-4 mt-1 w-40">List Name: </label>
                        <input type="text" placeholder="List Name" className="input input-bordered input-sm w-full" value={listName} onChange={(e) => setListName(e.target.value)} />
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
                        const createListModal = document.getElementById("createlistModal") as HTMLDialogElement | null;
                        if (createListModal && listName !== "") {
                            createList(listName, selectedUsers);
                            setListName("");
                            getUsers().then((data) => {
                                setUnselectedUsers(data);
                            });
                            setSelectedUsers([]);
                            setPoller(poller + 1);
                            createListModal.close();

                        }



                    }}>Submit</button>
                </div>
            </div>
            <form id="createListModalForm" method="dialog" className="modal-backdrop">
                <button onClick={() => {
                    setListName("");
                    getUsers().then((data) => {
                        setUnselectedUsers(data);
                    });
                    setSelectedUsers([]);
                }}>close</button>
            </form>
        </dialog >
    )
}
