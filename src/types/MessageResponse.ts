interface IMessageResponse {
    message: string;
}

class MessageResponse implements IMessageResponse {
    message: string;
    constructor(message: string) {
        this.message = message;
    }
}

export default MessageResponse;
