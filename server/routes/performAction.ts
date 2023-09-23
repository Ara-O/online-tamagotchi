import parseAction from "../modules/parseAction";
import { performAction } from "../modules/performAction";
import { ActionResponseType } from "../types/types";

export default async function (req, res) {
    if (!req.body.action || req.body?.action.trim() === "") {
        return res.status(400).send({ message: "There was an error performing this action" })
    }

    try {
        //Gets the id and pet data from the auth
        const { id, pet } = req

        //Parse action texts, hug, feed etc
        let action = parseAction(req.body.action, req.body.actionText)

        console.log("ACTION:", action)
        console.log("PET", req.body)

        //Perform the action to the pet
        let response1 = await performAction(id, pet?.name, pet?.age, action, req.body.actionText, req.body?.memory || "disabled")

        console.log("RES 1", response1)
        let response: ActionResponseType = {
            actionPrompt: action,
            petThought: "This is a test",
            petResponse: [false, "test"]
        }
        // console.log("RESPONSE: ", response, "\n")

        return res.status(200).send(response)
    } catch (err) {
        console.log('Error')
        return res.status(404).send(err)
    }
}