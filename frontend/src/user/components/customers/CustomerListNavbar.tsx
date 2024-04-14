import { FaAngleLeft } from "react-icons/fa6";
import AddCustomerForm from "./AddCustomerForm";
import { EntryStepTypes } from "../../pages/types";

interface ValidateOrderNavbarProps {
  setEntryStep: React.Dispatch<React.SetStateAction<EntryStepTypes>>;
}

const CustomerListNavbar: React.FC<ValidateOrderNavbarProps> = ({ setEntryStep }) => {
  return (
    <>
      <nav className="d-flex justify-content-between navbar navbar-light bg-light px-3"
        style={{ height: "4rem" }}
      >
        <div>
          { (
            <button
              onClick={() => setEntryStep(obj => ({...obj, current: obj.prev}))}
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
            data-bs-target="#addCustomerModal"
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
