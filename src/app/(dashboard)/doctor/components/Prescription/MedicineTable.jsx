"use client";

import React, { useEffect, useRef, useState } from "react";

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function MedicineTable({
  rows = [],
  editable = true,
  isDownloading = false,
  addRow,
  removeRow,
  setRows,
  optionsMap = {},
}) {
  const medicineInputRef = useRef(null);

  const [medicineSearchOpen, setMedicineSearchOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  // ============================================================
  // OPTIONS
  // ============================================================

  const getOptions = (type) => {
    const options = optionsMap?.[type];

    if (!Array.isArray(options)) {
      return [];
    }

    return options
      .filter(
        (item) =>
          item !== null &&
          item !== undefined &&
          String(item).trim() !== ""
      )
      .map((item) => String(item));
  };

  // ============================================================
  // CHECK ROW
  // ============================================================

  const isRowFilled = (row) => {
    if (!row) return false;

    return Boolean(
      String(row?.name || "").trim() ||
        String(row?.dose || "").trim() ||
        String(row?.unit || "").trim() ||
        String(row?.freq || "").trim() ||
        String(row?.instr || "").trim() ||
        String(row?.duration || "").trim()
    );
  };

  // ============================================================
  // CURRENT ROW
  // Last row = editor
  // Previous rows = added medicines
  // ============================================================

  const currentRowIndex =
    rows.length > 0 ? rows.length - 1 : -1;

  const currentRow =
    currentRowIndex >= 0
      ? rows[currentRowIndex]
      : null;

  const committedRows =
    rows.length > 1
      ? rows.slice(0, -1).filter(isRowFilled)
      : [];

const downloadRows = rows.filter(
  (row) => row?.name?.trim()
);

  // ============================================================
  // UPDATE ROW
  // ============================================================

  const updateRow = (idx, field, value) => {
    if (idx < 0) return;

    setRows((previousRows) => {
      const updatedRows = [...previousRows];

      updatedRows[idx] = {
        ...updatedRows[idx],
        [field]: value,
      };

      return updatedRows;
    });
  };

  // ============================================================
  // MEDICINE OPTIONS / SEARCH
  // ============================================================

  const medicineOptions = getOptions("name");

  const medicineQuery = String(
    currentRow?.name || ""
  ).trim();

  const filteredMedicineOptions =
    medicineQuery.length > 0
      ? medicineOptions
          .filter((option) =>
            option
              .toLowerCase()
              .includes(medicineQuery.toLowerCase())
          )
          .slice(0, 8)
      : medicineOptions.slice(0, 8);

  // ============================================================
  // SELECT MEDICINE
  // ============================================================

  const selectMedicine = (medicine) => {
    if (currentRowIndex < 0) return;

    updateRow(
      currentRowIndex,
      "name",
      medicine
    );

    setMedicineSearchOpen(false);
    setActiveSuggestion(-1);

    requestAnimationFrame(() => {
      medicineInputRef.current?.focus();
    });
  };

  // ============================================================
  // MEDICINE KEYBOARD
  // ============================================================

  const handleMedicineKeyDown = (event) => {
    if (
      !medicineSearchOpen ||
      filteredMedicineOptions.length === 0
    ) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveSuggestion((prev) => {
        if (
          prev >=
          filteredMedicineOptions.length - 1
        ) {
          return 0;
        }

        return prev + 1;
      });
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveSuggestion((prev) => {
        if (prev <= 0) {
          return (
            filteredMedicineOptions.length - 1
          );
        }

        return prev - 1;
      });
    }

    if (
      event.key === "Enter" &&
      activeSuggestion >= 0
    ) {
      event.preventDefault();

      selectMedicine(
        filteredMedicineOptions[
          activeSuggestion
        ]
      );
    }

    if (event.key === "Escape") {
      setMedicineSearchOpen(false);
      setActiveSuggestion(-1);
    }
  };

  // ============================================================
  // ADD MEDICINE
  // ============================================================

  const handleAddMedicine = () => {
    if (!currentRow) {
      if (typeof addRow === "function") {
        addRow();
      }

      return;
    }

    const medicineName = String(
      currentRow?.name || ""
    ).trim();

    if (!medicineName) {
      medicineInputRef.current?.focus();
      return;
    }

    setMedicineSearchOpen(false);
    setActiveSuggestion(-1);

    if (typeof addRow === "function") {
      addRow();
    }
  };

  // ============================================================
  // AUTO FOCUS AFTER NEW ROW
  // ============================================================

  const previousRowsLengthRef = useRef(
    rows.length
  );

  useEffect(() => {
    if (
      rows.length >
      previousRowsLengthRef.current
    ) {
      requestAnimationFrame(() => {
        medicineInputRef.current?.focus();
      });
    }

    previousRowsLengthRef.current =
      rows.length;
  }, [rows.length]);

  // ============================================================
  // REMOVE
  // ============================================================

  const handleRemove = (index) => {
    if (typeof removeRow === "function") {
      removeRow(index);
      return;
    }

    setRows((previousRows) =>
      previousRows.filter(
        (_, idx) => idx !== index
      )
    );
  };

  // ============================================================
  // NORMAL INPUT
  //
  // IMPORTANT:
  // This is a render function, not a nested React component.
  // Therefore typing won't remount the input.
  // ============================================================

  const renderInput = ({
    label,
    field,
    value,
    placeholder,
    type = "text",
  }) => {
    return (
      <div className="min-w-0">
        <label
          className="
            mb-1.5
            block
            text-[12px]
            font-medium
            text-gray-600
          "
        >
          {label}
        </label>

        <input
          type="text"
          value={value || ""}
          onChange={(event) =>
            updateRow(
              currentRowIndex,
              field,
              event.target.value
            )
          }
          placeholder={placeholder}
          disabled={!editable}
          autoComplete="off"
          className="
            h-[40px]
            w-full
            min-w-0
            rounded-md
            border
            border-gray-300
            bg-white
            px-3
            text-[13px]
            text-gray-800
            outline-none
            transition-colors
            placeholder:text-gray-400
            hover:border-gray-400
            focus:border-[#07876A]
            focus:ring-2
            focus:ring-[#07876A]/10
            disabled:cursor-not-allowed
            disabled:bg-gray-50
            disabled:text-gray-500
          "
        />
      </div>
    );
  };

  // ============================================================
  // MEDICINE AUTOCOMPLETE
  // ============================================================

  const renderMedicineInput = () => {
    return (
      <div className="relative min-w-0">
        <label
          className="
            mb-1.5
            block
            text-[12px]
            font-medium
            text-gray-600
          "
        >
          Medicine Name
          <span className="ml-0.5 text-red-500">
            *
          </span>
        </label>

        <div className="relative">
          <input
            ref={medicineInputRef}
            type="text"
            value={currentRow?.name || ""}
            onChange={(event) => {
              updateRow(
                currentRowIndex,
                "name",
                event.target.value
              );

              setMedicineSearchOpen(true);
              setActiveSuggestion(-1);
            }}
            onFocus={() => {
              if (
                medicineOptions.length > 0
              ) {
                setMedicineSearchOpen(true);
              }
            }}
            onKeyDown={
              handleMedicineKeyDown
            }
            onBlur={() => {
              // Small delay allows mouse click
              // on a suggestion before closing.
              setTimeout(() => {
                setMedicineSearchOpen(false);
                setActiveSuggestion(-1);
              }, 150);
            }}
            placeholder="Enter medicine name"
            disabled={!editable}
            autoComplete="off"
            className="
              h-[40px]
              w-full
              rounded-md
              border
              border-gray-300
              bg-white
              px-3
              pr-9
              text-[13px]
              text-gray-800
              outline-none
              transition-colors
              placeholder:text-gray-400
              hover:border-gray-400
              focus:border-[#07876A]
              focus:ring-2
              focus:ring-[#07876A]/10
              disabled:bg-gray-50
            "
          />

          {/* dropdown arrow */}

          {medicineOptions.length > 0 && (
            <button
              type="button"
              tabIndex={-1}
              onMouseDown={(event) => {
                event.preventDefault();

                setMedicineSearchOpen(
                  (prev) => !prev
                );
              }}
              className="
                absolute
                right-0
                top-0
                flex
                h-full
                w-9
                items-center
                justify-center
                text-gray-400
                hover:text-gray-600
              "
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          )}
        </div>

        {/* SUGGESTIONS */}

        {medicineSearchOpen &&
          medicineOptions.length > 0 && (
            <div
              className="
                absolute
                left-0
                right-0
                top-full
                z-50
                mt-1
                max-h-[220px]
                overflow-y-auto
                rounded-md
                border
                border-gray-200
                bg-white
                py-1
                shadow-lg
              "
            >
              {filteredMedicineOptions.length >
              0 ? (
                filteredMedicineOptions.map(
                  (option, index) => {
                    const selected =
                      option ===
                      currentRow?.name;

                    const active =
                      index ===
                      activeSuggestion;

                    return (
                      <button
                        key={`${option}-${index}`}
                        type="button"
                        onMouseDown={(
                          event
                        ) => {
                          event.preventDefault();

                          selectMedicine(
                            option
                          );
                        }}
                        className={`
                          flex
                          w-full
                          items-center
                          justify-between
                          px-3
                          py-2
                          text-left
                          text-[13px]
                          transition-colors

                          ${
                            active
                              ? "bg-[#EDF7F2] text-[#07876A]"
                              : "text-gray-700 hover:bg-gray-50"
                          }
                        `}
                      >
                        <span className="truncate">
                          {option}
                        </span>

                        {selected && (
                          <span
                            className="
                              ml-2
                              shrink-0
                              text-[#07876A]
                            "
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  }
                )
              ) : (
                <div
                  className="
                    px-3
                    py-3
                    text-center
                    text-[12px]
                    text-gray-400
                  "
                >
                  No matching medicine
                </div>
              )}
            </div>
          )}
      </div>
    );
  };

  // ============================================================
  // SELECT
  // ============================================================

  const renderSelect = ({
    label,
    field,
    value,
    placeholder,
    type,
  }) => {
    const options = getOptions(type);

    const hasValue =
      String(value || "").trim() !== "";

    return (
      <div className="min-w-0">
        <label
          className="
            mb-1.5
            block
            text-[12px]
            font-medium
            text-gray-600
          "
        >
          {label}
        </label>

        <div className="relative">
          <select
            value={value || ""}
            onChange={(event) =>
              updateRow(
                currentRowIndex,
                field,
                event.target.value
              )
            }
            disabled={!editable}
            className={`
              h-[40px]
              w-full
              min-w-0
              appearance-none
              rounded-md
              border
              border-gray-300
              bg-white
              px-3
              pr-9
              text-[13px]
              outline-none
              transition-colors

              hover:border-gray-400

              focus:border-[#07876A]
              focus:ring-2
              focus:ring-[#07876A]/10

              disabled:cursor-not-allowed
              disabled:bg-gray-50

              ${
                hasValue
                  ? "text-gray-800"
                  : "text-gray-400"
              }
            `}
          >
            {/* PLACEHOLDER */}

            <option
              value=""
              disabled
              hidden
            >
              {placeholder}
            </option>

            {/* OPTIONS */}

            {options.map(
              (option, index) => (
                <option
                  key={`${type}-${option}-${index}`}
                  value={option}
                  className="text-gray-800"
                >
                  {option}
                </option>
              )
            )}
          </select>

          {/* CUSTOM ARROW */}

          <div
            className="
              pointer-events-none
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // MEDICINE DISPLAY
  // ============================================================

  const renderMedicineDisplay = ({
    row,
    index,
    actualIndex = index,
    showRemove = false,
  }) => {
    const medicineTitle = [
      row?.name,
      row?.dose,
      row?.unit,
    ]
      .filter(
        (value) =>
          String(value || "").trim() !== ""
      )
      .join(" ");

    const instructions = [
      row?.freq,
      row?.instr,
      row?.duration,
    ]
      .filter(
        (value) =>
          String(value || "").trim() !== ""
      )
      .join(" • ");

    return (
      <div
        key={
          row?.id ||
          `medicine-display-${actualIndex}`
        }
        className="
          flex
          w-full
          items-start
          gap-2.5
          border-b
          border-gray-100
          py-2.5
          last:border-b-0
        "
      >
        {/* NUMBER */}

        <div
          className="
            flex
            h-5
            min-w-[20px]
            items-center
            pt-[1px]
            text-[13px]
            font-medium
            text-gray-500
          "
        >
          {index + 1}.
        </div>

        {/* CONTENT */}

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <div
            className="
              text-[14px]
              font-semibold
              leading-5
              text-gray-800
            "
          >
            {medicineTitle}
          </div>

          {instructions && (
            <div
              className="
                mt-0.5
                text-[12px]
                leading-5
                text-gray-500
              "
            >
              {instructions}
            </div>
          )}
        </div>

        {/* REMOVE */}

        {showRemove &&
          editable &&
          !isDownloading && (
            <button
              type="button"
              title="Remove medicine"
              aria-label={`Remove medicine ${
                index + 1
              }`}
              onClick={() =>
                handleRemove(actualIndex)
              }
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-md
                text-lg
                leading-none
                text-red-400
                transition-colors
                hover:bg-red-50
                hover:text-red-600
              "
            >
              ×
            </button>
          )}
      </div>
    );
  };

  // ============================================================
  // PDF / DOWNLOAD
  // ============================================================

  if (isDownloading) {
    if (downloadRows.length === 0) {
      return null;
    }

    return (
      <div className="w-full">
        {/* HEADING */}

        <div
          className="
            mb-1
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              font-serif
              text-[22px]
              italic
              leading-none
              text-[#5B2AA8]
            "
          >
            ℞
          </span>

          <span
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-gray-400
            "
          >
            Prescription
          </span>
        </div>

        {/* MEDICINES */}

        <div>
          {downloadRows.map(
            (row, index) =>
              renderMedicineDisplay({
                row,
                index,
                actualIndex: index,
                showRemove: false,
              })
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // NORMAL VIEW
  // ============================================================

  return (
    <div className="w-full min-w-0">
      {/* ======================================================
          ADDED MEDICINES
      ====================================================== */}

      {committedRows.length > 0 && (
        <div className="mb-4">
          {/* TITLE */}

          <div
            className="
              mb-1
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                font-serif
                text-[22px]
                italic
                leading-none
                text-[#5B2AA8]
              "
            >
              ℞
            </span>

            <span
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-gray-400
              "
            >
              Prescription
            </span>
          </div>

          {/* LIST */}

          <div
            className="
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3
            "
          >
            {committedRows.map(
              (row, index) =>
                renderMedicineDisplay({
                  row,
                  index,
                  actualIndex: index,
                  showRemove: true,
                })
            )}
          </div>
        </div>
      )}

      {/* ======================================================
          CURRENT MEDICINE FORM
      ====================================================== */}

      {currentRow ? (
        <div
          className="
            overflow-visible
            rounded-lg
            border
            border-gray-200
            bg-white
          "
        >
          {/* HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              rounded-t-lg
              border-b
              border-gray-200
              bg-[#EDF7F2]
              px-3
              py-2
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <div
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-[#07876A]
                  text-[11px]
                  font-semibold
                  text-white
                "
              >
                {committedRows.length + 1}
              </div>

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-gray-800
                "
              >
                Medicine Details
              </span>
            </div>

            <span
              className="
                text-[11px]
                text-gray-500
              "
            >
              #{committedRows.length + 1}
            </span>
          </div>

          {/* ==================================================
              DESKTOP FORM
          ================================================== */}

          <div className="hidden p-3 md:block">
            <div
              className="
                grid
                grid-cols-[2fr_0.85fr_0.9fr_1.25fr_1.4fr_1fr]
                gap-2.5
              "
            >
              {/* MEDICINE */}

              {renderMedicineInput()}

              {/* DOSE */}

              {renderInput({
                label: "Dose",
                field: "dose",
                value: currentRow?.dose,
                placeholder: "650",
              })}

              {/* UNIT */}

              {renderSelect({
                label: "Unit",
                field: "unit",
                value: currentRow?.unit,
                placeholder: "Select",
                type: "unit",
              })}

              {/* FREQUENCY */}

              {renderSelect({
                label: "Frequency",
                field: "freq",
                value: currentRow?.freq,
                placeholder: "Select frequency",
                type: "freq",
              })}

              {/* INSTRUCTION */}

              {renderSelect({
                label: "Instruction",
                field: "instr",
                value: currentRow?.instr,
                placeholder: "Select instruction",
                type: "instr",
              })}

              {/* DURATION */}

              {renderInput({
                label: "Duration",
                field: "duration",
                value: currentRow?.duration,
                placeholder: "3 days",
              })}
            </div>
          </div>

          {/* ==================================================
              MOBILE FORM
          ================================================== */}

          <div className="p-3 md:hidden">
            <div className="space-y-3">
              {/* MEDICINE */}

              {renderMedicineInput()}

              {/* DOSE + UNIT */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2.5
                "
              >
                {renderInput({
                  label: "Dose",
                  field: "dose",
                  value: currentRow?.dose,
                  placeholder: "650",
                })}

                {renderSelect({
                  label: "Unit",
                  field: "unit",
                  value: currentRow?.unit,
                  placeholder: "Select unit",
                  type: "unit",
                })}
              </div>

              {/* FREQUENCY */}

              {renderSelect({
                label: "Frequency",
                field: "freq",
                value: currentRow?.freq,
                placeholder: "Select frequency",
                type: "freq",
              })}

              {/* INSTRUCTION */}

              {renderSelect({
                label: "Instruction",
                field: "instr",
                value: currentRow?.instr,
                placeholder: "Select instruction",
                type: "instr",
              })}

              {/* DURATION */}

              {renderInput({
                label: "Duration",
                field: "duration",
                value: currentRow?.duration,
                placeholder: "e.g. 3 days",
              })}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="
            rounded-lg
            border
            border-dashed
            border-gray-300
            bg-gray-50
            px-4
            py-5
            text-center
            text-[13px]
            text-gray-500
          "
        >
          No medicine entry available.
        </div>
      )}

      {/* ======================================================
          ADD MEDICINE BUTTON
      ====================================================== */}

      {editable && (
        <div
          className="
            mt-3
            flex
            justify-end
          "
        >
          <button
            type="button"
            onClick={handleAddMedicine}
            disabled={
              currentRow
                ? !String(
                    currentRow?.name || ""
                  ).trim()
                : false
            }
            className="
              inline-flex
              h-[38px]
              items-center
              justify-center
              gap-1.5
              rounded-md
              bg-[#07876A]
              px-4
              text-[13px]
              font-semibold
              text-white
              shadow-sm
              transition-all
              hover:bg-[#06755C]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:bg-gray-300
              disabled:text-gray-500
              disabled:shadow-none
            "
          >
            <span className="text-[17px] font-normal leading-none">
              +
            </span>

            Add Medicine
          </button>
        </div>
      )}
    </div>
  );
}