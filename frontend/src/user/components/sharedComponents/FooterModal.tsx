import React from "react";
import { BeatLoader } from "react-spinners"

interface FooterModalProps{
    btnClose: React.RefObject<HTMLButtonElement>;
    isLoading: boolean;   
}

const FooterModal: React.FC<FooterModalProps> = ({btnClose, isLoading }) =>{
    return(
        <div className="modal-footer">
            <button ref={btnClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                >
                Close
            </button>
            <button type="submit" disabled ={isLoading} 
                className="btn btn-primary d-flex gap-2 h-100 align-items-center">
                <span>Add Customer</span>
                    <span>
                        <BeatLoader 
                            color="#fff"
                            loading={isLoading}
                            cssOverride={{ display: "flex", margin: "0 auto" }}
                            size={16}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </span>
            </button>
        </div>
    )
}

export default FooterModal;