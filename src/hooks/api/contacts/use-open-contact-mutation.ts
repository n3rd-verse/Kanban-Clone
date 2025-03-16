import { useMutation } from "@tanstack/react-query";
import { openContact } from "@/services/contacts";
import { Address } from "@/types/contact";

/**
 * Hook for opening contact details
 * @returns A mutation object for opening contact details
 */
export function useOpenContactMutation() {
    return useMutation({
        mutationFn: openContact,
        onError: (error, address: Address, context) => {
            console.error("openContact failed:", error);
        },
        onSuccess: (data, address: Address, context) => {
            console.log(`Contact ${address.name} (${address.email}) opened successfully.`);
        },
    });
}
