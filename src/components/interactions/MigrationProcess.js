import React, { useState, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import { Checkbox, ListItemText, FormControlLabel } from '@material-ui/core';
import Navbar from "../layout/Navbar";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../layout/Footer";
import { toast, ToastContainer } from "react-toastify";
import { CreatePackage } from "./CreatePackage";
import useIcoList from '../../hooks/useIcoList';
import usePackageList from '../../hooks/usePackageList';
import { Radio, RadioGroup } from '@material-ui/core';
import  axios  from "axios";
import useValueMappingList from "../../hooks/useValueMappingList";

function MigrationProcess() {
  const [inputValue, setInputValue] = useState([]);
  const [selectedICO, setSelectedICO] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [poData, setPoData] = useState({});
  const [cpiData, setCpiData] = useState({});
  const [errors, setErrors] = useState({
    integrationNameError: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("icos");
  const [selectedValueMapping, setSelectedValueMapping] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const { icos} = useIcoList(poData);
  const { packages} = usePackageList(cpiData, refreshFlag);
  const { vms } = useValueMappingList(poData);
  // console.log("Value mapping list", typeof vms);

  useEffect(() => {
    const selectedData = JSON.parse(localStorage.getItem("currAgent")) || {};
    setCpiData(selectedData?.apiData);
    setPoData(selectedData?.poData);
  }, []);

  function handleInputChange(e) {
    const values = e.target.value.split(",");
    setInputValue(values);
  }

  function handleIcoChange(event, newValue) {
    setSelectedICO(newValue);
  }

  function handleValueMapping(event, newValue) {
    // console.log("value", newValue);
  
    // Check if newValue is an array (multiple selections) or a single value
    if (Array.isArray(newValue)) {
      // console.log("Console is here")
      setSelectedValueMapping(newValue);
    } else if (newValue !== null) {
      setSelectedValueMapping([newValue]); // Convert single value to array
    } else {
      setSelectedValueMapping([]); // Handle the case when nothing is selected
    }
  }

  const handleRefresh = () => {
    setRefreshFlag(!refreshFlag);
  }

  const handleVisible = (option) => {
    setSelectedOption(option);
    // console.log(selectedOption);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    let formValid = true;
    const newErrors = {
      integrationNameError: "",
    };
  
    if (!inputValue.length) {
      newErrors.integrationNameError = "Integration Flow Name cannot be empty !!";
      formValid = false;
    }
  
    setErrors(newErrors);
    setLoading(true);

  
    if (formValid) {
      try {
        if (selectedOption === 'icos') {
          const postData = {
            poAgent: poData,
            cpiAgent: cpiData,
            migrationDetails: {
              iCOKey: selectedICO,
              packageId: selectedPackage?.id,
              integrationName: inputValue,
            },
          };
          await axios.post(
            "http://localhost:8080/api/v1/migration/designtime/migrate/ico/to/multipleiflow",
            postData
          );
  
          setInputValue([]);
          setSelectedICO([]);
          setSelectedPackage(null);
          toast.success("IFlow Created Successfully");
        } else if (selectedOption === 'packages') {
          const postData = {
            poAgent: poData,
            cpiAgent: cpiData,
            migrationDetails: {
              iCOKey: selectedValueMapping,
              packageId: selectedPackage?.id,
              integrationName: inputValue,
            },
          };
          console.log("postData", postData);
          await axios.post(
            "http://localhost:8080/api/v1/migration/designtime/migrate/ico/to/vm",
            postData
          );
  
          setInputValue([]);
          setSelectedValueMapping([]);
          toast.success("Value Mapping Created Successfully");
        }
  
        setLoading(false);
        
      } catch (error) {
        setLoading(false);
        toast.error("Error While Creating Value Mapping");
      }
    }
  };
  

  return (
    <>
      <Navbar>
      <form onSubmit={handleSubmit}>
          <div className="main-container h-screen overflow-y-auto">
            <div className="">
              <div
                className={`h-44 w-full bg-[length:100%_100%] mb-8 bg-center flex items-center   bg-no-repeat bg-[url(./data/images/header_graphic_img.png)]`}
              >
                <h1 className="text-2xl md:text-5xl  mx-8 text-white">
                  PI/PO to CPI Migration Tool
                </h1>
              </div>
            </div>
            <div className="inputs items-center">
            <div>
            <RadioGroup
              row
              aria-label="options"
              name="options"
                value={selectedOption}
                onChange={(event) => handleVisible(event.target.value)}
            >
            <FormControlLabel
              value="icos"
              control={<Radio color="primary" />}
              label="Select ICOs"
              labelPlacement="end"
            />
            <FormControlLabel
              value="packages"
              control={<Radio color="primary" />}
              label="Select Value Mapping"
              labelPlacement="end"
            />
            </RadioGroup>
            </div>
              {
                selectedOption === 'icos' ? (
                  <div className="input-group">
              
                <label htmlFor="autocomplete-ico">Select ICO:</label>
                <Autocomplete
                  multiple
                  fullWidth
                  id="autocomplete-ico"
                  options={icos}
                  getOptionLabel={(option) => option}
                  value={selectedICO}
                  onChange={(event, newValue) => handleIcoChange(event, newValue)}
                  renderOption={(option, {selected})=>(
                    <React.Fragment>
                      <FormControlLabel 
                        control={<Checkbox checked={selected} />}
                        label={<ListItemText primary={option} />}
                      />
                    </React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select ICO"
                      required
                    />
                  )}
                />
              </div>
                ) : (
                  <div className="input-group">
              
                <label htmlFor="autocomplete-ico">Select Value Mapping</label>
                <Autocomplete
                  multiple
                  fullWidth
                  id="autocomplete-ico"
                  options={vms}
                  getOptionLabel={(option) => option}
                  value={selectedValueMapping}
                  onChange={(event, newValue) => handleValueMapping(event, newValue)}
                  renderOption={(option, {selected})=>(
                    <React.Fragment>
                      <FormControlLabel 
                        control={<Checkbox checked={selected} />}
                        label={<ListItemText primary={option} />}
                      />
                    </React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select Value Mapping"
                      required
                    />
                  )}
                />
              </div>
                )
              }

              <div className="input-group grid grid-cols-11 items-center justify-cente gap-2">
                <div className="col-span-10">
                  <div>
                  <label htmlFor="autocomplete-package">Select Package:</label>
                  <Autocomplete
                    
                    fullWidth
                    id="autocomplete-package"
                    options={packages}
                    getOptionLabel={(option) => option.name}
                    value={selectedPackage}
                    onChange={(event, newValue) => {
                      setSelectedPackage(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select Package"
                      />
                    )}
                  />
                  </div>
                </div>
                <div className="col-span-1 flex justify-center pt-5">
                  <CreatePackage handleRefresh={handleRefresh}/>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="integration-name">
                  Enter Integration Flow Name:
                </label>
                <TextField
                  id="integration-name"
                  variant="outlined"
                  fullWidth
                  value={inputValue}
                  onChange={(e) => handleInputChange(e)}
                  error={!!errors.integrationNameError}
                  helperText={errors.integrationNameError}
                  required
                  placeholder="Enter Iflow Name"
                />
              </div>

              <ToastContainer />

              {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <CircularProgress />
            </div>
          )}

              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Navbar>
      <Footer />
    </>
  );
}

export default MigrationProcess;
