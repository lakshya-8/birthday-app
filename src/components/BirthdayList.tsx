import React, { ReactElement } from "react";
import { Favorites, Birthday } from "./Calendar";
import dayjs from 'dayjs'
import _ from "lodash";
import * as UIStrings from "../constants/uiStrings";
import { ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import { Flag as FlagIcon, FlagCircleOutlined as FlagOutlined } from '@mui/icons-material';

export interface BirthdayListProps {
    favorites: Favorites,
    filteredBirthdays: Birthday[],
    handleToggleFavorite: any,
    selectedDate: dayjs.Dayjs
}

const BirthdayList: React.FC<BirthdayListProps> = ({ favorites, filteredBirthdays, handleToggleFavorite, selectedDate }): ReactElement => (
    <React.Fragment>
        {!_.isEmpty(filteredBirthdays) && (<Typography variant='h6' fontWeight={"bold"}>{UIStrings.BIRTHDAYS_LIST_TITLE(dayjs(selectedDate).format('MMMM DD'))}</Typography>)}
        {(filteredBirthdays || []).map((birthday, index) => (
            <ListItem key={index}>
                <IconButton title="Favorite" onClick={() => handleToggleFavorite(birthday)}>
                    {(favorites[dayjs(selectedDate).format("MM/DD")] || []).some((fav) => fav.year === birthday.year && fav.text === birthday.text) ? (
                        <FlagIcon  />
                    ) : (
                        <FlagOutlined />
                    )}
                </IconButton>
                <ListItemText primary={birthday.text} />
            </ListItem>
        ))}
    </React.Fragment>
);

export default BirthdayList;
