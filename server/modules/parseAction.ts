export default function parseAction(action: string, actionText?: string) {
    // visit, create
    switch (action) {
        case "VISIT":
            return "I am visiting you";
        case "CREATE":
            return "I just created you";
        case "PET":
            return "I just petted you, how do you feel about this";
        case "FEED":
            return "I just fed you, how do you feel about this";
        case "HUG":
            return "I just hugged you, how do you feel about this";
        case "BATH":
            return "I just bathed you, how do you feel about this"
        case "ACT":
            return "I just performed this action: " + actionText + " , how do you feel about this";
        default: return "I stare at you"
    }
}