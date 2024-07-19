import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal({
    children,
    show = false,
    maxWidth = "4xl",
    closeable = true,
    onClose = () => {},
}) {
    const modalRef = useRef(null);
    const initialFocusRef = useRef(null);

    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "4xl": "sm:max-w-4xl", // Agregado para un modal más ancho
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 items-center justify-center z-50"
                onClose={close}
                initialFocus={initialFocusRef}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <div
                        className={`mb-6 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all w-10/12 sm:w-11/12 sm:mx-auto ${maxWidthClass}`}
                    >
                        <div
                            ref={initialFocusRef}
                            tabIndex={-1}
                            className="absolute top-0 left-0 w-0 h-0 overflow-hidden"
                        />
                        {children}
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
