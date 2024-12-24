const FreeTokenFromDB = 2000;
const userInputToken: string[] = [];
const aiReqToken: string[] = [];

            // SUDOCODE FOR THE TOKEN USAGE 
// first we will get the user request message and ai response message
// if both criteria fullfiled: userReq already true, 
// if ai response true:
// we will call the function CalculateTokenUsage() and pass the 
// user req message and ai response message
// then calculate the two messages length by adding them togather
// then we will minus from the user initial Token Limit

export const CalculateTokenUsage = (userReq: string, aiRes: string): number => {

    // calculate token for the user
    const user_input = userReq;
    userInputToken.push(user_input.split(" "));
    console.log("user: ", userInputToken);
    const user_input_len = userInputToken.map(items => items.length);

    // calculate token for the ai
    const ai_res = aiRes;
    aiReqToken.push(ai_res.split(" "));
    console.log("ai: ", aiReqToken);
    const ai_res_len = aiReqToken.map(items => items.length);

    // sumUp the two lengths
    const userAndAiTotalTokenUsage = parseInt(user_input_len) + parseInt(ai_res_len);
    return FreeTokenFromDB - userAndAiTotalTokenUsage;
}

console.log(CalculateTokenUsage("can you explain about neural network", "The Mistral models allows you to chat with a model that has been fine-tuned to follow instructions and respond to natural language prompts. A prompt is the input that you provide to the Mistral model. It can come in various forms, such as asking a question, giving an instruction, or providing a few examples of the task you want the model to perform. Based on the prompt, the Mistral model generates a text output as a response. The chat completion API accepts a list of chat messages as input and generates a response. This response is in the form of a new chat message with the role \"assistant\" as output."))


// MORE OPRIMIZED VERSION OF THE ABOVE CODE
// const FreeTokenFromDB = 2000;
// const userInputToken = [];
// const aiReqToken = [];


// first we will get the user request message and ai response message
// if both criteria fullfiled: userReq already true, 
// if ai response true:
   // we will call the function CalculateTokenUsage() and pass the 
   // user req message and ai response message
   // then calculate the two messages length by adding them togather
   // then we will minus from the user initial Token Limit



// const CalculateTokenUsage = (userReq, aiRes) => {
    
    // console.log("short way for user: " , userReq.split(" "))
    // console.log("short way len for user: " , userReq.split(" ").length)
    // user_input_len = userReq.split(" ").length;

    // calculate token for the ai
    // console.log("short way for user: " , aiRes.split(" "))
    // console.log("short way len for user: " , aiRes.split(" ").length)
    // ai_res_len = aiRes.split(" ").length;

    // sumUp the two lengths
    // const userAndAiTotalTokenUsage = parseInt(user_input_len) + parseInt(ai_res_len);
    // return FreeTokenFromDB - userAndAiTotalTokenUsage;
// }

// console.log(CalculateTokenUsage("Mistral API", "The Mistral models allows you to chat with a model that has been fine-tuned to follow instructions and respond to natural language prompts. A prompt is the input that you provide to the Mistral model. It can come in various forms, such as asking a question, giving an instruction, or providing a few examples of the task you want the model to perform. Based on the prompt, the Mistral model generates a text output as a response. The chat completion API accepts a list of chat messages as input and generates a response. This response is in the form of a new chat message with the role \"assistant\" as output."))