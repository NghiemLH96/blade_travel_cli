import { chatService } from "@/socket/chat.socket"
import { StoreType } from "@/store"
import { useSelector } from "react-redux"

export default function ChatBox() {
    //time format
    const handleDateType = (timeString: string) => {
        const timestamp = Number(timeString)
        const date = new Date(timestamp)
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        return formattedDateTime
    }
    const chatStore = useSelector((store: StoreType) => store.chatStore)

    return (
        <div id="container">
            <main>
                <ul id="chat">
                    {chatStore.data?.map(message => {
                        if ((message as any).adminId) {
                            return (
                                <li className="you">
                                    <div className="entete">
                                        <h2>{`Admin_${(message as any).adminId}`}</h2><br />
                                        <h3>{handleDateType((message as any).updateAt)}</h3>
                                    </div>
                                    <div className="triangle" />
                                    <div className="message">
                                        {(message as any).content}
                                    </div>
                                </li>
                            )
                        } else {
                            return (
                                <li className="me">
                                    <div className="entete">
                                        <h3>{handleDateType((message as any).updateAt)}1</h3><br />
                                        <h2>{(message as any).guestName || `Guest_${(message as any).guestId}`}</h2>
                                    </div>
                                    <div className="triangle" />
                                    <div className="message">
                                        {(message as any).content}
                                    </div>
                                </li>
                            )
                        }
                    })}

                </ul>
                <footer>
                    <textarea placeholder="Type your message" defaultValue={""} onKeyDown={(e) => {
                        if (e.code == "Enter") {
                            chatService.sendMessage({
                                guestId: (JSON.parse(localStorage.getItem("guest-infor") || "") as any).guestId,
                                content: (e.target as any).value
                            });
                            (e.target as any).value = ""
                        }
                    }} />
                </footer>
            </main>
        </div>
    )
}
