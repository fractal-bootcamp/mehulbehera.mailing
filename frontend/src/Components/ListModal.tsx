import { useEffect, useState } from "react"
import CreateListModal from "./CreateListModal";
import CreateUserModal from "./CreateUserModal";
import DeleteUserModal from "./DeleteUserModal";

const serverPath = "http://localhost:3000";

//get all the lists
async function getLists() {
    const response = await fetch(`${serverPath}/getAllLists`);
    const json = await response.json();
    return json;
}

//delete list
async function deleteList(listId: string) {
    const response = await fetch(`${serverPath}/deleteList`, {
        method: "POST",
        body: JSON.stringify({ listId }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const json = await response.json();
    return json;
}


async function deleteUserFromList(listId: string, userId: string) {
    const response = await fetch(`${serverPath}/deleteUserFromList`, {
        method: "POST",
        body: JSON.stringify({ listId, userId }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const json = await response.json();
    return json;
}

async function addUserToList(listId: string, userId: string, userName: string, userEmail: string) {
    const response = await fetch(`${serverPath}/addUserToList`, {
        method: "POST",
        body: JSON.stringify({ listId, userId, userName, userEmail }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const json = await response.json();
    return json;
}

async function getAllUsers() {
    const response = await fetch(`${serverPath}/getAllUsers`);
    const json = await response.json();
    return json;
}

type User = {
    id: string,
    name: string,
    email: string
}

function ListModal() {

    const [lists, setLists] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [poller, setPoller] = useState(0);
    const [users, setUsers] = useState<User[]>([]);

    const refreshLists = () => {
        getLists().then((data) => {
            setLists(data);
        });
    };

    const refreshUsers = () => {
        getAllUsers().then((data) => {
            setUsers(data);
        });
    };

    useEffect(() => {
        refreshLists();
        refreshUsers();

    }, [poller]);

    const settings = editMode ? "btn btn-sm bg-gray-200 hover:bg-red-400" : "";
    const addSettings = editMode ? "btn btn-sm bg-gray-200 hover:bg-green-400" : "";
    const editButtonSettings = editMode ? "btn btn-sm bg-green-400 hover:bg-green-500" : "btn btn-sm bg-blue-400 hover:bg-blue-500";

    return (
        <>

            <dialog id="listModal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl  mx-auto my-auto">
                    <h3 className="font-bold text-lg mb-4">Mail List</h3>
                    <div className="btn flex btn-sm flex-row absolute top-1 right-1" onClick={() => {
                        const createListModal = document.getElementById("createlistModal") as HTMLDialogElement;
                        if (createListModal) {
                            createListModal.showModal();
                        }
                    }} >

                        <p>Create List</p>
                        <img src='plus.png' className="w-6 h-6 mt-1" />
                    </div>

                    <div className="btn flex btn-sm flex-row absolute top-1 right-32 mr-3" onClick={() => {
                        const createUserModal = document.getElementById("createUserModal") as HTMLDialogElement;
                        if (createUserModal) {
                            createUserModal.showModal();
                        }
                    }} >

                        <p>Create User</p>
                        <img src='plus.png' className="w-6 h-6 mt-1" />
                    </div>

                    <div className="btn flex btn-sm flex-row absolute top-1 right-60 mr-11 bg-red-400 hover:bg-red-500" onClick={() => {
                        const deleteUserModal = document.getElementById("deleteUserModal") as HTMLDialogElement;
                        if (deleteUserModal) {
                            deleteUserModal.showModal();
                        }
                    }} >

                        <p>Delete User</p>
                        <img src='trashcan.png' className="w-6 h-6 mt-1" />
                    </div>

                    {lists.map((list: { id: string, name: string, users: { userId: string, userName: string, userEmail: string }[] }) => (
                        <div className="collapse collapse-arrow bg-base-200">
                            <input type="radio" name="my-accordion-2" />
                            <div className="collapse-title text-xl font-medium">{list.name}</div>
                            <div className="collapse-content">
                                {list.users.map((user: { userId: string, userName: string, userEmail: string }) => (
                                    <div key={user.userId} className={`flex flex-row w-1/2 justify-between ${settings}`} onClick={() => {
                                        if (editMode) {
                                            deleteUserFromList(list.id, user.userId);
                                            setPoller(poller + 1);
                                        }

                                    }}>
                                        <p>{user.userName}</p>
                                        <p>{user.userEmail}</p>
                                        {editMode ? <img src="minus.png" className="w-3 mt-1 h-3 mr-1" /> : null}
                                    </div>
                                ))}

                                {editMode ? (
                                    <div>
                                        {users.map((user: User) => {
                                            const listIDs = list.users.map((user: { userId: string, userName: string, userEmail: string }) => user.userId);
                                            if (!listIDs.includes(user.id)) {
                                                return (
                                                    <div key={user.id} className={`flex flex-row w-1/2 justify-between ${addSettings}`} onClick={() => {
                                                        if (editMode) {
                                                            addUserToList(list.id, user.id, user.name, user.email)
                                                            setPoller(poller + 1);
                                                        }
                                                    }}>
                                                        <p>{user.name}</p>
                                                        <p>{user.email}</p>
                                                        {editMode ? <img src="plus.png" className="w-5 mt-1 h-5" /> : null}
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                ) : null}

                                <button className="btn btn-sm bg-red-400 hover:bg-red-500 absolute right-2 bottom-2" onClick={() => {
                                    deleteList(list.id);
                                    setPoller(poller + 1);
                                }}>Delete</button>
                                <button className={`btn btn-sm ${editButtonSettings} absolute right-20 bottom-2`} onClick={() => {
                                    setEditMode(!editMode);
                                }}>{editMode ? "Done" : "Edit List"}</button>

                            </div>
                        </div>
                    ))}
                </div>
                <form id="listModalForm" method="dialog" className="modal-backdrop">
                    <button onClick={() => {

                    }}>close</button>
                </form>
            </dialog >

            <CreateListModal poller={poller} setPoller={setPoller} />
            <CreateUserModal poller={poller} setPoller={setPoller} />
            <DeleteUserModal poller={poller} setPoller={setPoller} />
        </>
    )
}

export default ListModal;