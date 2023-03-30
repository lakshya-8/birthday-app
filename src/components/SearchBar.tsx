import React, { ReactElement } from "react";
import { TextField } from '@mui/material';

interface SearchBarProps {
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BirthdaySearch: React.FC<SearchBarProps> = ({ handleSearchChange }): ReactElement => {
    return (
        <TextField
            label="Search birthdays"
            onChange={handleSearchChange}
            variant="outlined"
        />
    );
};

export default BirthdaySearch;