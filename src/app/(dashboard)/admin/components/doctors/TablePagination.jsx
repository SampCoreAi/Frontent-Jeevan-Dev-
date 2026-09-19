"use client";

import {
  Box,
  Typography,
  IconButton,
} from "@mui/material";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function TablePagination({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  count = 0,
  onPageChange,
}) {

  const startItem =
    total > 0 ? (page - 1) * limit + 1 : 0;

  const endItem =
    total > 0
      ? Math.min(page * limit, total)
      : 0;

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange?.(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange?.(page + 1);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",

        mt: 1.5,

        display: "flex",

        flexDirection: {
          xs: "column",
          sm: "row",
        },

        alignItems: {
          xs: "flex-start",
          sm: "center",
        },

        justifyContent: "space-between",

        gap: 1.2,
      }}
    >
      {/* =====================================
          LEFT INFO
      ====================================== */}

     <Typography
  sx={{
    fontSize: 11,
    color: "text.fourth",
  }}
>
  Showing{" "}
  <b>{startItem}-{endItem}</b>{" "}
  of <b>{total}</b> doctors
</Typography>

      {/* =====================================
          RIGHT PAGINATION
      ====================================== */}

      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {/* PREVIOUS */}

          <IconButton
            disabled={page === 1}
            onClick={handlePrevious}
            sx={{
              width: 30,
              height: 30,

              border: "1px solid #DDE7E3",
              borderRadius: "7px",

              bgcolor: "#FFFFFF",
              color: "#596575",

              "&:hover": {
                bgcolor: "#EAF7F2",
                borderColor: "#BFE4D8",
                color: "#07876A",
              },

              "&.Mui-disabled": {
                opacity: 0.4,
              },
            }}
          >
            <KeyboardArrowLeftIcon
              sx={{
                fontSize: 18,
              }}
            />
          </IconButton>

          {/* PAGE NUMBERS */}

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((pageNumber) => {
            const isActive =
              pageNumber === page;

            return (
              <Box
                key={pageNumber}
                component="button"
                type="button"
                onClick={() =>
                  onPageChange?.(pageNumber)
                }
                sx={{
                  width: 30,
                  height: 30,

                  p: 0,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  border: "1px solid",

                  borderColor: isActive
                    ? "#07876A"
                    : "#DDE7E3",

                  borderRadius: "7px",

                  bgcolor: isActive
                    ? "#07876A"
                    : "#FFFFFF",

                  color: isActive
                    ? "#FFFFFF"
                    : "#596575",

                  fontFamily: "inherit",

                  fontSize: "11px",
                  fontWeight: isActive
                    ? 600
                    : 500,

                  cursor: "pointer",

                  transition:
                    "all 0.15s ease",

                  "&:hover": {
                    bgcolor: isActive
                      ? "#07876A"
                      : "#EAF7F2",

                    borderColor:
                      "#07876A",

                    color: isActive
                      ? "#FFFFFF"
                      : "#07876A",
                  },
                }}
              >
                {pageNumber}
              </Box>
            );
          })}

          {/* NEXT */}

          <IconButton
            disabled={page === totalPages}
            onClick={handleNext}
            sx={{
              width: 30,
              height: 30,

              border: "1px solid #DDE7E3",
              borderRadius: "7px",

              bgcolor: "#FFFFFF",
              color: "#596575",

              "&:hover": {
                bgcolor: "#EAF7F2",
                borderColor: "#BFE4D8",
                color: "#07876A",
              },

              "&.Mui-disabled": {
                opacity: 0.4,
              },
            }}
          >
            <KeyboardArrowRightIcon
              sx={{
                fontSize: 18,
              }}
            />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}