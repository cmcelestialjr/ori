import api from "../api/axios";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import LoadingSpinner from "../shared/components/LoadingSpinner";
//import { useNavigate } from "react-router-dom";
//import { useAuthContextProvider } from "../../hooks/hooks";
import { useToast } from "../../hooks/useToast";
import ConfirmationModal from "../shared/components/ConfirmationModal";

const Logout = ({ style }: { style: string }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  //const navigate = useNavigate();
 // const { setUser, setActiveRole } = useAuthContextProvider();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await api.post("/api/logout");
      toast.success("Successfully logged out.");
      sessionStorage.removeItem("auth-user");
      sessionStorage.removeItem("active-role");
      //navigate("/login");
      const targetUrl = `${window.location.protocol}//${window.location.hostname}/systems`;      
      window.location.href = targetUrl;

    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className={style}
      >
        <FiLogOut className="mr-2" />
        <span>Log out</span>
      </button>
      <ConfirmationModal
        isOpen={openModal}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        type="warning"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onCancel={() => setOpenModal(false)}
        onConfirm={() => {
          setOpenModal(false);
          handleLogout();
        }}
      />
      <LoadingSpinner isLoading={isLoading} text="Logging out..." />
    </>
  );
};

export default Logout;
