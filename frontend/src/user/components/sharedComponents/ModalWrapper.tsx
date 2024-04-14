import React, { ReactNode } from "react";
import { BeatLoader } from "react-spinners"
import { IoMdClose } from "react-icons/io";

interface ModalWrapperProps{
    title: string;
    targetId: string;
    btnDetails: {
        confirmText: string;
        confirmColor: string;
        loaderColor: string;
        closeRef: React.RefObject<HTMLButtonElement>;
    };
    isLoading: boolean;
    children: ReactNode;
    submitHandle: (e: React.FormEvent<HTMLFormElement>) => void;
};

const ModalWrapper: React.FC<ModalWrapperProps> = (props) => {
    const {targetId, title, btnDetails, isLoading, submitHandle} = props;

    return(
        <div className="modal fade" id={targetId} tabIndex={-1} aria-labelledby={`${targetId}Label`} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
                <div className="modal-header">
                    <h5 className="modal-title" id={`${targetId}Label`}>{title}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        {targetId === "updateInvoiceModal"? <IoMdClose size={32}/> : null }
                    </button>
                </div>
                <form onSubmit={submitHandle} action="#">
                    <div className="modal-body main-content">
                        {props.children}
                    </div>

                    <div className="modal-footer">
                        <button ref={btnDetails.closeRef}
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            >
                            Close
                        </button>
                        <button type="submit" disabled ={isLoading} 
                            className={`btn ${btnDetails.confirmColor} d-flex gap-2 h-100 align-items-center`}>
                            <span>{btnDetails.confirmText}</span>
                                <span>
                                    <BeatLoader 
                                        color={btnDetails.loaderColor}
                                        loading={isLoading}
                                        cssOverride={{ display: "flex", margin: "0 auto" }}
                                        size={16}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                                </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    )
};

export default ModalWrapper;