

export interface RacetrackEvent<MessageType> {
    message : MessageType;
}

export interface RacetrackCommand<MessageType> {
    senderId : string;    
    message : MessageType;
} 