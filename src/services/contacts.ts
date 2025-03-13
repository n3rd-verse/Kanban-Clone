import { Address } from "@/types/contact";
import { add } from "date-fns";

/**
 * Opens contact details for a given email address
 * @param email The email address of the contact to open
 * @returns A promise that resolves when the contact is opened
 */
export async function openContact(address: Address): Promise<void> {
    return await window.OMNative.openContact(address.name, address.email);
}
