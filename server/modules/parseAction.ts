export default function parseAction(action: string) {
    switch (action) {
        case "PET":
            return "You just got petted by your owner, how do you feel about this";
        case "FEED":
            return "You just got fed by your owner, how do you feel about this";
        case "HUG":
            return "You just got hugged by your owner, how do you feel about this";
        case "BATH":
            return "Your owner just bathed you,how do you feel about this"
        case "ACT":
            return "Do something"
            break;
        default: return "Your owner stares at you"
    }
}