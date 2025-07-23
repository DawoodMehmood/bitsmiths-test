"use client";

import { useState, ChangeEvent } from "react";

export type Issue = {
  id: string;
  name: string;
  message: string;
  status: "open" | "resolved";
  numEvents: number;
  numUsers: number;
  value: number;
};

type CheckedState = {
  checked: boolean;
  backgroundColor: string;
};

type TableProps = {
  issues: Issue[];
};

// Helper function to create the checkbox state for a row based on issue status and if it should be selected
const getCheckedState = (issue: Issue, isChecked: boolean): CheckedState => ({
  checked: isChecked && issue.status === "open",
  backgroundColor:
    isChecked && issue.status === "open" ? "#eeeeee" : "#ffffff",
});

const Table = ({ issues }: TableProps) => {
  // Initial checkbox state for each issue, defaulted to unchecked
  const [checkedState, setCheckedState] = useState<CheckedState[]>(
    issues.map((issue) => getCheckedState(issue, false))
  );

  const [selectDeselectAllIsChecked, setSelectDeselectAllIsChecked] =
    useState(false);
  const [numCheckboxesSelected, setNumCheckboxesSelected] = useState(0);

  // Called when a single checkbox row is toggled
  const handleOnChange = (index: number): void => {
    const newCheckedState = [...checkedState];
    const current = newCheckedState[index];
    const toggled = !current.checked;

    // Update the clicked checkbox row state
    newCheckedState[index] = {
      checked: toggled,
      backgroundColor: toggled ? "#eeeeee" : "#ffffff",
    };
    setCheckedState(newCheckedState);

    // Calculate the total value of all selected (and open) issues
    const selectedTotal = newCheckedState.reduce((sum, { checked }, i) => {
      return checked && issues[i].status === "open"
        ? sum + issues[i].value
        : sum;
    }, 0);

    setNumCheckboxesSelected(selectedTotal);
    updateIndeterminateCheckbox(selectedTotal);
  };

  // Updates the indeterminate state of the "Select All" checkbox
  const updateIndeterminateCheckbox = (selectedTotal: number): void => {
    const checkbox = document.getElementById(
      "custom-checkbox-selectDeselectAll"
    ) as HTMLInputElement | null;
    if (!checkbox) return;

    // Count how many open issues exist
    const totalOpen = issues.filter((issue) => issue.status === "open").length;

    // Set indeterminate if not all or none are selected
    checkbox.indeterminate = selectedTotal > 0 && selectedTotal < totalOpen;

    // Check the "Select All" box only if all open ones are selected
    setSelectDeselectAllIsChecked(selectedTotal === totalOpen);
  };

  // Called when "Select All" checkbox is toggled
  const handleSelectDeselectAll = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { checked } = event.target;

    // Set all open issues to checked/unchecked based on the select all toggle
    const newCheckedState = issues.map((issue) =>
      getCheckedState(issue, checked)
    );

    setCheckedState(newCheckedState);

    // Calculate the total selected value of open issues
    const selectedTotal = newCheckedState.reduce((sum, { checked }, i) => {
      return checked && issues[i].status === "open"
        ? sum + issues[i].value
        : sum;
    }, 0);

    setNumCheckboxesSelected(selectedTotal);
    setSelectDeselectAllIsChecked(checked);
  };

  return (
    <table className="w-full border-collapse shadow-lg">
      <thead>
        <tr className="border-2 border-gray-200">
          <th className="py-6 pl-6 text-left w-[48px]">
            <input
              className="w-5 h-5 cursor-pointer"
              type="checkbox"
              id="custom-checkbox-selectDeselectAll"
              name="custom-checkbox-selectDeselectAll"
              value="custom-checkbox-selectDeselectAll"
              checked={selectDeselectAllIsChecked}
              onChange={handleSelectDeselectAll}
            />
          </th>
          <th className="py-6 min-w-[8rem] text-left text-black">
            {numCheckboxesSelected
              ? `Selected ${numCheckboxesSelected}`
              : "None selected"}
          </th>
          <th colSpan={2} />
        </tr>
        <tr className="border-2 border-gray-200">
          <th className="py-6 pl-6" />
          <th className="py-6 text-left font-medium text-black">Name</th>
          <th className="py-6 text-left font-medium text-black">Message</th>
          <th className="py-6 text-left font-medium text-black">Status</th>
        </tr>
      </thead>

      <tbody>
        {issues.map(({ name, message, status }, index) => {
          const issueIsOpen = status === "open";
          const isChecked = checkedState[index]?.checked;

          const rowClasses = `${
            issueIsOpen
              ? "cursor-pointer hover:bg-blue-50 text-black"
              : "text-gray-600 cursor-not-allowed"
          } border-b border-gray-200 ${isChecked ? "bg-blue-50" : ""}`;

          return (
            <tr
              className={rowClasses}
              key={index}
              onClick={issueIsOpen ? () => handleOnChange(index) : undefined}
            >
              <td className="py-6 pl-6">
                {issueIsOpen ? (
                  <input
                    className="w-5 h-5 cursor-pointer"
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    name={name}
                    value={name}
                    checked={isChecked}
                    onChange={() => handleOnChange(index)}
                  />
                ) : (
                  <input
                    className="w-5 h-5 opacity-50"
                    type="checkbox"
                    disabled
                  />
                )}
              </td>
              <td className="py-6">{name}</td>
              <td className="py-6">{message}</td>
              <td className="py-6">
                <div className="flex items-center gap-2">
                  {issueIsOpen ? (
                    <>
                      <span className="inline-block w-[15px] h-[15px] rounded-full bg-blue-600" />
                      <span className="text-blue-700 font-medium">Open</span>
                    </>
                  ) : (
                    <>
                      <span className="inline-block w-[15px] h-[15px] rounded-full bg-gray-400" />
                      <span className="text-gray-700 font-medium">
                        Resolved
                      </span>
                    </>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
