import { TOKEN_REGEX_BASE } from "@/database/constants";

export const generateTimestamp = () => {
    return Math.floor(
        new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Toronto" })
        ).getTime() / 1000
    );
};

export const generateUUID = () => {
    let uuid = '';
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require("crypto").randomBytes(16).toString("hex");
    uuid += crypto.replace(
        TOKEN_REGEX_BASE,
        "$1-$2-$3-$4-$5"
    );
    
    return (uuid += "-" + generateTimestamp());
};
