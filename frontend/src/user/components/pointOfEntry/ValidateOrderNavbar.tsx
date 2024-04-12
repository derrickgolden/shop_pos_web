import { FaAngleLeft } from "react-icons/fa6";
import { EntryStepTypes } from "../../pages/types";

interface ValidateOrderNavbarProps{
    setEntryStep: React.Dispatch<React.SetStateAction<EntryStepTypes>>;
    totalPrice: number;
    step: {step: string}
}

const ValidateOrderNavbar: React.FC<ValidateOrderNavbarProps> = ({ setEntryStep, totalPrice, step }) => {
    return (
        <nav className="d-flex justify-content-between navbar navbar-light bg-light px-3"
        style={{height: "4rem"}}>
            <div>
                {
                step.step ===  "payment" && (
                    <button onClick={() => setEntryStep(obj =>({...obj, current: "inProgress"}))}
                        className="navbar-brand pl-2 btn btn-outline-secondary">
                            &nbsp;<FaAngleLeft /> Back
                    </button>
                    )
                }
            </div>

            <div className="d-flex mx-auto align-items-center">
                <h1 className="m-0">
                    {step.step ===  "receipt"? `${totalPrice} Ksh`: "Payment"}
                </h1>
            </div>
        </nav>
    );
};

export default ValidateOrderNavbar;
