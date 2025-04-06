import React from "react";
import { Address } from "@/types/contact";
import { useOpenContactMutation } from "@/hooks/api/contacts/use-open-contact-mutation";

interface ContactAddressProps {
    address: Address;
    showSeparator?: boolean;
}

export function ContactAddress({
    address,
    showSeparator = false
}: ContactAddressProps) {
    const { mutate: openContact } = useOpenContactMutation();

    return (
        <React.Fragment>
            <span
                className={`text-[#3362FF] text-sm truncate ${address.email ? "cursor-pointer" : ""}`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (address.email) {
                        openContact(address);
                    }
                }}
            >
                {address.name || address.email}
            </span>

            {showSeparator && <span className="text-[#3362FF] text-sm"> </span>}
        </React.Fragment>
    );
}
