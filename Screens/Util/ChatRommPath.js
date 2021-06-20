import cyrb53 from "./HashGenerator";

const ChatRoomPath = function(me,you) {
    const meHashCode = cyrb53(me,9999);
    const youHashCode = cyrb53(you,9999);

    if(meHashCode>youHashCode)
        return `${me}-${you}`;
    else
        return `${you}-${me}`;
};

export default ChatRoomPath;