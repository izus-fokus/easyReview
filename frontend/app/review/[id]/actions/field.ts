"use server";

import backendRequest from "@/app/utils/requests";
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateField(payload: Object, field_id: string) {
  const url = `http://easyreview-backend:8000/api/fields/${field_id}`;
  const res = await backendRequest(
    url,
    "PATCH",
    JSON.stringify(payload),
    "field",
  );

  // Throw error if response is not ok
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  revalidateTag("field");
  revalidateTag("stats");
  revalidatePath("/review/[id]", "page");
}
