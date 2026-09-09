const formatTo12Hour = (time) => {
  if (!time) return '';

  const [hour, minute] = time.split(':');
  let h = parseInt(hour, 10);

  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;

  return `${h}:${minute} ${ampm}`;
};