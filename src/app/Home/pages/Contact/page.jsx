"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Clock3,
  Building2,
} from "lucide-react";
import Navbar from "../../components/Navbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    hospital: "",
    inquiryType: "Request a Demo",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 0,
      backgroundColor: "#f3f3f3",
      minHeight: "56px",

      "& fieldset": {
        borderColor: "transparent",
      },

      "&:hover fieldset": {
        borderColor: "#d4d4d4",
      },

      "&.Mui-focused": {
        backgroundColor: "#fff",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#111",
        borderWidth: "1px",
      },
    },

    "& input": {
      fontSize: "14px",
    },

    "& textarea": {
      fontSize: "14px",
    },

    "& input::placeholder, & textarea::placeholder": {
      color: "#999",
      opacity: 1,
    },
  };

  const labelStyle = {
    display: "block",
    mb: "9px",
    fontSize: "11px",
    fontWeight: 700,
    color: "#626262",
  };

  const ContactRow = ({ icon, title, value, href }) => {
    const content = (
      <Box
        sx={{
          minHeight: 90,
          borderBottom: "1px solid #dedede",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: href ? "pointer" : "default",
          transition: "0.25s",

          "&:hover": href
            ? {
                pl: 1,
                "& .contact-arrow": {
                  transform: "translate(3px, -3px)",
                },
              }
            : {},
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {icon}

          <Box>
            <Typography
              sx={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "1.1px",
                color: "#929292",
                mb: 0.5,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#111",
              }}
            >
              {value}
            </Typography>
          </Box>
        </Box>

        {href && (
          <ArrowUpRight
            className="contact-arrow"
            size={19}
            style={{
              transition: "0.25s",
            }}
          />
        )}
      </Box>
    );

    if (href) {
      return (
        <Box
          component="a"
          href={href}
          sx={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          {content}
        </Box>
      );
    }

    return content;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fff",
        color: "#0a0a0a",
      }}
    >
      <Navbar />
      {/* HERO */}
      <Box
        sx={{
          maxWidth: "1500px",
          mx: "auto",
          px: {
            xs: 2.5,
            md: 5,
            lg: 7,
          },
          pt: {
            xs: 7,
            md: 11,
          },
          pb: {
            xs: 6,
            md: 9,
          },
          borderBottom: "1px solid #dedede",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#1e6658",
            }}
          />

          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.5px",
            }}
          >
            HOSPITAL MANAGEMENT SUPPORT
          </Typography>
        </Box>

        <Typography
          component="h1"
          sx={{
            color:"#1e6658",
            maxWidth: "950px",
            fontSize: {
              xs: "48px",
              sm: "65px",
              md: "85px",
              lg: "100px",
            },
            lineHeight: 0.93,
            letterSpacing: {
              xs: "-2px",
              md: "-5px",
            },
            fontWeight: 600,
          }}
        >
          Let's improve
          <br />

          <Box component="span" sx={{ color: "#9b9b9b" }}>
            healthcare together.
          </Box>
        </Typography>

        <Typography
          sx={{
            mt: 4,
            maxWidth: "620px",
            color: "#6f6f6f",
            fontSize: {
              xs: "15px",
              md: "17px",
            },
            lineHeight: 1.7,
          }}
        >
          Have questions about our hospital management platform? Our team is
          here to help you streamline patient care, appointments, doctors and
          hospital operations.
        </Typography>
      </Box>

      {/* CONTACT SECTION */}
      <Box
        sx={{
          maxWidth: "1500px",
          mx: "auto",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "36% 64%",
          },
        }}
      >
        {/* LEFT */}
        <Box
          sx={{
            px: {
              xs: 2.5,
              md: 5,
              lg: 7,
            },
            py: {
              xs: 6,
              md: 8,
            },
            borderRight: {
              xs: "none",
              lg: "1px solid #dedede",
            },
            borderBottom: {
              xs: "1px solid #dedede",
              lg: "none",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 3,
              mb: 6,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                border: "1px solid #d4d4d4",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#777",
                }}
              >
                01
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: "26px",
                    md: "30px",
                  },
                  fontWeight: 600,
                  letterSpacing: "-1px",
                  mb: 1,
                }}
              >
                Get in touch
              </Typography>

              <Typography
                sx={{
                  maxWidth: "390px",
                  color: "#777",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                Talk to our healthcare technology team about your hospital
                requirements.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ borderTop: "1px solid #dedede" }}>
            <ContactRow
              icon={<Mail size={18} />}
              title="EMAIL US"
              value="contact@sampcoreai.com"
              href="mailto:contact@sampcoreai.com"
            />

          <ContactRow
              icon={<Phone size={18} />}
              title="CALL US"
              value="+91 877 075 3546"
              href="tel:+918770753546"
            />


            <ContactRow
              icon={<MapPin size={18} />}
              title="OFFICE"
              value="Bhopal, Madhya Pradesh"
            />

            <ContactRow
              icon={<Clock3 size={18} />}
              title="SUPPORT HOURS"
              value="Mon – Sat, 9 AM – 7 PM"
            />
          </Box>

          {/* SUPPORT CARD */}
          <Box
            sx={{
              mt: 7,
              p: 3,
              bgcolor: "#1e6658",
              color: "#fff",
              display: "flex",
              gap: 2.5,
            }}
          >
            <Building2 size={25} />

            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "18px",
                  mb: 1,
                }}
              >
                Already using our platform?
              </Typography>

              <Typography
                sx={{
                  color: "#aaa",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  mb: 2.5,
                }}
              >
                Our support team can help with appointments, doctors, billing
                and hospital administration.
              </Typography>

              <Button
                endIcon={<ArrowUpRight size={16} />}
                sx={{
                  p: 0,
                  minWidth: 0,
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }}
              >
                Contact Support
              </Button>
            </Box>
          </Box>
        </Box>

        {/* RIGHT FORM */}
        <Box
          sx={{
            px: {
              xs: 2.5,
              md: 5,
              lg: 7,
            },
            py: {
              xs: 6,
              md: 8,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 3,
              mb: 6,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                border: "1px solid #d4d4d4",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#777",
                }}
              >
                02
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: "26px",
                    md: "30px",
                  },
                  fontWeight: 600,
                  letterSpacing: "-1px",
                  mb: 1,
                }}
              >
                Tell us about your hospital
              </Typography>

              <Typography
                sx={{
                  color: "#777",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                Fill out the form and our team will get back to you shortly.
              </Typography>
            </Box>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              ml: {
                xs: 0,
                md: "62px",
              },
            }}
          >
            {/* NAME */}
            <Box sx={{ mb: 3.5 }}>
              <Typography sx={labelStyle}>NAME</Typography>

              <TextField
                fullWidth
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Box>

            {/* EMAIL PHONE */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 3.5 }}>
                  <Typography sx={labelStyle}>EMAIL</Typography>

                  <TextField
                    fullWidth
                    type="email"
                    name="email"
                    placeholder="you@hospital.com"
                    value={formData.email}
                    onChange={handleChange}
                    sx={inputStyle}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 3.5 }}>
                  <Typography sx={labelStyle}>PHONE</Typography>

                  <TextField
                    fullWidth
                    name="phone"
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={handleChange}
                    sx={inputStyle}
                  />
                </Box>
              </Grid>
            </Grid>



            {/* SELECT */}
            <Box sx={{ mb: 3.5 }}>
              <Typography sx={labelStyle}>HOW CAN WE HELP?</Typography>

              <FormControl fullWidth>
                <Select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  sx={{
                    height: 56,
                    borderRadius: 0,
                    bgcolor: "#f3f3f3",
                    fontSize: "14px",

                    "& fieldset": {
                      borderColor: "transparent",
                    },

                    "&:hover fieldset": {
                      borderColor: "#d4d4d4 !important",
                    },

                    "&.Mui-focused": {
                      bgcolor: "#fff",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor: "#111 !important",
                      borderWidth: "1px !important",
                    },
                  }}
                >
                  <MenuItem value="Request a Demo">Request a Demo</MenuItem>
                  <MenuItem value="Hospital Management System">
                    Hospital Management System
                  </MenuItem>
                  <MenuItem value="Appointment Management">
                    Appointment Management
                  </MenuItem>
                  <MenuItem value="Doctor Management">
                    Doctor Management
                  </MenuItem>
                  <MenuItem value="Patient Management">
                    Patient Management
                  </MenuItem>
                  <MenuItem value="Technical Support">
                    Technical Support
                  </MenuItem>
                  <MenuItem value="Partnership">Partnership</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* MESSAGE */}
            <Box sx={{ mb: 4 }}>
              <Typography sx={labelStyle}>MESSAGE</Typography>

              <TextField
                fullWidth
                multiline
                minRows={6}
                name="message"
                placeholder="Tell us about your hospital and requirements..."
                value={formData.message}
                onChange={handleChange}
                sx={{
                  ...inputStyle,

                  "& .MuiOutlinedInput-root": {
                    ...inputStyle["& .MuiOutlinedInput-root"],
                    alignItems: "flex-start",
                    py: 1,
                  },
                }}
              />
            </Box>

            {/* BUTTON */}
            <Button
              type="submit"
              fullWidth
              endIcon={<ArrowUpRight size={18} />}
              sx={{
                minHeight: 62,
                borderRadius: 0,
                bgcolor: "#1e6658",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "none",

                "&:hover": {
                  bgcolor: "black",
                },

                "& .MuiButton-endIcon": {
                  transition: "0.25s",
                },

                "&:hover .MuiButton-endIcon": {
                  transform: "translate(4px, -3px)",
                },
              }}
            >
              SUBMIT INQUIRY
            </Button>

            <Typography
              sx={{
                mt: 1.5,
                fontSize: "11px",
                color: "#999",
                lineHeight: 1.5,
              }}
            >
              By submitting this form, you agree to be contacted by our
              healthcare solutions team.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}