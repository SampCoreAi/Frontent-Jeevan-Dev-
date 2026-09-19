
"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Avatar,
  Box,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Rating,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {
  alpha,
  useTheme,
} from "@mui/material/styles";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import api from "../../services/api";

// ============================================================
// PROFILE SIDEBAR
// ============================================================

const ProfileSidebar = ({
  profileData,
  isEditing,
  editingChip,
  onFieldChange,
  onChipClick,
  onChipSave,
  onRatingChange,
  onOnlineVisibilityChange,
  onAvatarChange,
}) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  // ============================================================
  // REFS
  // ============================================================

  const fileInputRef = useRef(null);

  /*
   * Ye DB/API se already saved username ko remember karega.
   *
   * Example:
   * savedUsername = "aditya"
   *
   * Edit click -> API call nahi
   * age change -> API call nahi
   * qualification change -> API call nahi
   *
   * username "aditya1" -> API call
   *
   * wapas "aditya" -> API call nahi
   */
  const savedUsernameRef = useRef("");

  // ============================================================
  // STATES
  // ============================================================

  const [usernameAvailable, setUsernameAvailable] =
    useState(null);

  const [checkingUsername, setCheckingUsername] =
    useState(false);

  const [usernameMessage, setUsernameMessage] =
    useState("");

  /*
   * User ne current edit session me username field
   * actually change ki hai ya nahi.
   */
  const [usernameTouched, setUsernameTouched] =
    useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const [showFolder, setShowFolder] =
    useState(false);

  const [localUser, setLocalUser] =
    useState(null);

  const [isHydrated, setIsHydrated] =
    useState(false);

  const open = Boolean(anchorEl);

  // ============================================================
  // LOCAL STORAGE USER
  // ============================================================

  useEffect(() => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      setLocalUser(user);
    } catch {
      setLocalUser({});
    }

    setIsHydrated(true);
  }, []);

  // ============================================================
  // DISPLAY NAME
  // ============================================================

  const displayName = isHydrated
    ? profileData?.name ||
      localUser?.name ||
      localUser?.full_name ||
      "Doctor"
    : profileData?.name || "Doctor";

  const avatarInitial =
    displayName && displayName !== "Doctor"
      ? displayName
          .charAt(0)
          .toUpperCase()
      : "D";

  // ============================================================
  // SAVED USERNAME
  // ============================================================

  /*
   * IMPORTANT:
   *
   * Jab edit mode OFF hai tab jo username profileData me hai,
   * usko hum DB/API ka saved username maan rahe hain.
   *
   * Edit mode start hote hi ye value freeze ho jayegi.
   */

  useEffect(() => {
    if (isEditing) return;

    const savedUsername =
      profileData?.username
        ?.replace(/^@/, "")
        .trim() || "";

    savedUsernameRef.current =
      savedUsername;

    setUsernameTouched(false);

    setUsernameAvailable(null);

    setUsernameMessage("");

    setCheckingUsername(false);
  }, [
    isEditing,
    profileData?.username,
  ]);

  // ============================================================
  // USERNAME AVAILABILITY CHECK
  // ============================================================

  useEffect(() => {
    /*
     * Edit mode nahi hai:
     * username check ki zarurat nahi.
     */
    if (!isEditing) {
      return;
    }

    /*
     * User ne username input ko touch/change hi nahi kiya.
     *
     * Edit button click karne par yahin return ho jayega.
     */
    if (!usernameTouched) {
      return;
    }

    const username =
      profileData?.username
        ?.replace(/^@/, "")
        .trim() || "";

    const savedUsername =
      savedUsernameRef.current
        ?.replace(/^@/, "")
        .trim() || "";

    // ------------------------------------------------------------
    // EMPTY USERNAME
    // ------------------------------------------------------------

    if (!username) {
      setUsernameAvailable(null);

      setUsernameMessage("");

      setCheckingUsername(false);

      return;
    }

    // ------------------------------------------------------------
    // SAME AS CURRENT SAVED USERNAME
    // ------------------------------------------------------------
    /*
     * Example:
     *
     * DB username = aditya
     *
     * user:
     * aditya -> aditya123 -> aditya
     *
     * Last "aditya" isi user ka username hai.
     *
     * Isliye:
     * ❌ API call nahi
     * ❌ Already taken nahi
     */

    if (
      savedUsername &&
      username.toLowerCase() ===
        savedUsername.toLowerCase()
    ) {
      setUsernameAvailable(null);

      setUsernameMessage("");

      setCheckingUsername(false);

      return;
    }

    // ------------------------------------------------------------
    // MINIMUM LENGTH
    // ------------------------------------------------------------

    if (username.length < 3) {
      setUsernameAvailable(false);

      setUsernameMessage(
        "Username must be at least 3 characters"
      );

      setCheckingUsername(false);

      return;
    }

    // ------------------------------------------------------------
    // DEBOUNCE
    // ------------------------------------------------------------

    const timer = setTimeout(
      async () => {
        try {
          setCheckingUsername(true);

          setUsernameAvailable(null);

          setUsernameMessage(
            "Checking availability..."
          );

          const response =
            await api.get(
              "/api/doctors/check-username",
              {
                params: {
                  username,
                },
              }
            );

          const available =
            Boolean(
              response?.data?.available
            );

          setUsernameAvailable(
            available
          );

          if (available) {
            setUsernameMessage(
              "Username is available"
            );
          } else {
            setUsernameMessage(
              "Username is already taken"
            );
          }
        } catch (error) {
          console.error(
            "Username check error:",
            error
          );

          setUsernameAvailable(null);

          setUsernameMessage(
            error?.response?.data
              ?.message ||
              "Unable to check username"
          );
        } finally {
          setCheckingUsername(
            false
          );
        }
      },
      500
    );

    return () =>
      clearTimeout(timer);
  }, [
    profileData?.username,
    isEditing,
    usernameTouched,
  ]);

  // ============================================================
  // AVATAR
  // ============================================================

  const handleAvatarFlip = () => {
    setShowFolder(
      (prev) => !prev
    );
  };

  const handleCameraClick = (
    event
  ) => {
    if (!isEditing) return;

    setAnchorEl(
      event.currentTarget
    );
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateAvatar = () => {
    handleMenuClose();

    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    handleMenuClose();

    if (onAvatarChange) {
      onAvatarChange(null);
    }
  };

  const handleFileChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (
      file &&
      onAvatarChange
    ) {
      onAvatarChange(file);
    }

    event.target.value = "";
  };

  // ============================================================
  // USERNAME CHANGE
  // ============================================================

  const handleUsernameChange = (
    event
  ) => {
    /*
     * @ aur spaces automatically remove.
     */

    const value =
      event.target.value
        .replace(/^@/, "")
        .replace(/\s/g, "");

    /*
     * Ab hum jaante hain ki user ne
     * username input actually modify kiya.
     */

    setUsernameTouched(true);

    /*
     * Previous availability result immediately remove.
     */

    setUsernameAvailable(null);

    setUsernameMessage("");

    setCheckingUsername(false);

    onFieldChange?.(
      "username",
      value
    );
  };

  // ============================================================
  // COMMON UI STYLES
  // ============================================================

  const infoRowSx = {
    width: "100%",

    display: "flex",

    alignItems: {
      xs: "flex-start",
      sm: "center",
    },

    flexDirection: {
      xs: "column",
      sm: "row",
    },

    gap: {
      xs: "5px",
      sm: "8px",
    },

    px: "12px",

    py: "12px",

    mb: "6px",

    border: "1px solid",

    borderColor: "divider",

    borderRadius: "8px",

    bgcolor: "#f7f9f9",

    transition:
      "border-color 0.2s ease, background-color 0.2s ease",

    "&:hover": {
      borderColor: alpha(
        theme.palette.primary.main,
        0.28
      ),

      bgcolor: alpha(
        theme.palette.primary.main,
        0.015
      ),
    },
  };

  const labelSx = {
    width: {
      xs: "100%",
      sm: "95px",
    },

    minWidth: {
      sm: "95px",
    },
fontSize: "12.5px",

    lineHeight: 1.35,

    fontWeight: 650,

    color: "text.primary",

    flexShrink: 0,
  };

  const valueSx = {
    minWidth: 0,

    flex: 1,
fontSize: "12.5px",

    lineHeight: 1.4,

    fontWeight: 500,

    color: "text.secondary",

    wordBreak: "break-word",
  };

  const fieldSx = {
    flex: 1,

    width: "100%",

    "& .MuiInputBase-root": {
      minHeight: "34px",

    fontSize: "12.5px",

      bgcolor:
        "background.paper",
    },

    "& .MuiInputBase-input": {
      py: "7px",
    },

    "& .MuiOutlinedInput-notchedOutline":
      {
        borderColor: "divider",
      },

    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
      {
        borderColor:
          "primary.light",
      },

    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
      {
        borderColor:
          "primary.main",

        borderWidth: "1px",
      },

    "& .MuiFormHelperText-root":
      {
        mx: 0,

        mt: "4px",

     fontSize: "12.5px",

        lineHeight: 1.3,
      },
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Box
  sx={{
    width: {
      xs: "100%",
      lg: 300,
    },

    minWidth: {
      lg: 300,
    },

    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    p: {
      xs: "14px",
      sm: "16px",
      md: "18px",
    },

    // ✅ Color direct yahin do
    borderRight: {
      xs: "none",
      lg: "5px solid #f7f9f9",
    },

    borderBottom: {
      xs: "1px solid #f7f9f9",
      lg: "none",
    },

    bgcolor: "#FFFFFF",
    boxSizing: "border-box",
  }}
>
      {/* ======================================================
          FILE INPUT
      ====================================================== */}

      <input
        type="file"
        ref={fileInputRef}
        style={{
          display: "none",
        }}
        accept="image/*"
        onChange={
          handleFileChange
        }
      />

      {/* ======================================================
          PROFILE IMAGE / QR CARD
      ====================================================== */}

      <Box
        sx={{
          width: "100%",

          display: "flex",

          justifyContent:
            "center",

          mb: "14px",
        }}
      >
        <Box
          sx={{
            perspective: "1000px",

            position: "relative",
          }}
        >
          <Box
            onClick={
              handleAvatarFlip
            }
            sx={{
              width: {
                xs: 130,
                sm: 140,
                md: 145,
              },

              height: {
                xs: 145,
                sm: 155,
                md: 160,
              },

              position:
                "relative",

              transformStyle:
                "preserve-3d",

              transition:
                "transform 0.55s ease",

              transform:
                showFolder
                  ? "rotateY(180deg)"
                  : "rotateY(0deg)",

              cursor: "pointer",
            }}
          >
            {/* ==============================================
                FRONT
            ============================================== */}

            <Box
              sx={{
                width: "100%",

                height: "100%",

                position:
                  "absolute",

                inset: 0,

                backfaceVisibility:
                  "hidden",

                border: "1px solid",

                borderColor:
                  "divider",

                borderRadius:
                  "10px",

                bgcolor:
                  "background.paper",

                overflow: "hidden",

                boxShadow: `0 4px 14px ${alpha(
                  theme.palette.text
                    .primary,
                  0.06
                )}`,
              }}
            >
              {profileData?.avatarUrl ? (
                <Box
                  component="img"
                  src={
                    profileData.avatarUrl
                  }
                  alt="Profile"
                  sx={{
                    width: "100%",

                    height: "100%",

                    objectFit:
                      "cover",

                    display: "block",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",

                    height: "100%",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    bgcolor:
                      "secondary.light",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 78,

                      height: 78,

                      bgcolor:
                        "primary.main",

                      color:
                        "primary.contrastText",

                      fontSize:
                        "30px",

                      fontWeight:
                        700,

                      border:
                        "4px solid",

                      borderColor:
                        "background.paper",

                      boxShadow: `0 4px 12px ${alpha(
                        theme.palette
                          .primary.main,
                        0.18
                      )}`,
                    }}
                  >
                    {
                      avatarInitial
                    }
                  </Avatar>
                </Box>
              )}
            </Box>

            {/* ==============================================
                QR BACK
            ============================================== */}

            <Box
              sx={{
                width: "100%",

                height: "100%",

                position:
                  "absolute",

                inset: 0,

                transform:
                  "rotateY(180deg)",

                backfaceVisibility:
                  "hidden",

                border: "1px solid",

                borderColor:
                  "divider",

                borderRadius:
                  "10px",

                bgcolor:
                  "background.paper",

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                p: "10px",

                boxShadow: `0 4px 14px ${alpha(
                  theme.palette.text
                    .primary,
                  0.06
                )}`,
              }}
            >
              {profileData?.qrCode ? (
                <Box
                  component="img"
                  src={
                    profileData.qrCode
                  }
                  alt="QR Code"
                  sx={{
                    width: "100%",

                    height: "100%",

                    objectFit:
                      "contain",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    textAlign:
                      "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize:
                        "11px",

                      fontWeight:
                        600,

                      color:
                        "text.primary",
                    }}
                  >
                    QR Not Available
                  </Typography>

                  <Typography
                    sx={{
                      mt: "3px",

                      fontSize:
                        "9.5px",

                      color:
                        "text.secondary",
                    }}
                  >
                    QR code has not
                    been assigned yet.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* ==============================================
              CAMERA BUTTON
          ============================================== */}

          {isEditing && (
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();

                handleCameraClick(
                  event
                );
              }}
              sx={{
                position:
                  "absolute",

                right: "-7px",

                bottom: "-7px",

                width: "30px",

                height: "30px",

                bgcolor:
                  "primary.main",

                color:
                  "primary.contrastText",

                border:
                  "2px solid",

                borderColor:
                  "background.paper",

                boxShadow: `0 3px 10px ${alpha(
                  theme.palette.primary
                    .main,
                  0.22
                )}`,

                "&:hover": {
                  bgcolor:
                    "primary.dark",
                },
              }}
            >
              <CameraAltIcon
                sx={{
                  fontSize: "15px",
                }}
              />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* ======================================================
          AVATAR MENU
      ====================================================== */}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={
          handleMenuClose
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: "5px",

            minWidth: 180,

            borderRadius:
              "8px",

            border:
              "1px solid",

            borderColor:
              "divider",

            boxShadow:
              "0 8px 24px rgba(15, 23, 42, 0.08)",
          },
        }}
      >
        <MenuItem
          onClick={
            handleUpdateAvatar
          }
          sx={{
            fontSize: "11.5px",

            minHeight: "36px",
          }}
        >
          Update Profile Picture
        </MenuItem>

        {(profileData?.image ||
          profileData?.avatarUrl) && (
          <MenuItem
            onClick={
              handleRemoveAvatar
            }
            sx={{
              fontSize:
                "11.5px",

              minHeight:
                "36px",

              color:
                "error.main",
            }}
          >
            Remove Profile Picture
          </MenuItem>
        )}
      </Menu>

      {/* ======================================================
          PROFILE DETAILS
      ====================================================== */}

      <Box
        sx={{
          width: "100%",
        }}
      >
        {/* ====================================================
            NAME
        ==================================================== */}

        <Box sx={infoRowSx}>
          <Typography
            sx={labelSx}
          >
            Name
          </Typography>

          <Typography
            sx={valueSx}
          >
            {displayName}
          </Typography>
        </Box>

        {/* ====================================================
            USERNAME
        ==================================================== */}

        <Box
          sx={{
            ...infoRowSx,

            alignItems: {
              xs: "flex-start",
              sm: isEditing
                ? "flex-start"
                : "center",
            },
          }}
        >
          <Typography
            sx={{
              ...labelSx,

              mt:
                isEditing
                  ? "9px"
                  : 0,
            }}
          >
            Username
          </Typography>

          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              value={
                profileData
                  ?.username?.replace(
                    /^@/,
                    ""
                  ) || ""
              }
              placeholder="Choose username"
              onChange={
                handleUsernameChange
              }
              error={
                usernameAvailable ===
                false
              }
              helperText={
                usernameMessage
              }
              FormHelperTextProps={{
                sx: {
                  color:
                    checkingUsername
                      ? "text.secondary !important"
                      : usernameAvailable ===
                        true
                      ? "success.main !important"
                      : usernameAvailable ===
                        false
                      ? "error.main !important"
                      : "text.secondary !important",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography
                      sx={{
                        fontSize:
                          "11px",

                        fontWeight:
                          600,

                        color:
                          "text.secondary",
                      }}
                    >
                      @
                    </Typography>
                  </InputAdornment>
                ),

                endAdornment:
                  !checkingUsername &&
                  usernameAvailable !==
                    null ? (
                    <InputAdornment position="end">
                      {usernameAvailable ? (
                        <CheckCircleOutlineIcon
                          sx={{
                            fontSize:
                              "16px",

                            color:
                              "success.main",
                          }}
                        />
                      ) : (
                        <ErrorOutlineIcon
                          sx={{
                            fontSize:
                              "16px",

                            color:
                              "error.main",
                          }}
                        />
                      )}
                    </InputAdornment>
                  ) : null,
              }}
              sx={fieldSx}
            />
          ) : (
            <Typography
              sx={valueSx}
            >
              {profileData?.username
                ? `@${profileData.username.replace(
                    /^@/,
                    ""
                  )}`
                : "Not provided"}
            </Typography>
          )}
        </Box>

        {/* ====================================================
            SPECIALIST
        ==================================================== */}

        <Box sx={infoRowSx}>
          <Typography
            sx={labelSx}
          >
            Specialist
          </Typography>

          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              value={
                profileData?.chipLabel ||
                ""
              }
              onChange={(event) =>
                onFieldChange?.(
                  "chipLabel",
                  event.target.value
                )
              }
              placeholder="Enter specialization"
              onBlur={
                onChipSave
              }
              sx={fieldSx}
            />
          ) : (
            <Typography
              sx={valueSx}
            >
              {profileData?.chipLabel ||
                "Not provided"}
            </Typography>
          )}
        </Box>

        {/* ====================================================
            QUALIFICATION
        ==================================================== */}

        <Box sx={infoRowSx}>
          <Typography
            sx={labelSx}
          >
            Qualification
          </Typography>

          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              value={
                profileData
                  ?.qualification ||
                ""
              }
              onChange={(event) =>
                onFieldChange?.(
                  "qualification",
                  event.target.value
                )
              }
              placeholder="Enter qualification"
              sx={fieldSx}
            />
          ) : (
            <Typography
              sx={valueSx}
            >
              {profileData
                ?.qualification ||
                "Not provided"}
            </Typography>
          )}
        </Box>

        {/* ====================================================
            AGE
        ==================================================== */}

        <Box sx={infoRowSx}>
          <Typography
            sx={labelSx}
          >
            Age
          </Typography>

          {isEditing ? (
            <TextField
              fullWidth
              value={
                profileData?.age ||
                ""
              }
              placeholder="Enter age"
              type="number"
              size="small"
              onChange={(event) =>
                onFieldChange?.(
                  "age",
                  event.target.value
                )
              }
              inputProps={{
                min: 0,
                max: 120,
              }}
              sx={fieldSx}
            />
          ) : (
            <Typography
              sx={valueSx}
            >
              {profileData?.age ||
                "Not provided"}
            </Typography>
          )}
        </Box>

        {/* ====================================================
            GENDER
        ==================================================== */}

        <Box sx={infoRowSx}>
          <Typography
            sx={labelSx}
          >
            Gender
          </Typography>

          {isEditing ? (
            <TextField
              fullWidth
              select
              value={
                profileData?.gender ||
                ""
              }
              size="small"
              onChange={(event) =>
                onFieldChange?.(
                  "gender",
                  event.target.value
                )
              }
              sx={fieldSx}
            >
              <MenuItem
                value=""
                sx={{
                  fontSize:
                    "11.5px",
                }}
              >
                Select Gender
              </MenuItem>

              <MenuItem
                value="MALE"
                sx={{
                  fontSize:
                    "11.5px",
                }}
              >
                Male
              </MenuItem>

              <MenuItem
                value="FEMALE"
                sx={{
                  fontSize:
                    "11.5px",
                }}
              >
                Female
              </MenuItem>

              <MenuItem
                value="OTHER"
                sx={{
                  fontSize:
                    "11.5px",
                }}
              >
                Other
              </MenuItem>
            </TextField>
          ) : (
            <Typography
              sx={{
                ...valueSx,

                textTransform:
                  "capitalize",
              }}
            >
              {profileData?.gender
                ? profileData.gender
                    .toLowerCase()
                : "Not provided"}
            </Typography>
          )}
        </Box>

        {/* ====================================================
            RATING
        ==================================================== */}

        <Box
          sx={{
            ...infoRowSx,

            flexDirection: "row",

            alignItems: "center",
          }}
        >
          <Typography
            sx={labelSx}
          >
            Rating
          </Typography>

          <Box
            sx={{
              flex: 1,

              display: "flex",

              alignItems:
                "center",

              gap: "5px",
            }}
          >
            <Rating
              value={
                Number(
                  profileData?.rating
                ) || 0
              }
              precision={0.5}
              readOnly
              size="small"
              sx={{
                fontSize: "12.5px",
              }}
            />

            <Typography
              sx={{
             fontSize: "12.5px",

                color:
                  "text.secondary",

                fontWeight:
                  500,
              }}
            >
              {Number(
                profileData?.rating ||
                  0
              ).toFixed(1)}
            </Typography>
          </Box>
        </Box>

        {/* ====================================================
            EMERGENCY PATIENT
        ==================================================== */}

        <Box
          sx={{
            ...infoRowSx,

            flexDirection: "row",

            alignItems: "center",

            justifyContent:
              "space-between",
          }}
        >
          <Typography
            sx={{
              ...labelSx,

              width: "auto",

              minWidth: 0,

              flex: 1,
            }}
          >
            Accept Emergency
          </Typography>

          <FormControlLabel
            sx={{
              m: 0,

              gap: "3px",

              "& .MuiFormControlLabel-label":
                {
                fontSize: "12.5px",

                  fontWeight:
                    600,

                  color:
                    "text.secondary",
                },
            }}
            control={
              <Switch
                size="small"
                checked={Boolean(
                  profileData?.accept_emergency_patients
                )}
                disabled={
                  !isEditing
                }
                onChange={(
                  event
                ) =>
                  onFieldChange?.(
                    "accept_emergency_patients",
                    event.target
                      .checked
                  )
                }
              />
            }
            label={
              profileData?.accept_emergency_patients
                ? "Yes"
                : "No"
            }
            labelPlacement="start"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileSidebar;
