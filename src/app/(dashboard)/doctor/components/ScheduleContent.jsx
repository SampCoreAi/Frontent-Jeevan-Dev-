// "use client";
// import React, { useState, useEffect } from "react";

// import { jwtDecode } from "jwt-decode";
// import {
//   Box,
//   Button,
//   TableContainer,
//   TextField,
//   MenuItem,
//   Typography,
//   Divider,
//   Grid,
//   // Table,
//   TableHead,
//   TableRow,
//   TableBody,
//   TableCell,
//   Chip,
//   Card,
//   CardContent,
//   Paper,
//   IconButton,
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import DownloadIcon from "@mui/icons-material/Download";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// export default function SchedulePage() {
//   const [location, setLocation] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [slotDuration, setSlotDuration] = useState("");
//   const [breakDuration, setBreakDuration] = useState("");
//   const [activeDays, setActiveDays] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [savedSchedules, setSavedSchedules] = useState([]);
//   const [viewSlots, setViewSlots] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   useEffect(() => {
//     const fetchSchedules = async () => {
//       const token = localStorage.getItem("token");
//       let doctor_id = null;

//       if (token) {
//         try {
//           const decoded = jwtDecode(token);
//           doctor_id = decoded.id;
//         } catch {
//           return;
//         }
//       }

//       if (!doctor_id) return;

//       try {
//         const res = await fetch(
//           `http://localhost:4000/api/schedules/doctor/${doctor_id}`
//         );

//         const result = await res.json();

//         // 🔑 Ensure array
//         const schedulesArray = Array.isArray(result)
//           ? result
//           : result.data || [];

//         const formattedData = schedulesArray.map((item) => ({
//           location: item.location_name,
//           startTime: item.start_time,
//           endTime: item.end_time,
//           slotDuration: item.slot_duration,
//           breakDuration: item.break_minutes,
//           activeDays: item.active_days,
//           startDate: item.start_date,
//           endDate: item.end_date,
//         }));

//         setSavedSchedules(formattedData);
//       } catch (error) {
//         console.error("Fetch error:", error);
//         setSavedSchedules([]); // fallback
//       }
//     };

//     fetchSchedules();
//   }, []);

//   const generateSlots = (start, end, slot, breakTime, location) => {
//     let slots = [];
//     let [sh, sm] = start.split(":").map(Number);
//     let [eh, em] = end.split(":").map(Number);

//     let startMinutes = sh * 60 + sm;
//     let endMinutes = eh * 60 + em;

//     while (startMinutes + slot <= endMinutes) {
//       let slotStartH = Math.floor(startMinutes / 60)
//         .toString()
//         .padStart(2, "0");
//       let slotStartM = (startMinutes % 60).toString().padStart(2, "0");

//       let slotEndMinutes = startMinutes + slot;
//       let slotEndH = Math.floor(slotEndMinutes / 60)
//         .toString()
//         .padStart(2, "0");
//       let slotEndM = (slotEndMinutes % 60).toString().padStart(2, "0");

//       slots.push({
//         start: `${slotStartH}:${slotStartM}`,
//         end: `${slotEndH}:${slotEndM}`,
//         location,
//       });

//       startMinutes = slotEndMinutes + breakTime;
//     }
//     return slots;
//   };
//   const handleSave = async () => {
//     if (!location || !startTime || !endTime || !slotDuration) return;

//     // Token se doctor_id le rahe hain
//     const token = localStorage.getItem("token");
//     let doctor_id = null;

//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         doctor_id = decoded.id;
//         console.log("Decoded doctor_id:", doctor_id);
//       } catch (err) {
//         console.error("Invalid token", err);
//       }
//     }

//     if (!doctor_id) {
//       alert("Doctor not found, please login again");
//       return;
//     }

//     const payload = {
//       doctor_id: Number(doctor_id),
//       location_name: location,
//       start_time: startTime,
//       end_time: endTime,
//       slot_duration: Number(slotDuration),
//       break_minutes: Number(breakDuration) || 0,
//       active_days: activeDays,
//       start_date: startDate || null,
//       end_date: endDate || null,
//     };

//     try {
//       const response = await fetch(
//         "http://localhost:4000/api/schedules/create",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!response.ok) throw new Error("Failed to create schedule");

//       const data = await response.json();
//       console.log("Schedule created:", data);

//       setSavedSchedules([...savedSchedules, payload]);

//       // Clear form
//       setLocation("");
//       setStartTime("");
//       setEndTime("");
//       setSlotDuration("");
//       setBreakDuration("");
//       setActiveDays([]);
//       setStartDate("");
//       setEndDate("");
//     } catch (error) {
//       console.error(error);
//       alert("Error creating schedule");
//     }
//   };

//   const handleDelete = (index) => {
//     const updatedSchedules = [...savedSchedules];
//     updatedSchedules.splice(index, 1);
//     setSavedSchedules(updatedSchedules);
//   };

//   const handleEdit = (index) => {
//     const schedule = savedSchedules[index];
//     setLocation(schedule.location);
//     setStartTime(schedule.startTime);
//     setEndTime(schedule.endTime);
//     setSlotDuration(schedule.slotDuration);
//     setBreakDuration(schedule.breakDuration);
//     setActiveDays(schedule.activeDays);
//     setStartDate(schedule.startDate);
//     setEndDate(schedule.endDate);

//     // remove from savedSchedules
//     const updatedSchedules = [...savedSchedules];
//     updatedSchedules.splice(index, 1);
//     setSavedSchedules(updatedSchedules);
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return "";
//     try {
//       const [hours, minutes] = timeString.split(":");
//       const hour = parseInt(hours);
//       const ampm = hour >= 12 ? "PM" : "AM";
//       const formattedHour = hour % 12 || 12;
//       return `${formattedHour}:${minutes} ${ampm}`;
//     } catch {
//       return timeString;
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Not set";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch {
//       return dateString;
//     }
//   };
//   return (
//     <Grid sx={{ p: 2, mt: 7 }}>
//       <Grid
//         container
//         spacing={2}
//         mb={2}
//         sx={{
//           backgroundColor: "white",
//           borderRadius: 0.5,
//           boxShadow: "0 4px 12px #0f7468",
//           overflow: "hidden",
//           display: "flex",
//           width: "100%",
//           height: "100%",
//           padding: 2,
//           paddingTop: 4,
//         }}
//       >
//         <Grid
//           container
//           spacing={2}
//           sx={{ alignItems: "center", width: "100%", gap: 5 }}
//         >
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="Location"
//               placeholder="Enter location details"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               rows={3}
//               InputLabelProps={{
//                 style: { color: "black" },
//               }}
//             />
//           </Grid>

//           <Grid item xs={6} sm={3}>
//             <TextField
//               type="time"
//               fullWidth
//               label="Start Time"
//               InputLabelProps={{ shrink: true }}
//               value={startTime}
//               onChange={(e) => setStartTime(e.target.value)}
//               InputProps={{ endAdornment: <AccessTimeIcon /> }}
//               sx={{
//                 "& .MuiInputLabel-root": {
//                   color: "black",
//                 },
//               }}
//             />
//           </Grid>

//           <Grid item xs={6} sm={3}>
//             <TextField
//               type="time"
//               fullWidth
//               label="End Time"
//               InputLabelProps={{ shrink: true }}
//               value={endTime}
//               onChange={(e) => setEndTime(e.target.value)}
//               InputProps={{ endAdornment: <AccessTimeIcon /> }}
//               sx={{
//                 "& .MuiInputLabel-root": {
//                   color: "black",
//                 },
//               }}
//             />
//           </Grid>

//           <Grid item xs={6} sm={3}>
//             <TextField
//               type="number"
//               fullWidth
//               label="Slot Duration (minutes)"
//               value={slotDuration}
//               onChange={(e) => setSlotDuration(e.target.value)}
//               InputProps={{ endAdornment: <AccessTimeIcon /> }}
//               sx={{
//                 width: 230,
//                 "& .MuiFilledInput-root": {
//                   backgroundColor: "#000000ff",
//                   color: "#000000",
//                 },
//                 "& .MuiInputLabel-root": {
//                   color: "#000000ff",
//                 },
//                 "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
//                   {
//                     WebkitAppearance: "none",
//                     margin: 0,
//                   },
//                 "& input[type=number]": {
//                   MozAppearance: "textfield",
//                 },
//               }}
//             />
//           </Grid>

//           <Grid item xs={6} sm={3}>
//             <TextField
//               type="number"
//               fullWidth
//               label="Break Between Slots (minutes)"
//               value={breakDuration}
//               onChange={(e) => setBreakDuration(e.target.value)}
//               InputProps={{ endAdornment: <AccessTimeIcon /> }}
//               sx={{
//                 width: 300,
//                 "& .MuiFilledInput-root": {
//                   backgroundColor: "#000000ff",
//                   color: "#000000",
//                 },
//                 "& .MuiInputLabel-root": {
//                   color: "#000000ff",
//                 },
//                 "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
//                   {
//                     WebkitAppearance: "none",
//                     margin: 0,
//                   },
//                 "& input[type=number]": {
//                   MozAppearance: "textfield",
//                 },
//               }}
//             />
//           </Grid>

//           <Typography variant="h6" sx={{ mt: 2, mb: 1, ml: 1 }}>
//             Active Days
//           </Typography>

//           <Grid
//             item
//             xs={12}
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               flexWrap: "wrap",
//               gap: 2,
//               paddingY: 1,
//             }}
//           >
//             {daysOfWeek.map((day) => (
//               <Button
//                 key={day}
//                 onClick={() => {
//                   if (activeDays.includes(day)) {
//                     setActiveDays(activeDays.filter((d) => d !== day));
//                   } else {
//                     setActiveDays([...activeDays, day]);
//                   }
//                 }}
//                 sx={{
//                   border: "1px solid black",
//                   color: activeDays.includes(day) ? "white" : "black",
//                   backgroundColor: activeDays.includes(day)
//                     ? "#469d8f"
//                     : "transparent",
//                   fontWeight: 900,
//                   fontSize: 16,
//                   borderRadius: 1,
//                   paddingX: 5,
//                   paddingY: 1,
//                   "&:hover": {
//                     backgroundColor: "#0f7468",
//                     color: "white",
//                   },
//                 }}
//               >
//                 {day}
//               </Button>
//             ))}
//           </Grid>

//           <Grid item xs={6} sm={3}>
//             <TextField
//               type="date"
//               fullWidth
//               label="Start Date ( Optional )"
//               InputLabelProps={{ shrink: true }}
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               InputProps={{ endAdornment: <CalendarTodayIcon /> }}
//               sx={{
//                 "& .MuiInputLabel-root": {
//                   color: "black",
//                 },
//               }}
//             />
//           </Grid>

//           <Grid item xs={6} sm={3}>
//             <TextField
//               type="date"
//               fullWidth
//               label="End Date ( Optional )"
//               InputLabelProps={{ shrink: true }}
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               InputProps={{ endAdornment: <CalendarTodayIcon /> }}
//               sx={{
//                 "& .MuiInputLabel-root": {
//                   color: "black",
//                 },
//               }}
//             />
//           </Grid>
//         </Grid>
//         <Divider sx={{ width: "100%", my: 0 }} />

//         <Grid>
//           <Button
//             variant="contained"
//             onClick={handleSave}
//             sx={{ mr: 1, px: 4 }}
//           >
//             Save
//           </Button>
//           <Button
//             variant="outlined"
//             sx={{ mr: 1, px: 4 }}
//             onClick={() => {
//               setLocation("");
//               setStartTime("");
//               setEndTime("");
//               setSlotDuration("");
//               setBreakDuration("");
//               setActiveDays([]);
//               setStartDate("");
//               setEndDate("");
//             }}
//           >
//             Clear
//           </Button>
//         </Grid>
//       </Grid>

//       <Typography
//         variant="h5"
//         sx={{
//           mb: 3,
//           color: "#0f7468",
//           fontWeight: 600,
//           display: "flex",
//           alignItems: "center",
//           gap: 1,
//         }}
//       >
//         <AccessTimeIcon />
//         Saved Schedules
//         <Chip
//           label={savedSchedules.length}
//           size="small"
//           sx={{ bgcolor: "#0f7468", color: "white", fontWeight: 600 }}
//         />
//       </Typography>

//       {savedSchedules.length === 0 ? (
//         <Paper
//           sx={{
//             p: 4,
//             textAlign: "center",
//             bgcolor: "grey.50",
//             border: "2px dashed",
//             borderColor: "grey.300",
//           }}
//         >
//           <AccessTimeIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
//           <Typography variant="h6" color="grey.600" gutterBottom>
//             No Schedules Created Yet
//           </Typography>
//           <Typography variant="body2" color="grey.500" sx={{ mb: 3 }}>
//             Create your first schedule to get started with appointment
//             management
//           </Typography>
//         </Paper>
//       ) : (
//         <Grid container spacing={3}>
//           {savedSchedules.map((schedule, index) => (
//             <Grid key={index} item xs={12} sm={6} md={4}>
//               <Card
//                 sx={{
//                   height: "100%",
//                   borderRadius: 2,
//                   transition: "0.3s",
//                   "&:hover": {
//                     transform: "translateY(-6px)",
//                     boxShadow: 6,
//                   },
//                 }}
//               >
//                 <CardContent sx={{ p: 3 }}>
//                   {/* Header */}
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="subtitle2" color="black">
//                       Location
//                     </Typography>
//                     <Typography fontWeight={600}>
//                       {schedule.location}
//                     </Typography>

//                     <Typography
//                       variant="body2"
//                       color="black"
//                       sx={{ mt: 0.5 }}
//                     >
//                       {formatTime(schedule.startTime)} –{" "}
//                       {formatTime(schedule.endTime)}
//                     </Typography>
//                   </Box>

//                   <Divider sx={{ my: 2 }} />

//                   {/* Slot Info */}
//                   <Grid container spacing={2} sx={{ mb: 2 }}>
//                     <Grid item xs={6}>
//                       <Typography variant="caption">Slot Duration</Typography>
//                       <Typography fontWeight={500}>
//                         {schedule.slotDuration} min
//                       </Typography>
//                     </Grid>

//                     <Grid item xs={6}>
//                       <Typography variant="caption">Break Time</Typography>
//                       <Typography fontWeight={500}>
//                         {schedule.breakDuration} min
//                       </Typography>
//                     </Grid>
//                   </Grid>

//                   {/* Date Range */}
//                   {(schedule.startDate || schedule.endDate) && (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                         mb: 2,
//                       }}
//                     >
//                       <CalendarTodayIcon fontSize="small" />
//                       <Typography variant="caption">
//                         {formatDate(schedule.startDate)} →{" "}
//                         {formatDate(schedule.endDate)}
//                       </Typography>
//                     </Box>
//                   )}

//                   {/* Active Days */}
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" gutterBottom>
//                       Active Days
//                     </Typography>
//                     <Stack direction="row" flexWrap="wrap" gap={0.5}>
//                       {daysOfWeek.map((day) => (
//                         <Chip
//                           key={day}
//                           label={day}
//                           size="small"
//                           sx={{
//                             bgcolor: schedule.activeDays?.includes(day)
//                               ? "#0f7468"
//                               : "transparent",
//                             color: schedule.activeDays?.includes(day)
//                               ? "white"
//                               : "text.secondary",
//                             fontSize: "0.7rem",
//                             height: 22,
//                             borderRadius: 0.5,
//                           }}
//                         />
//                       ))}
//                     </Stack>
//                   </Box>

//                   <Divider sx={{ my: 2 }} />

//                   {/* Actions */}
//                   <Stack direction="row" spacing={1}>
//                     <Button
//                       fullWidth
//                       size="small"
//                       variant="contained"
//                       startIcon={<VisibilityIcon />}
//                       onClick={() => {
//                         const slots = generateSlots(
//                           schedule.startTime,
//                           schedule.endTime,
//                           Number(schedule.slotDuration),
//                           Number(schedule.breakDuration),
//                           schedule.location
//                         );
//                         setViewSlots(slots);
//                         setOpenDialog(true);
//                       }}
//                       sx={{
//                         bgcolor: "#0f7468",
//                         "&:hover": { bgcolor: "#0d655a" },
//                       }}
//                     >
//                       View Slots
//                     </Button>

//                     <IconButton onClick={() => handleEdit(index)}>
//                       <EditIcon fontSize="small" />
//                     </IconButton>

//                     <IconButton onClick={() => handleDelete(index)}>
//                       <DeleteIcon fontSize="small" color="error" />
//                     </IconButton>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* View Slots Dialog */}

//       <Dialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         maxWidth="sm"
//         fullWidth={false}
//         PaperProps={{
//           sx: {
//             borderRadius: 2,
//             boxShadow: "0px 10px 40px rgba(0,0,0,0.15)",
//             overflow: "hidden",
//             width: 450,
//           },
//         }}
//       >
//         <DialogContent sx={{ p: 0, height: "100%" }}>
//           {viewSlots.length > 0 && (
//             <Box
//               sx={{
//                 position: "relative",
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               {/* Table */}
//               <TableContainer
//                 component={Paper}
//                 elevation={0}
//                 sx={{
//                   borderRadius: 0,
//                   maxHeight: "calc(100% - 40px)",
//                   overflowY: "auto",
//                   scrollBehavior: "smooth",
//                   "&::-webkit-scrollbar": { width: 6 },
//                   "&::-webkit-scrollbar-track": { background: "transparent" },
//                   "&::-webkit-scrollbar-thumb": {
//                     background: "rgba(0,0,0,0.2)",
//                     borderRadius: 8,
//                   },
//                   "&::-webkit-scrollbar-thumb:hover": {
//                     background: "rgba(0,0,0,0.35)",
//                   },
//                 }}
//               >
//                 <Table stickyHeader>
//                   <TableHead>
//                     <TableRow
//                       sx={{
//                         "& th": {
//                           bgcolor: "#f9fafb",
//                           fontWeight: 600,
//                           fontSize: "0.85rem",
//                           color: "#374151",
//                           borderBottom: "2px solid #e5e7eb",
//                         },
//                       }}
//                     >
//                       <TableCell sx={{ width: 60 }}>#</TableCell>
//                       <TableCell>Start</TableCell>
//                       <TableCell>End</TableCell>
//                       <TableCell>Location</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {viewSlots.map((slot, index) => {
//                       const start = new Date(slot.start);
//                       const end = new Date(slot.end);
//                       const formatTime = (date) =>
//                         date.toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         });

//                       return (
//                         <TableRow
//                           key={index}
//                           sx={{
//                             "&:nth-of-type(even)": { bgcolor: "#fafafa" },
//                             "&:hover": {
//                               bgcolor: "#f1f5f9",
//                               transition: "background 0.2s ease",
//                             },
//                           }}
//                         >
//                           <TableCell>
//                             <Box
//                               sx={{
//                                 width: 28,
//                                 height: 28,
//                                 bgcolor: "#0f766e",
//                                 color: "white",
//                                 borderRadius: "50%",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 fontSize: "0.8rem",
//                                 fontWeight: 600,
//                               }}
//                             >
//                               {index + 1}
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Typography fontWeight={600} color="#111827">
//                               {formatTime(start)}
//                             </Typography>
//                           </TableCell>
//                           <TableCell>
//                             <Typography fontWeight={600} color="#111827">
//                               {formatTime(end)}
//                             </Typography>
//                           </TableCell>
//                           <TableCell>
//                             <Chip
//                               label={slot.location}
//                               size="small"
//                               sx={{
//                                 bgcolor: "#e0f2fe",
//                                 color: "#0369a1",
//                                 fontWeight: 500,
//                               }}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* Summary Bar without padding */}
//               <Box
//                 sx={{
//                   bgcolor: "#ffffff",
//                   borderTop: "1px solid #e5e7eb",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography variant="body2" color="black" sx={{ ml: 3, py: 2 }}>
//                   Showing {viewSlots.length} time slots
//                 </Typography>
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Grid>
//   );
// }
