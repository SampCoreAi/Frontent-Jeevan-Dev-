export const PRIMARY_COLOR = "#1E6658";
export const WHITE = "#fff";
export const TEXT_COLOR = "#000";
export const BORDER_COLOR = "#777";

export const inputStyle = {
  "& .MuiInputBase-input": { color: TEXT_COLOR },
  "& .MuiInputLabel-root": { color: TEXT_COLOR },
  "& .MuiInputLabel-root.Mui-focused": { color: PRIMARY_COLOR },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: BORDER_COLOR },
    "&:hover fieldset": { borderColor: PRIMARY_COLOR },
    "&.Mui-focused fieldset": {
      borderColor: PRIMARY_COLOR,
      borderWidth: "2px",
    },
  },
  "& .MuiInput-underline:before": { borderBottomColor: BORDER_COLOR },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: PRIMARY_COLOR,
  },
  "& .MuiInput-underline:after": { borderBottomColor: PRIMARY_COLOR },
};

export const autocompleteStyle = {
  "& .MuiInputBase-root": { color: TEXT_COLOR },
  "& .MuiInput-underline:before": { borderBottomColor: BORDER_COLOR },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: PRIMARY_COLOR,
  },
  "& .MuiInput-underline:after": { borderBottomColor: PRIMARY_COLOR },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: BORDER_COLOR },
    "&:hover fieldset": { borderColor: PRIMARY_COLOR },
    "&.Mui-focused fieldset": { borderColor: PRIMARY_COLOR },
  },
  "& .MuiAutocomplete-popupIndicator": { color: PRIMARY_COLOR },
  "& .MuiAutocomplete-clearIndicator": { color: PRIMARY_COLOR },
};

export const dateInputStyle = {
  "& .MuiInputBase-input": { color: TEXT_COLOR },
  "& .MuiInputLabel-root": { color: TEXT_COLOR },
  "& .MuiInputLabel-root.Mui-focused": { color: PRIMARY_COLOR },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: BORDER_COLOR },
    "&:hover fieldset": { borderColor: PRIMARY_COLOR },
    "&.Mui-focused fieldset": {
      borderColor: PRIMARY_COLOR,
      borderWidth: "2px",
    },
  },
  "& .MuiIconButton-root": { color: PRIMARY_COLOR },
  "& .MuiIconButton-root:hover": {
    color: PRIMARY_COLOR,
    backgroundColor: "rgba(30, 102, 88, 0.08)",
  },
  "& .MuiSvgIcon-root": { color: PRIMARY_COLOR },
};

export const datePickerPopupStyle = {
  "& .MuiPaper-root": { backgroundColor: WHITE },
  "& .MuiPickersCalendarHeader-root": { color: TEXT_COLOR },
  "& .MuiPickersCalendarHeader-label": { color: TEXT_COLOR, fontWeight: 600 },
  "& .MuiPickersCalendarHeader-switchViewButton": { color: PRIMARY_COLOR },
  "& .MuiPickersArrowSwitcher-button": { color: PRIMARY_COLOR },
  "& .MuiArrowSwitcher-button:hover": {
    backgroundColor: "rgba(30, 102, 88, 0.08)",
  },
  "& .MuiDayCalendar-weekDayLabel": { color: TEXT_COLOR },
  "& .MuiPickersDay-root": { color: TEXT_COLOR },
  "& .MuiPickersDay-root.Mui-selected": {
    backgroundColor: `${PRIMARY_COLOR} !important`,
    color: `${WHITE} !important`,
  },
  "& .MuiPickersDay-root.Mui-selected:hover": {
    backgroundColor: `${PRIMARY_COLOR} !important`,
  },
  "& .MuiPickersDay-root.MuiPickersDay-today": { borderColor: PRIMARY_COLOR },
  "& .MuiPickersLayout-actionBar button": {
    color: `${PRIMARY_COLOR} !important`,
  },
  "& .MuiDialogActions-root button": {
    color: `${PRIMARY_COLOR} !important`,
  },
  "& .MuiSvgIcon-root": { color: PRIMARY_COLOR },
  "& .MuiButtonBase-root:focus": { outline: "none" },
  "& .MuiButtonBase-root.Mui-focusVisible": {
    outline: `2px solid ${PRIMARY_COLOR}`,
    outlineOffset: "-2px",
  },
  "& .MuiPickersMonth-monthButton": { color: TEXT_COLOR },
  "& .MuiPickersMonth-monthButton.Mui-selected": {
    backgroundColor: `${PRIMARY_COLOR} !important`,
    color: `${WHITE} !important`,
  },
  "& .MuiPickersYear-yearButton": { color: TEXT_COLOR },
  "& .MuiPickersYear-yearButton.Mui-selected": {
    backgroundColor: `${PRIMARY_COLOR} !important`,
    color: `${WHITE} !important`,
  },
};
