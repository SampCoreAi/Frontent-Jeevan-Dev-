"use client";
import React from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

const SidebarMenuItem = ({
  item,
  isActive,
  showLabel,
  onNavigate,
}) => {
  return (
    <Tooltip
      title={!showLabel ? item.label : ""}
      placement="right"
      arrow
    >
      <Link
        href={item?.route || "#"}
        style={{
          width: "100%",
          textDecoration: "none",
        }}
      >
        <Button
          onClick={() => onNavigate(item)}
          disableRipple
          sx={{
            position: "relative",
            width: "100%",
            minWidth: 0,
            height: "42px",
            minHeight: "42px",
            px: showLabel ? "11px" : "8px",
            display: "flex",
            justifyContent: showLabel
              ? "flex-start"
              : "center",
            alignItems: "center",
            gap: showLabel ? "10px" : 0,
            borderRadius: "8px",
            color: isActive
              ? "primary.main"
              : "text.secondary",
            bgcolor: isActive
              ? "secondary.light"
              : "transparent",
            textTransform: "none",
            overflow: "hidden",
            transition: "all 0.2s ease",
            "&::before": isActive
              ? {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: "9px",
                  width: "3px",
                  height: "24px",
                  borderRadius: "0 4px 4px 0",
                  bgcolor: "primary.main",
                }
              : {},
            "& .menu-icon": {
              width: "23px",
              minWidth: "23px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: isActive
                ? "primary.main"
                : "text.secondary",
              transition: "all 0.2s ease",
              "& svg": {
                fontSize: "19px",
              },
            },
            "& .menu-label": {
              flex: 1,
              minWidth: 0,
              textAlign: "left",
              fontSize: "12.5px",
              fontWeight: isActive ? 700 : 600,
              letterSpacing: "0.1px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
            "& .menu-arrow": {
              fontSize: "16px",
              flexShrink: 0,
              color: "primary.main",
              opacity: isActive ? 1 : 0,
              transform: isActive
                ? "translateX(0)"
                : "translateX(-4px)",
              transition: "all 0.2s ease",
            },
            "&:hover": {
              bgcolor: "secondary.light",
              color: "primary.main",
              transform: showLabel
                ? "translateX(2px)"
                : "none",
              "& .menu-icon": {
                color: "primary.main",
                transform: "scale(1.04)",
              },
              "& .menu-arrow": {
                opacity: 1,
                transform: "translateX(0)",
              },
            },
          }}
        >
          <Box className="menu-icon">
            {item.icon}
          </Box>

          {showLabel && (
            <>
              <Typography
                component="span"
                className="menu-label"
              >
                {item.label}
              </Typography>

              <ChevronRight className="menu-arrow" />
            </>
          )}
        </Button>
      </Link>
    </Tooltip>
  );
};

export default SidebarMenuItem;