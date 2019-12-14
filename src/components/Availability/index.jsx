import React from "react";
import AvailabilityForm from "../AvailabilityForm";

const resourceTypes = [
  {
    text: "Space",
    value: 1
  },
  {
    text: "Asset",
    value: 2
  }
];

const Availability = () => {
  const search = val => {
    console.log(val);
  };
  return <AvailabilityForm search={search} resourceTypes={resourceTypes} />;
};

export default Availability;
