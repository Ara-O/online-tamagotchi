export type ActionResponseType = {
    actionPrompt: string,
    petThought: string,
    petResponse: [boolean, string]
}

export type ActionType = "PET" | "HUG" | "FEED" | "BATH" | "ACT" | "CREATE" | "VISIT"
