"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import backendRequest from "@/app/utils/requests";
import { Field } from "@/app/types";

/**
 * Sends a chat message to the backend.
 * @param message - The message to send.
 * @param user - The user sending the message.
 * @param fieldId - The ID of the field where the message is sent.
 */
export async function sendFieldChatMessage(
  message: string,
  user: string,
  fieldId: string,
) {
  const url = `http://easyreview-backend:8000/api/messages/`;
  const payload = JSON.stringify({
    message: message,
    user: user,
    field: fieldId,
  });

  const response = await backendRequest(url, "POST", payload, "chat");

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  revalidateTag("chat");
  revalidatePath("/review/[id]", "page");

  return await response.json();
}

/**
 * Retrieves the chat messages for a specific field.
 *
 * @param fieldId - The ID of the field.
 * @returns The chat messages for the field.
 * @throws Error if the request fails or the response is not successful.
 */
export async function getFieldChatMessages(fieldId: string) {
  const url = `http://easyreview-backend:8000/api/fields/${fieldId}`;
  const response = await backendRequest(url, "GET", null, "chat", 0);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const field: Field = await response.json();

  revalidateTag("chat");
  revalidatePath("/review/[id]", "page");

  return field.chat;
}
