  "use client";

  import React from "react";

  export default function MedicineTable({
    rows = [],
    editable,
    isDownloading,
    addRow,
    removeRow,
    setRows,
    optionsMap = {},
  }) {
    const visibleRows = isDownloading
      ? rows.filter(
          (row) =>
            row.name ||
            row.dose ||
            row.unit ||
            row.freq ||
            row.instr
        )
      : rows;

    const getOptions = (type) => {
      const options = optionsMap[type];

      if (!Array.isArray(options)) {
        return [];
      }

      return options;
    };

    const updateRow = (idx, field, value) => {
      const updatedRows = [...rows];

      updatedRows[idx] = {
        ...updatedRows[idx],
        [field]: value,
      };

      setRows(updatedRows);
    };

    // =====================================================
    // NORMAL INPUT
    // =====================================================

    const renderInput = ({
      idx,
      field,
      value,
      placeholder,
      type,
    }) => {
      const listId = `medicine-${type}-options`;

      return (
        <>
          <input
            type="text"
            value={value || ""}
            onChange={(e) =>
              updateRow(idx, field, e.target.value)
            }
            disabled={!editable}
            placeholder={placeholder}
            list={listId}
            className="
              w-full
              min-w-0
              h-[46px]
              rounded-md
              border
              border-gray-300
              bg-white
              px-3
              py-2
              text-sm
              leading-[28px]
              text-gray-800
              outline-none
              transition
              placeholder:text-gray-400
              focus:border-[#1e6658]
              focus:ring-1
              focus:ring-[#1e6658]
              disabled:cursor-not-allowed
              disabled:bg-gray-100
              disabled:text-gray-500
            "
          />

          <datalist id={listId}>
            {getOptions(type).map((option, index) => (
              <option
                key={`${type}-${index}`}
                value={option}
              />
            ))}
          </datalist>
        </>
      );
    };

    // =====================================================
    // SELECT DROPDOWN
    // =====================================================

    const renderSelect = ({
      idx,
      field,
      value,
      placeholder,
      type,
    }) => {
      const options = getOptions(type);

      return (
        <select
          value={value || ""}
          onChange={(e) =>
            updateRow(idx, field, e.target.value)
          }
          disabled={!editable}
          className="
            w-full
            min-w-0
            h-[46px]
            appearance-auto
            rounded-md
            border
            border-gray-300
            bg-white
            px-3
            py-2
            text-sm
            leading-[28px]
            text-gray-800
            outline-none
            transition
            focus:border-[#1e6658]
            focus:ring-1
            focus:ring-[#1e6658]
            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-500
          "
        >
          <option value="">
            {placeholder}
          </option>

          {options.map((option, index) => (
            <option
              key={`${type}-${index}`}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>
      );
    };

    return (
      <div className="w-full min-w-0">

        {/* =====================================================
            DESKTOP TABLE
        ===================================================== */}
<div
  className={
    isDownloading
      ? "block w-full"
      : "hidden w-full md:block"
  }
>
          <div className="w-full">
        <table
    className="w-full table-fixed border-collapse border border-gray-300"
  >

              <thead>
                <tr className="bg-[#e8f1ef]">

          <th className="w-[7%] border border-gray-300 px-2 py-3 text-center text-sm font-semibold text-gray-700">
    S.No
  </th>
  <th className="w-[23%] border border-gray-300 px-2 py-3 text-left text-sm font-semibold text-gray-700">
    Medicine Name
  </th>

                <th className="w-[12%] border border-gray-300 px-2 py-3 text-left text-sm font-semibold text-gray-700">
    Dose
  </th>
                <th className="w-[13%] border border-gray-300 px-2 py-3 text-left text-sm font-semibold text-gray-700">
    Unit
  </th>

                <th className="w-[18%] border border-gray-300 px-2 py-3 text-left text-sm font-semibold text-gray-700">
    Frequency
  </th>

                <th className="w-[27%] border border-gray-300 px-2 py-3 text-left text-sm font-semibold text-gray-700">
    Instructions
  </th>

                  {editable && !isDownloading && (
                    <th className="w-[60px] border border-gray-300 px-2 py-3 text-center text-sm font-semibold text-gray-700">
                      -
                    </th>
                  )}

                </tr>
              </thead>

              <tbody>

                {visibleRows.length > 0 ? (
                  visibleRows.map((row, idx) => {

                    const actualIndex = rows.indexOf(row);

                    return (
                      <tr
                        key={
                          row.id ||
                          `medicine-${actualIndex}`
                        }
                        className="align-middle"
                      >

                        {/* S.NO */}

                        <td className="border border-gray-300 px-3 py-3 text-center text-sm text-gray-700">
                          {idx + 1}
                        </td>

                        {/* MEDICINE */}

                        <td className="border border-gray-300 p-2 align-middle">
                          {renderInput({
                            idx: actualIndex,
                            field: "name",
                            value: row.name,
                            placeholder: "Medicine name",
                            type: "name",
                          })}
                        </td>

                        {/* DOSE */}

                        <td className="border border-gray-300 p-2 align-middle">
                          {renderInput({
                            idx: actualIndex,
                            field: "dose",
                            value: row.dose,
                            placeholder: "Dose",
                            type: "dose",
                          })}
                        </td>

                        {/* UNIT */}

                        <td className="border border-gray-300 p-2 align-middle">
                          {renderSelect({
                            idx: actualIndex,
                            field: "unit",
                            value: row.unit,
                            placeholder: "Select unit",
                            type: "unit",
                          })}
                        </td>

                        {/* FREQUENCY */}

                        <td className="border border-gray-300 p-2 align-middle">
                          {renderSelect({
                            idx: actualIndex,
                            field: "freq",
                            value: row.freq,
                            placeholder: "Select frequency",
                            type: "freq",
                          })}
                        </td>

                        {/* INSTRUCTIONS */}

                        <td className="border border-gray-300 p-2 align-middle">
                          {renderSelect({
                            idx: actualIndex,
                            field: "instr",
                            value: row.instr,
                            placeholder: "Select instruction",
                            type: "instr",
                          })}
                        </td>

                        {/* REMOVE */}

                        {editable && !isDownloading && (
                          <td className="border border-gray-300 p-2 text-center align-middle">

                            <button
                              type="button"
                              onClick={() =>
                                removeRow(actualIndex)
                              }
                              className="
                                inline-flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-md
                                text-xl
                                font-semibold
                                text-red-500
                                hover:bg-red-50
                              "
                            >
                              ×
                            </button>

                          </td>
                        )}

                      </tr>
                    );
                  })
                ) : (
                  <tr>

                    <td
                      colSpan={
                        editable && !isDownloading
                          ? 7
                          : 6
                      }
                      className="
                        border
                        border-gray-300
                        px-4
                        py-8
                        text-center
                        text-sm
                        text-gray-500
                      "
                    >
                      No medicine found
                    </td>

                  </tr>
                )}

              </tbody>

            </table>
          </div>
        </div>

        {/* =====================================================
            MOBILE CARDS
        ===================================================== */}

     <div
  className={
    isDownloading
      ? "hidden"
      : "block w-full md:hidden"
  }
>

          {visibleRows.length > 0 ? (

            <div className="space-y-4">

              {visibleRows.map((row, idx) => {

                const actualIndex = rows.indexOf(row);

                return (
                  <div
                    key={
                      row.id ||
                      `mobile-medicine-${actualIndex}`
                    }
                    className="
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      p-4
                      shadow-sm
                    "
                  >

                    {/* CARD HEADER */}

                    <div
                      className="
                        mb-4
                        flex
                        items-center
                        justify-between
                        border-b
                        border-gray-200
                        pb-3
                      "
                    >

                      <div className="flex items-center gap-2">

                        <div
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-[#1e6658]
                            text-sm
                            font-semibold
                            text-white
                          "
                        >
                          {idx + 1}
                        </div>

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-gray-800
                          "
                        >
                          Medicine {idx + 1}
                        </span>

                      </div>

                      {editable && !isDownloading && (
                        <button
                          type="button"
                          onClick={() =>
                            removeRow(actualIndex)
                          }
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-md
                            text-xl
                            font-semibold
                            text-red-500
                            hover:bg-red-50
                          "
                        >
                          ×
                        </button>
                      )}

                    </div>

                    {/* MEDICINE NAME */}

                    <div className="mb-3 w-full">

                      <label
                        className="
                          mb-1
                          block
                          text-xs
                          font-medium
                          text-gray-600
                        "
                      >
                        Medicine Name
                      </label>

                      {renderInput({
                        idx: actualIndex,
                        field: "name",
                        value: row.name,
                        placeholder: "Enter medicine name",
                        type: "name",
                      })}

                    </div>

                    {/* DOSE + UNIT */}

                    <div
                      className="
                        mb-3
                        grid
                        w-full
                        grid-cols-2
                        gap-3
                      "
                    >

                      {/* DOSE */}

                      <div className="min-w-0">

                        <label
                          className="
                            mb-1
                            block
                            text-xs
                            font-medium
                            text-gray-600
                          "
                        >
                          Dose
                        </label>

                        {renderInput({
                          idx: actualIndex,
                          field: "dose",
                          value: row.dose,
                          placeholder: "Dose",
                          type: "dose",
                        })}

                      </div>

                      {/* UNIT */}

                      <div className="min-w-0">

                        <label
                          className="
                            mb-1
                            block
                            text-xs
                            font-medium
                            text-gray-600
                          "
                        >
                          Unit
                        </label>

                        {renderSelect({
                          idx: actualIndex,
                          field: "unit",
                          value: row.unit,
                          placeholder: "Select unit",
                          type: "unit",
                        })}

                      </div>

                    </div>

                    {/* FREQUENCY */}

                    <div className="mb-3 w-full">

                      <label
                        className="
                          mb-1
                          block
                          text-xs
                          font-medium
                          text-gray-600
                        "
                      >
                        Frequency
                      </label>

                      {renderSelect({
                        idx: actualIndex,
                        field: "freq",
                        value: row.freq,
                        placeholder: "Select frequency",
                        type: "freq",
                      })}

                    </div>

                    {/* INSTRUCTIONS */}

                    <div className="w-full">

                      <label
                        className="
                          mb-1
                          block
                          text-xs
                          font-medium
                          text-gray-600
                        "
                      >
                        Instructions
                      </label>

                      {renderSelect({
                        idx: actualIndex,
                        field: "instr",
                        value: row.instr,
                        placeholder: "Select instruction",
                        type: "instr",
                      })}

                    </div>

                  </div>
                );
              })}

            </div>

          ) : (

            <div
              className="
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-8
                text-center
                text-sm
                text-gray-500
              "
            >
              No medicine found
            </div>

          )}

        </div>

        {/* =====================================================
            ADD MEDICINE
        ===================================================== */}

        {editable && !isDownloading && (
          <div className="mt-4 flex justify-end">

            <button
              type="button"
              onClick={addRow}
              className="
                rounded-md
                bg-[#1e6658]
                px-4
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:bg-[#155044]
                active:scale-[0.98]
              "
            >
              + Add Medicine
            </button>

          </div>
        )}

      </div>
    );
  }