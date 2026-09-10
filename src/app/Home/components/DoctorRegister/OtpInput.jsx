import { Stack, TextField } from "@mui/material";

export default function OtpInput({ value, onChange }) {
  const values = value.split("");

  return (
    <Stack direction="row" spacing={1.2}>
      {[0,1,2,3,4,5].map((i)=>(
        <TextField
          key={i}
          value={values[i] || ""}
          onChange={(e)=>{
            const otp = value.split("");
            otp[i]=e.target.value.slice(-1);
            onChange(otp.join(""));
          }}
          inputProps={{
            maxLength:1,
            style:{
              textAlign:"center",
              fontSize:22,
              fontWeight:600
            }
          }}
          sx={{
            width:56,
            "& .MuiOutlinedInput-root":{
              height:56,
              borderRadius:"12px"
            }
          }}
        />
      ))}
    </Stack>
  );
}