import "react-international-phone/style.css";

import {
  BaseTextFieldProps,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import {
  CountryIso2,
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";

export interface MUIPhoneProps extends BaseTextFieldProps {
  value: string;
  onChange: (phone: string, inputValue: string, iso2: string) => void;
}

export const MuiPhone: React.FC<MUIPhoneProps> = ({
  value,
  onChange,
  ...restProps
}) => {
  const {
    inputValue,
    handlePhoneValueChange,
    inputRef,
    country,
    setCountry,
    phone,
  } = usePhoneInput({
    defaultCountry: "ca",
    value,
    countries: defaultCountries,
    onChange: (data) => {
      onChange(data.phone, data.inputValue, data.country.iso2);
    },
  });

  return (
    <TextField
      size="small"
      variant="outlined"
      color="primary"
      placeholder="Phone number"
      value={inputValue}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={inputRef}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" style={{ marginLeft: "-15px" }}>
            <Select
              className="bg-gray-100"
              MenuProps={{
                style: {
                  height: "300px",
                  width: "360px",
                  top: "10px",
                  left: "-34px",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
              }}
              sx={{
                width: "max-content",
                // Remove default outline (display only on focus)
                fieldset: {
                  display: "none",
                },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: {
                    display: "block",
                  },
                },
                // Update default spacing
                ".MuiSelect-select": {
                  padding: "8px 15px",
                  paddingRight: "24px !important",
                },
                svg: {
                  right: 0,
                },
              }}
              value={country.iso2}
              onChange={(e) => setCountry(e.target.value as CountryIso2)}
              renderValue={(value) => (
                <div style={{ display: "flex" }}>
                  <p style={{ fontWeight: 'bold', fontSize: 14 }}>{value.toLocaleUpperCase()}</p>
                  {/* <p style={{ marginLeft: "5px" }}>+{country.dialCode}</p> */}
                  {/* <FlagImage
                    iso2={value}
                    style={{ display: "flex", marginLeft: "5px" }}
                  /> */}
                </div>
              )}
            >
              {defaultCountries.map((c) => {
                const country = parseCountry(c);
                return (
                  <MenuItem key={country.iso2} value={country.iso2}>
                    <FlagImage
                      iso2={country.iso2}
                      style={{ marginRight: "8px" }}
                    />
                    <Typography marginRight="8px">{country.name}</Typography>
                    <Typography color="gray">+{country.dialCode}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </InputAdornment>
        ),
      }}
      {...restProps}
    />
  );
};
