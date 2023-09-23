export default function parseAction(action: string, actionText?: string) {
    // visit, create
    switch (action) {
        case "VISIT":
            return "I am visiting you";
        case "CREATE":
            return "I just created you";
        case "PET":
            return "I just petted you";
        case "FEED":
            return "I just fed you";
        case "HUG":
            return "I just hugged you";
        case "BATH":
            return "I just bathed you"
        case "ACT":
            return "I just performed this action: " + actionText;
        default: return "I stare at you"
    }
}