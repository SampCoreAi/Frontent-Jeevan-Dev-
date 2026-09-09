import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Popover,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { motion, AnimatePresence } from 'framer-motion';

const PRIMARY_COLOR = '#1e6658';
const PRIMARY_DARK = '#154a3f';

const StyledButton = styled(Button)(({ theme, active }) => ({
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '6px 20px',
  minWidth: '80px',
  transition: 'all 0.3s ease',
  backgroundColor: active ? PRIMARY_COLOR : 'transparent',
  color: active ? '#fff' : PRIMARY_COLOR,
  border: `2px solid ${PRIMARY_COLOR}`,
  '&:hover': {
    backgroundColor: active ? PRIMARY_DARK : `${PRIMARY_COLOR}15`,
    borderColor: PRIMARY_DARK,
    transform: 'translateY(-2px)',
    boxShadow: active ? `0 4px 15px ${PRIMARY_COLOR}40` : 'none',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '4px 12px',
    fontSize: '0.875rem',
    minWidth: '70px',
  },
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '25px',
    backgroundColor: '#f5f5f5',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: PRIMARY_COLOR,
    },
    '&.Mui-focused fieldset': {
      borderColor: PRIMARY_COLOR,
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    color: '#333',
  },
});

const StyledIconButton = styled(IconButton)({
  color: PRIMARY_COLOR,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: `${PRIMARY_COLOR}15`,
    transform: 'scale(1.1) rotate(5deg)',
  },
});

const DateButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 600,
  color: PRIMARY_COLOR,
  border: `2px solid ${PRIMARY_COLOR}`,
  padding: '6px 16px',
  whiteSpace: 'nowrap',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: `${PRIMARY_COLOR}15`,
    transform: 'translateY(-2px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '4px 12px',
    fontSize: '0.875rem',
  },
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(1.5),
  },
}));

const FilterButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    width: '100%',
    gap: theme.spacing(1),
  },
}));

const SearchDateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
}));

const Filter = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  selectedDate,
  setSelectedDate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  

  const [showSearch, setShowSearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleOpenPicker = (e) => setAnchorEl(e.currentTarget);
  const handleClosePicker = () => setAnchorEl(null);
  const handleClearDateFilter = () => setSelectedDate(null);
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    handleClosePicker();
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) setSearchQuery('');
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const searchVariants = {
    hidden: { 
      width: 0, 
      opacity: 0, 
      scale: 0.8,
      x: isMobile ? -20 : 0,
    },
    visible: { 
      width: isMobile ? '100%' : 'auto', 
      opacity: 1, 
      scale: 1,
      x: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
      }
    },
    exit: { 
      width: 0, 
      opacity: 0, 
      scale: 0.8,
      x: isMobile ? -20 : 0,
      transition: { 
        duration: 0.3, 
        ease: 'easeIn',
      }
    },
  };

  return (
    <FilterContainer>
      {/* FILTER BUTTONS */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: isMobile ? '100%' : 'auto' }}
      >
        <FilterButtonsContainer>
          {['All', 'Today','Upcoming','Complete', 'Cancel', ].map((filter) => (
            <motion.div
              key={filter}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              <StyledButton
                active={activeFilter === filter ? 1 : 0}
                onClick={() => handleFilterClick(filter)}
                disableElevation
                size={isMobile ? 'small' : 'medium'}
              >
                {filter}
              </StyledButton>
            </motion.div>
          ))}
        </FilterButtonsContainer>
      </motion.div>

      {/* SEARCH AND DATE */}
      <SearchDateContainer>
        <AnimatePresence mode="wait">
          {showSearch ? (
            <motion.div
              key="search"
              variants={searchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                flex: isMobile ? 1 : 'none',
              }}
            >
              <StyledTextField
                placeholder="Search consultations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                fullWidth={isMobile}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: PRIMARY_COLOR }} />
                    </InputAdornment>
                  ),
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    toggleSearch();
                  }
                }}
              />
              <motion.div
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <StyledIconButton onClick={toggleSearch} size="small">
                  <CloseIcon />
                </StyledIconButton>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="search-icon"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <StyledIconButton onClick={toggleSearch} size={isMobile ? 'small' : 'medium'}>
                <SearchIcon />
              </StyledIconButton>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layout
        >
          <DateButton
            variant="outlined"
            startIcon={<CalendarMonthIcon />}
            onClick={handleOpenPicker}
            size={isMobile ? 'small' : 'medium'}
          >
            {selectedDate ? selectedDate.format('MMM D') : 'Date'}
          </DateButton>
        </motion.div>

        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ scale: 0, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0, opacity: 0, x: 20 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Chip
                label={selectedDate.format('MMM D')}
                onDelete={handleClearDateFilter}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  backgroundColor: `${PRIMARY_COLOR}20`,
                  color: PRIMARY_COLOR,
                  fontWeight: 600,
                  '& .MuiChip-deleteIcon': {
                    color: PRIMARY_COLOR,
                    '&:hover': { color: PRIMARY_DARK },
                  },
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePicker}
          anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: isMobile ? 'center' : 'right' }}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              mt: 1,
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateSelect}
                sx={{
                  '& .MuiPickersDay-root': {
                    '&.Mui-selected': {
                      backgroundColor: PRIMARY_COLOR,
                      '&:hover': { backgroundColor: PRIMARY_DARK },
                    },
                  },
                  '& .MuiDayCalendar-weekDayLabel': {
                    color: PRIMARY_COLOR,
                    fontWeight: 600,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Popover>
      </SearchDateContainer>
    </FilterContainer>
  );
};

export default Filter;