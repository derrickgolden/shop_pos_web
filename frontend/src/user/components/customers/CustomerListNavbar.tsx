import { FaAngleLeft } from "react-icons/fa6";
import AddCustomerForm from "./AddCustomerForm";

interface ValidateOrderNavbarProps {
  setEntryStep: (step: string) => void;
  step: { step: string };
}

const CustomerListNavbar: React.FC<ValidateOrderNavbarProps> = ({
  setEntryStep, step, }) => {
    console.log(step)
  return (
    <>
      <nav className="d-flex justify-content-between navbar navbar-light bg-light px-3"
        style={{ height: "4rem" }}
      >
        <div>
          {step.step === "payment" && (
            <button
              onClick={() => setEntryStep("inProgress")}
              className="navbar-brand pl-2 btn btn-outline-secondary"
            >
              &nbsp;
              <FaAngleLeft /> Back
            </button>
          )}
          <button
            type="button"
            className="btn btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            New Customer
          </button>
        </div>

        {/* <div className="d-flex align-items-center col-6">
          <div className="input-group flex-nowrap w-100">
            <span className="input-group-text bg-white" id="addon-wrapping">
              @
            </span>
            <input
              type="text"
              className="form-control border-right-0"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="addon-wrapping"
            />
            <button
              className="btn btn-outline-secondary border"
              type="button"
              id="button-addon2"
            >
              X
            </button>
          </div>
        </div> */}
      </nav>
      <AddCustomerForm />
    </>
  );
};

export default CustomerListNavbar;
