"use client";

import { Box, Paper, Typography, Avatar, Fade } from "@mui/material";
import { motion } from "framer-motion";

export default function AuthCard({ children, title, subtitle, icon }) {
  return (
   <Paper
  elevation={0}
 sx={{
  width: { xs: "100%", md: "50%" },
  backgroundColor: "#fff",
  display: "flex",
py:3,
  flexDirection: "column",
  justifyContent: "center",
  position: "relative",
  borderRadius:0,
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "4px",
    backgroundColor: "#1E6658",
    zIndex: 1,
  },

  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "4px",
    backgroundColor: "#1E6658",
    zIndex: 1,
  },
}}
>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 400,
            mx: "auto",
            px: 2,
          }}
        >
          {icon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1 
              }}
            >
              <Avatar
                src={icon}
                sx={{
                  width: 100,
                  borderRadius: 4,
                  height: 100,
                  mx: "auto",
                  mb: 2,
                  boxShadow: "0 8px 32px rgba(30, 102, 88, 0.3)",
                  border: "3px solid #1E6658",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05) rotate(-5deg)",
                  },
                }}
              />
            </motion.div>
          )}
          
          {title && (
            <Typography
              variant="h4"
              fontWeight={800}
              color=""
              textAlign="center"
              mb={1}
              sx={{
                fontSize: { xs: "1.75rem", sm: "2rem" },
                letterSpacing: "-0.5px",
                background: "linear-gradient(135deg, #1E6658, #2E8B7A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </Typography>
          )}
          
          {subtitle && (
            <Typography
              variant="body1"
              color="black"
              textAlign="center"
              mb={4}
              sx={{ 
                fontSize: "0.95rem",
                opacity: 0.8,
                maxWidth: "100%",
                mx: "auto"
              }}
            >
              {subtitle}
            </Typography>
          )}
          
          <Fade in timeout={600}>
            <Box sx={{ width: "100%" }}>
              {children}
            </Box>
          </Fade>
        </Box>
      </motion.div>
    </Paper>
  );
}



//  <Paper
//   elevation={0}
//  sx={{
//   width: { xs: "100%", md: "50%" },
//   backgroundColor: "red",
//   display: "flex",
  
//   flexDirection: "column",
//   justifyContent: "center",
//   position: "relative",
//   borderRadius:0,
//   overflow: "hidden",
//   boxShadow: "0 8px 24px rgba(0,0,0,0.12)",

//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "4px",
//     backgroundColor: "#1E6658",
//     zIndex: 1,
//   },

//   "&::after": {
//     content: '""',
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     width: "100%",
//     height: "4px",
//     backgroundColor: "#1E6658",
//     zIndex: 1,
//   },
// }}
// >
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             width: "100%",
//             maxWidth: 400,
//             mx: "auto",
//             px: 2,
//           }}
//         >
//           {icon && (
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ 
//                 type: "spring",
//                 stiffness: 260,
//                 damping: 20,
//                 delay: 0.1 
//               }}
//             >
//               <Avatar
//                 src={icon}
//                 sx={{
//                   width: 100,
//                   borderRadius: 4,
//                   height: 100,
//                   mx: "auto",
//                   mb: 2,
//                   boxShadow: "0 8px 32px rgba(30, 102, 88, 0.3)",
//                   border: "3px solid #1E6658",
//                   transition: "transform 0.3s ease",
//                   "&:hover": {
//                     transform: "scale(1.05) rotate(-5deg)",
//                   },
//                 }}
//               />
//             </motion.div>
//           )}
          
//           {title && (
//             <Typography
//               variant="h4"
//               fontWeight={800}
//               color=""
//               textAlign="center"
//               mb={1}
//               sx={{
//                 fontSize: { xs: "1.75rem", sm: "2rem" },
//                 letterSpacing: "-0.5px",
//                 background: "linear-gradient(135deg, #1E6658, #2E8B7A)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 backgroundClip: "text",
//               }}
//             >
//               {title}
//             </Typography>
//           )}
          
//           {subtitle && (
//             <Typography
//               variant="body1"
//               color="black"
//               textAlign="center"
//               mb={4}
//               sx={{ 
//                 fontSize: "0.95rem",
//                 opacity: 0.8,
//                 maxWidth: "100%",
//                 mx: "auto"
//               }}
//             >
//               {subtitle}
//             </Typography>
//           )}
          
//           <Fade in timeout={600}>
//             <Box sx={{ width: "100%" }}>
//               {children}
//             </Box>
//           </Fade>
//         </Box>
//       </motion.div>
//     </Paper>