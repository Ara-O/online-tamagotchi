export default function parseAction(action: string, actionText?: string) {
    switch (action) {
        case "PET":
            return "I just petted you, how do you feel about this, what action do you take in response to this";
        case "FEED":
            return "I just fed you, how do you feel about this,  what action do you take in response to this";
        case "HUG":
            return "I just huggedyou, how do you feel about this,  what action do you take in response to this";
        case "BATH":
            return "I just bathed you, how do you feel about this,  what action do you take in response to this"
        case "ACT":
            return "Your owner just performed this action: " + actionText + " , how do you feel about this and what action do you take in response to this";
        default: return "Your owner stares at you"
    }
}