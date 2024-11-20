import React from "react";

type SwitchProps = {
  checked: boolean;
  onChange: () => void;
};

const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <div
      onClick={onChange}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
        checked ? "bg-black" : "bg-white border border-gray-300"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full shadow-md transform transition-transform ${
          checked ? "translate-x-6 bg-white" : "translate-x-0 bg-black"
        }`}
      ></div>
    </div>
  );
};

export { Switch };
