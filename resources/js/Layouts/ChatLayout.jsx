import {usePage} from "@inertiajs/react";
import {useEffect, useState} from "react";
import ConversationItem from "@/Components/App/ConversationItem.jsx";
import TextInput from "@/Components/TextInput.jsx";
import {PencilSquareIcon} from "@heroicons/react/24/solid/index.js";
import {useEventBut} from "@/EventBus.jsx";

export default function ChatLayout({children}) {
    const page = usePage()
    const conversations = page.props.conversations
    const selectedConversation = page.props.selectedConversation
    const [localConversations, setLocalConversations] = useState([])
    const [sortedConversations, setSortedConversations] = useState([])
    const [onlineUsers, setOnlineUsers] = useState({})
    const {on} = useEventBut()

    const isUserOnline = (userId) => onlineUsers[userId]

    const onSearch = (ev) => {
        const search = ev.target.value.toLowerCase()
        setLocalConversations(
            conversations.filter((conversation) => {
                return (
                    conversation.name.toLowerCase().includes(search)
                )
            })
        )
    }

    const messageCreated = (message) => {
        setLocalConversations((oldUsers) => {
            return oldUsers.map((u) => {
                if (message.receiver_id && !u.is_group &&
                    (u.id == message.sender_id || u.id == message.receiver_id)) {
                    u.last_message = message.message
                    u.last_message_date = message.created_at
                    return u
                }
                if (message.group_id && u.is_group && u.id == message.group_id) {
                    u.last_message = message.message
                    u.last_message_date = message.created_at
                    return u
                }
                return u
            })
        })
    }

    useEffect(() => {
        const offCreated = on("message.created", messageCreated)
        return () => {
            offCreated()
        }
    }, [on]);

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((user1, user2) => {
                if (user1.blocked_at && user2.blocked_at) {
                    return user1.blocked_at > user2.blocked_at ? 1 : -1
                } else if (user1.blocked_at) {
                    return 1
                } else if (user2.blocked_at) {
                    return -1
                }
                if (user1.last_message_date && user2.last_message_date) {
                    return user2.last_message_date.localeCompare(
                        user1.last_message_date
                    )
                } else if (user1.last_message_date) {
                    return -1
                } else if (user2.last_message_date) {
                    return 1
                } else {
                    return 0
                }
            })
        )
    }, [localConversations])

    useEffect(() => {
        setLocalConversations(conversations)
    }, [conversations]);

    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                )
                setOnlineUsers((prevOnlineUsers) => {
                    return {...prevOnlineUsers, ...onlineUsersObj}
                })
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = {...prevOnlineUsers}
                    updatedUsers[user.id] = user
                    return updatedUsers
                })
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = {...prevOnlineUsers}
                    delete updatedUsers[user.id]
                    return updatedUsers
                })
            })
            .error((error) => {
                console.log('error', error)
            })
    }, []);
    return (

        < >
            <div className="flex-1 w-full flex overflow-hidden">
                <div className={`transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800
                flex flex-col overflow-hidden ${
                    selectedConversation ? '-ml-[100%] sm:ml-0' : ''
                }`}>
                    <div className="flex items-center justify-between py-2 px-3 text-xl
                        font-medium text-gray-200">
                        My Conversations
                        <div className="tooltip tooltip-left"
                             data-tip="Create new group">
                            <button className="text-gray-400 hover:text-gray-200">
                                <PencilSquareIcon className="w-4 h-4 inline-block ml-2"/>
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <TextInput onKeyUp={onSearch}
                                   placeholder="Filter users and groups" className="w-full"/>
                    </div>
                    <div className="flex-1 overflow-auto">
                        {sortedConversations &&
                            sortedConversations.map((conversation) => (
                                <ConversationItem
                                    key={`${
                                        conversation.is_group
                                            ? "group_"
                                            : "user_"
                                    }${conversation.id}`}
                                    conversation={conversation}
                                    online={!!isUserOnline(conversation.id)}
                                    selectedConversation={selectedConversation}
                                />
                            ))
                        }
                    </div>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </div>
            </div>
        </ >
    )
}
