import { Modal } from "../modal";
import { PopupProps } from "../../../interfaces/popup";

export const Popup: React.FC<PopupProps> = ({
    isOpen,
    onClose,
    title,
    children,
    className = "max-w-md",
    showCloseButton = true,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className={`${className} p-6`}
            showCloseButton={showCloseButton}
        >
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {title}
                </h2>
                <div>{children}</div>
            </div>
        </Modal>
    );
};

export { default as ConfirmationPopup } from "./ConfirmationPopup";
export default Popup;
