import { store } from '@/store';
import { chatAction } from '@/store/slices/chat.slice';
import io, {Socket} from 'socket.io-client'

class ChatSocket {
    socket!: Socket;

    constructor(){}

    connect(data: {
        guestId: string;
        guestName: string|null;
    }) {
        this.socket = io("http://localhost:3000", {
            query: data
        })

        this.socket.on('load-chat-history', (data: any) => {
            store.dispatch(chatAction.setData(data))
        })
    }

    sendMessage(data: {
        guestId: string;
        content: string;
    }) {
        this.socket.emit('user-send-message', data)
    }
}

export const chatService =  new ChatSocket()