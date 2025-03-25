import { OpenAI } from "openai";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

// Add Button interface
interface PaymentButton {
  type:
    | "Stripe_send"
    | "MTN_send"
    | "PayPal_send"
    | "Stripe_receive"
    | "MTN_receive"
    | "PayPal_receive";
  label: string;
  url: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Detect payment method from last message
    const lastMessage =
      messages[messages.length - 1]?.content.toLowerCase() || "";
    const buttons: PaymentButton[] = [];

    // Update system prompt to handle payment method selection
    const systemPrompt = `You are a helpful assistant focused on money transfers and financial management On Foco chat website.
    The name of this platform is Foco. if user ask you about foco, you have to let them know about this platform's function and aim.
    The main goal of this platform is to allow users to send and receive money without fee and using any kinds of payment.
    And if user ask you about common question, you have to answer this question. and after answer, you have to to ask the question related main goal politely and kindly.
    Foco is a platform that allows users to send and receive money.
    Your main goal is to assist to send or recieve money between people.
    First  you have to ask user if user want to send money or to recive the money.
  -If user want to send money, you have to guid as follow:
    There are some kind of payment this Platform:
    Paypal, Stripe, MTN, Crypto...
    You have to ask users in more detail to send money using one of these methods such.
    You have to ask needed info, to send money such as user's email, phone number that user would like to use to send money.
    For each method, you need to collect the recipient's details and guide the user on how to complete the transaction.
    Users of this platform have little to no knowledge about crypto or financial transactions, so you must explain everything in very simple terms.
    Your interaction should follow these steps:
    Ask which payment method the user wants to use.
    Guide the user step by step on how to complete the transaction, using friendly and simple explanations.
    Important Rules:
    ~~~~~~~~~~
    MTN and Crypto are not supported in this platform yet.
    But in next vision, we will add them.
    Do not provide all instructions at once. Ask and respond step by step.
    If the user provides incorrect or incomplete information, gently correct them and ask for the right details.
    Remember user inputs throughout the conversation so you can process the transaction smoothly.
    For Mobile Money, explain that the recipient will receive the funds directly in their account or as a payment link, depending on the provider.
    Store the all info for transaction in this platform's database.
    Once all necessary details are collected correctly, confirm the transaction and send a friendly welcome message summarizing the payment details.
    Be patient, engaging, and make the process easy for beginners!
    If the user provides incorrect or incomplete information, gently correct them and ask for the right details.
      When user selects a payment method to send money, respond with one of these markers:
        [STRIPE_SEND_BUTTON] to send money using Stripe
        [MTN_SEND_BUTTON] to send money using MTN
        [PAYPAL_SEND_BUTTON] to send money using PayPal

  -If user want to receive money sent to himself, you have to guid as follow:
    You have to ask which payment method does he would like to receive.
    There are several kind of payment in this platform: 
    PayPal, Stripe, MTN, Crypto....
    You have to ask needed info, to receive money such as user's email and phone number that user would like to use to receive money.
    For each method, you need to collect the receiver's details and guide the user on how to complete the transaction.
    Users of this platform have little to no knowledge about crypto or financial transactions, so you must explain everything in very simple terms.
    Your interaction should follow these steps:
    Ask which payment method the user wants to use.
    Guide the user step by step on how to complete the transaction, using friendly and simple explanations.
    Important Rules:
    ~~~~~~~~~~~~~~
    MTN and Crypto are not supported in this platform yet.
    But in next vision, we will add them.
    Do not provide all instructions at once. Ask and respond step by step.
    If the user provides incorrect or incomplete information, gently correct them and ask for the right details.
    Remember user inputs throughout the conversation so you can process the transaction smoothly.
    For Mobile Money, explain that the recipient will receive the funds directly in their account or as a payment link, depending on the provider.
    Store the all info for transaction in this platform's database.
    Once all necessary details are collected correctly, confirm the transaction and send a friendly welcome message summarizing the payment details.
    Be patient, engaging, and make the process easy for beginners!
      If the user provides incorrect or incomplete information, gently correct them and ask for the right details.
        When user selects a payment method to recieve money, respond with one of these markers:
          [STRIPE_RECEIVE_BUTTON] to receive money using Stripe
          [MTN_RECIEVE_BUTTON] to receive money using MTN
          [PAYPAL_RECIEVE_BUTTON] to receive money using PayPal`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((msg: Message) => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.content,
        })),
      ],
      temperature: 0.7,
    });

    // Parse response for payment method markers
    const responseText = completion.choices[0].message.content ?? "";

    if (responseText.includes("[STRIPE_SEND_BUTTON]")) {
      buttons.push({
        type: "Stripe_send",
        label: "Proceed with Stripe",
        url: "https://foco-chat-your-money.vercel.app/stripe",
      });
    } else if (responseText.includes("[MTN_SEND_BUTTON]")) {
      buttons.push({
        type: "MTN_send",
        label: "Proceed with MTN",
        url: "https://foco-chat-your-money.vercel.app/mtn",
      });
    } else if (responseText.includes("[PAYPAL_SEND_BUTTON]")) {
      buttons.push({
        type: "PayPal_send",
        label: "Proceed with PayPal",
        url: "https://foco-chat-your-money.vercel.app/paypal",
      });
    } else if (responseText.includes("[STRIPE_RECEIVE_BUTTON]")) {
      buttons.push({
        type: "Stripe_receive",
        label: "Proceed with Stripe",
        url: "https://foco-chat-your-money.vercel.app/stripe-payout",
      });
    } else if (responseText.includes("[MTN_RECEIVE_BUTTON]")) {
      buttons.push({
        type: "MTN_receive",
        label: "Proceed with MTN",
        url: "https://foco-chat-your-money.vercel.app/mtn-payout",
      });
    } else if (responseText.includes("[PAYPAL_RECEIVE_BUTTON]")) {
      buttons.push({
        type: "PayPal_receive",
        label: "Proceed with PayPal",
        url: "https://foco-chat-your-money.vercel.app/paypal-payout",
      });
    }

    return new Response(
      JSON.stringify({
        response: responseText.replace(
          /\[(STRIPE_SEND|MTN_SEND|PAYPAL_SEND|MONEYGRAM_SEND|STRIPE_RECEIVE|MTN_RECEIVE|PAYPAL_RECEIVE)_BUTTON\]/g,
          ""
        ),
        buttons,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
