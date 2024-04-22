import { Link } from "react-router-dom";
import StepperModal from "../stepper/StepperModal";
import React, { useEffect, useState } from "react";
import Header from "../layout/Header";

const Configuration = () => {
  const [agents, setAgents] = useState([]);
  const [showStepper, setShowStepper] = useState(false);
  const [agentSelected, setAgentSelected] = useState(false);
  const [editingAgentIdx, setEditingAgentIdx] = useState(-1);

  const toggleStepper = () => {
    setShowStepper((prev) => !prev);
  };

  const handleAddAgent = () => {
    localStorage.removeItem("currAgent");
    setAgentSelected(false);
    setShowStepper((prev) => !prev);
  };

  const handleEditAgent = (idx) => {
    setEditingAgentIdx(idx);
    localStorage.setItem("currAgent", JSON.stringify(agents[idx]));
    setAgentSelected(false);
    setShowStepper((prev) => !prev);
  };

  const handleDeleteAgent = (index) => {
    const updatedAgents = [...agents];

    if (index >= 0 && index < updatedAgents.length) {
      updatedAgents.splice(index, 1);
      setAgents(updatedAgents);
      localStorage.setItem("agents", JSON.stringify(updatedAgents));
    }
  };

  useEffect(() => {
    const allAgents = JSON.parse(localStorage.getItem("agents"));
    if (allAgents) {
      setAgents(allAgents);
    }

    localStorage.removeItem("currAgent");
  }, []);

  return (
    <>
      <Header />
      <div className="sm:mx-12 md:mx-20 lg:mx-24 mx-4 mb-12 md:mb-20 lg:mb-24  md:text-lg text-base">
        {showStepper && (
          <StepperModal
            toggleStepper={toggleStepper}
            editingAgentIdx={editingAgentIdx}
            setEditingAgentIdx={setEditingAgentIdx}
            setAgents={setAgents}
          />
        )}

        <div className=" my-8">
          {(!agents || agents.length <= 0) && (
            <p className=" text-gray-500 py-8">
              <span className="text-lg">
                <span className="font-bold">JACANA</span> facilitates the seamless migration of integrations from SAP PI/PO to CPI through an interactive user interface.
This migration tool is crafted to drastically reduce manual migration efforts and eliminate the possibility of human error in the process.
              </span>
              <br></br>
              <br></br>
              <span className="font-bold">Salient Features</span> <br></br>
              
              ⇾ Significant reduction in migration effort.<br></br>
              ⇾ Migrate multiple integrations simultaneously.<br></br> 
              ⇾ Automated migration of PI/PO integrations to CPI. <br></br>
              ⇾ Dynamic migration templates automatically applied by Jacana.<br></br>
              ⇾ Migration report to validate the migrated and non-migrated components. <br></br>
              ⇾ Automatic implementation of error handling and payload logging across all integrations.<br></br>
              ⇾ Migration support for components not available in SAP Migration - Value Mapping, Encoding-Decoding etc.<br></br><br></br>
              
              <span className="font-bold">Want to Explore more? Try adding an agent below. </span>
            </p>
          )}
          <button
            className="bg-[#3026B9] text-white  md:px-6 px-3  py-2 rounded-md  hover:bg-[#3026b9d3]"
            onClick={handleAddAgent}
          >
            + &nbsp; Add Agent
          </button>
        </div>
        {/* TABLE */}
        {agents && agents.length > 0 && (
          <div className=" text-left ">
            <table className=" table-fixed border-2 w-full border-[#E0E0E0] my-5">
              <thead>
                <tr className="bg-[#F5F5F5] ">
                  <th className="w-[10%]">
                    <div
                      className=" cursor-pointer my-5 mx-5 h-[20px] w-[20px] "
                      id="agentHeader"
                    ></div>
                  </th>
                  <th>PO Agent Name</th>
                  <th>CPI Agent Name</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {agents &&
                  agents.length > 0 &&
                  agents.map((each, index) => {
                    return (
                      <tr className="h-12" key={index}>
                        <th>
                          <input
                            className=" cursor-pointer my-5 sm:mx-5 mx-2 h-[20px] w-[20px] "
                            type="radio"
                            name="agentsSelect"
                            onChange={() => {
                              localStorage.setItem(
                                "currAgent",
                                JSON.stringify(each)
                              );
                              setAgentSelected(true);
                            }}
                          />
                        </th>
                        <td className=" overflow-hidden">
                          {each?.poData?.name}
                        </td>
                        <td className=" overflow-hidden">
                          {each?.cpiData?.name}
                        </td>
                        <td>
                          <button
                            className="bg-[#3026B9] text-white  md:px-5 px-2 mx-auto    rounded-md  hover:bg-[#3026b9d3]"
                            onClick={() => {
                              handleEditAgent(index);
                            }}
                          >
                            Edit
                          </button>
                        </td>
                        <td>
                          <button
                            className="bg-red-700 text-white  md:px-5 px-2 mx-auto rounded-md  hover:bg-red-800"
                            onClick={() => {
                              handleDeleteAgent(index);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
        {agents && agents.length > 0 && (
          <Link
            to={"/migration-tool"}
            style={{ pointerEvents: !agentSelected && "none" }}
          >
            <button
              className={` text-white md:px-10 px-6 py-2 rounded-md text-lg  ${
                !agentSelected
                  ? " bg-gray-400"
                  : "bg-[#3026B9] hover:bg-[#3026b9d3]"
              }`}
              disabled={!agentSelected}
            >
              Migrate
            </button>
          </Link>
        )}
      </div>
    </>
  );
};

export default Configuration;
